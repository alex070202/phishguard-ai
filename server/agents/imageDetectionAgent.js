import { buildImageReport } from './reportAgent.js'
import { imageStatusFromProbability, scoreIndicators } from './riskScoringAgent.js'

export function analyzeImageFile(file) {
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

  const { score, detectedIndicators } = scoreIndicators(28, indicatorMatches)
  const status = imageStatusFromProbability(score)
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
    explanation,
    recommendations,
    analyzedAt,
  }
}
