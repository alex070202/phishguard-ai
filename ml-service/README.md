# PhishGuard AI Image Model Service

This FastAPI service exposes the image model interface used by the Node.js backend.

It loads the pretrained HuggingFace model `jacoballessio/ai-image-detect-distilled` once on startup and combines the model prediction with metadata and forensic signals. If the model fails to load, the service stays available and returns a clearly marked fallback result.

## Run

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

## Endpoint

```http
POST /predict-ai-image
Content-Type: multipart/form-data
```

Field:

```text
image
```

The Node.js backend can call this service by setting:

```text
AI_IMAGE_MODEL_URL=http://localhost:8001/predict-ai-image
```

## Model Output

The response keeps a stable contract:

- `aiProbability`
- `status`
- `label`
- `confidence`
- `modelName`
- `modelAvailable`
- `fallbackUsed`
- `explanation`
- `signals`

Detection is probabilistic and should not be presented as absolute proof that an image is or is not AI-generated.
