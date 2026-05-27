import { buildImageReport } from './reportAgent.js'
import { imageStatusFromProbability, scoreIndicators } from './riskScoringAgent.js'
import { predictAiImage } from '../services/imageModelService.js'

export async function analyzeImageFile(file) {
  const fileName = file.originalname.toLowerCase()
  const indicatorMatches = [
    {
      key: 'webp_format',
      label: 'WEBP compressed format',
      weight: 14,
      detected: file.mimetype === 'image/webp',
      evidence: file.mimetype,
    },
    {
      key: 'generation_filename',
      label: 'Generation-related file name',
      weight: 22,
      detected: ['ai', 'generated', 'synthetic', 'midjourney', 'stable-diffusion'].some((word) => fileName.includes(word)),
      evidence: file.originalname,
    },
    {
      key: 'small_file_size',
      label: 'Small compressed file size',
      weight: 10,
      detected: file.size < 180000,
      evidence: `${file.size} bytes`,
    },
    {
      key: 'missing_camera_hint',
      label: 'No camera-origin hint in file name',
      weight: 8,
      detected: !/(img_|dsc|photo|camera)/i.test(file.originalname),
      evidence: file.originalname,
    },
  ]

  const modelPrediction = await predictAiImage(file)
  const fallbackSignals = buildFallbackSignals(file)
  const modelScore = modelPrediction.modelAvailable ? Math.round(modelPrediction.aiProbability * 100) : null
  const { score: fallbackScore, detectedIndicators } = scoreIndicators(28, indicatorMatches)
  const score = modelScore ?? fallbackScore
  const status = modelPrediction.status || (modelPrediction.label && modelPrediction.modelAvailable
    ? modelPrediction.label
    : imageStatusFromProbability(score))
  const { explanation, recommendations } = buildImageReport({
    aiProbability: score,
    status,
    indicators: detectedIndicators,
  })
  const analyzedAt = new Date().toISOString()

  return {
    aiProbability: score,
    status,
    indicators: detectedIndicators,
    explanation: modelPrediction.modelAvailable ? modelPrediction.explanation.join(' ') : explanation,
    recommendations,
    confidence: modelPrediction.confidence ?? score / 100,
    modelName: modelPrediction.modelName,
    modelAvailable: modelPrediction.modelAvailable,
    fallbackUsed: modelPrediction.fallbackUsed,
    modelExplanation: modelPrediction.explanation,
    signals: modelPrediction.signals || fallbackSignals,
    analyzedAt,
  }
}

function buildFallbackSignals(file) {
  return {
    exifPresent: false,
    softwareTag: null,
    width: 'unknown',
    height: 'unknown',
    megapixels: null,
    format: file.mimetype.split('/')[1]?.toUpperCase() || 'unknown',
    mimeType: file.mimetype,
    fileSizeBytes: file.size,
    bytesPerPixel: null,
    compressionIndicators: [
      file.size < 180000 ? 'small_file_size' : 'file_size_not_small',
      'node_fallback_metadata_only',
    ],
  }
}
