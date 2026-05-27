from contextlib import asynccontextmanager
from io import BytesIO

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from transformers import AutoModelForImageClassification, ViTImageProcessor

MODEL_NAME = "jacoballessio/ai-image-detect-distilled"

model_state = {
    "processor": None,
    "model": None,
    "load_error": None,
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        model_state["processor"] = load_image_processor()
        model_state["model"] = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
        model_state["model"].eval()
        model_state["load_error"] = None
    except Exception as error:  # Service must stay available and return fallback metadata.
        model_state["load_error"] = str(error)
    yield


app = FastAPI(title="PhishGuard AI Image Model Service", lifespan=lifespan)


@app.get("/health")
def health():
    return {
        "status": "ok" if is_model_available() else "degraded",
        "modelAvailable": is_model_available(),
        "modelName": MODEL_NAME,
        "loadError": model_state["load_error"],
    }


@app.post("/predict-ai-image")
async def predict_ai_image(image: UploadFile = File(...)):
    content = await image.read()
    if not content:
        raise HTTPException(status_code=400, detail="Image file is required.")

    if image.content_type not in {"image/png", "image/jpeg", "image/webp"}:
        raise HTTPException(status_code=400, detail="Unsupported image type.")

    try:
        pil_image = Image.open(BytesIO(content))
        pil_image.load()
    except UnidentifiedImageError as error:
        raise HTTPException(status_code=400, detail="Invalid image file.") from error

    signals = extract_metadata_signals(pil_image, image, len(content))
    metadata_score = metadata_probability(signals)

    if not is_model_available():
        probability = metadata_score
        status = status_from_probability(probability)
        return {
            "aiProbability": probability,
            "status": status,
            "label": status,
            "confidence": probability,
            "modelName": MODEL_NAME,
            "modelAvailable": False,
            "fallbackUsed": True,
            "explanation": [
                "AI image model is not available; fallback metadata analysis was used.",
                f"Model load error: {model_state['load_error'] or 'not loaded'}",
            ],
            "signals": signals,
        }

    try:
        model_probability, model_label, model_confidence = run_model_prediction(pil_image)
        final_probability = clamp_probability((model_probability * 0.85) + (metadata_score * 0.15))
        status = status_from_probability(final_probability)
        return {
            "aiProbability": final_probability,
            "status": status,
            "label": model_label,
            "confidence": model_confidence,
            "modelName": MODEL_NAME,
            "modelAvailable": True,
            "fallbackUsed": False,
            "explanation": [
                "Pretrained HuggingFace image classifier produced the primary prediction.",
                "Final probability combines 85% model score with 15% metadata and forensic indicators.",
                "The result is probabilistic and should not be treated as absolute proof.",
            ],
            "signals": signals,
        }
    except Exception as error:
        probability = metadata_score
        status = status_from_probability(probability)
        return {
            "aiProbability": probability,
            "status": status,
            "label": status,
            "confidence": probability,
            "modelName": MODEL_NAME,
            "modelAvailable": False,
            "fallbackUsed": True,
            "explanation": [
                "Model inference failed; fallback metadata analysis was used.",
                str(error),
            ],
            "signals": signals,
        }


def is_model_available() -> bool:
    return model_state["processor"] is not None and model_state["model"] is not None


def load_image_processor():
    # This model ships a legacy ViTFeatureExtractor config that recent
    # Transformers builds may not resolve through AutoImageProcessor.
    return ViTImageProcessor(
        do_resize=True,
        size={"height": 224, "width": 224},
        resample=2,
        do_rescale=True,
        rescale_factor=1 / 255,
        do_normalize=True,
        image_mean=[0.5, 0.5, 0.5],
        image_std=[0.5, 0.5, 0.5],
    )


def run_model_prediction(image: Image.Image):
    processor = model_state["processor"]
    model = model_state["model"]
    rgb_image = image.convert("RGB")
    inputs = processor(images=rgb_image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    id2label = getattr(model.config, "id2label", {}) or {}
    label_scores = [
        (int(index), id2label.get(int(index), str(index)), float(probabilities[index]))
        for index in range(probabilities.shape[0])
    ]
    best_index, best_label, best_probability = max(label_scores, key=lambda item: item[2])
    ai_probability = probability_for_ai_label(label_scores, best_index, best_probability)
    return clamp_probability(ai_probability), normalize_label(best_label), clamp_probability(best_probability)


def probability_for_ai_label(label_scores, best_index, best_probability):
    ai_tokens = ["ai", "artificial", "generated", "synthetic", "fake"]
    real_tokens = ["real", "human", "natural", "photo", "authentic"]
    ai_matches = [score for _, label, score in label_scores if any(token in label.lower() for token in ai_tokens)]
    real_matches = [score for _, label, score in label_scores if any(token in label.lower() for token in real_tokens)]

    if ai_matches:
        return max(ai_matches)
    if real_matches and len(label_scores) == 2:
        return 1 - max(real_matches)
    if len(label_scores) == 2:
        return best_probability if best_index == 1 else 1 - best_probability
    return best_probability


def extract_metadata_signals(image: Image.Image, upload: UploadFile, file_size: int):
    exif = image.getexif()
    software = exif.get(0x0131) if exif else None
    width, height = image.size
    pixel_count = max(width * height, 1)
    bytes_per_pixel = round(file_size / pixel_count, 4)
    format_name = image.format or upload.content_type or "unknown"
    compression_notes = []

    if format_name.upper() == "JPEG":
        compression_notes.append("jpeg_quantization_present" if getattr(image, "quantization", None) else "jpeg_quantization_missing")
    if bytes_per_pixel < 0.2:
        compression_notes.append("very_high_compression")
    elif bytes_per_pixel < 0.6:
        compression_notes.append("high_compression")
    else:
        compression_notes.append("moderate_or_low_compression")

    return {
        "exifPresent": bool(exif),
        "softwareTag": str(software) if software else None,
        "width": width,
        "height": height,
        "megapixels": round(pixel_count / 1_000_000, 2),
        "format": format_name,
        "mimeType": upload.content_type,
        "fileSizeBytes": file_size,
        "bytesPerPixel": bytes_per_pixel,
        "compressionIndicators": compression_notes,
    }


def metadata_probability(signals) -> float:
    score = 0.30
    if not signals["exifPresent"]:
        score += 0.12
    software = (signals.get("softwareTag") or "").lower()
    if any(token in software for token in ["midjourney", "stable diffusion", "dall", "comfyui", "firefly"]):
        score += 0.25
    if signals["format"].upper() == "WEBP":
        score += 0.08
    if "very_high_compression" in signals["compressionIndicators"]:
        score += 0.10
    if signals["megapixels"] < 0.2:
        score += 0.05
    return clamp_probability(score)


def status_from_probability(probability: float) -> str:
    if probability >= 0.70:
        return "possibly_ai_generated"
    if probability >= 0.45:
        return "needs_review"
    return "low_suspicion"


def normalize_label(label: str) -> str:
    return label.lower().replace(" ", "_").replace("-", "_")


def clamp_probability(value: float) -> float:
    return max(0.0, min(0.99, round(float(value), 4)))
