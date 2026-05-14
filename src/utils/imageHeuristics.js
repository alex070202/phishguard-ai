function clampScore(score) {
  return Math.max(0, Math.min(100, score))
}

export function analyzeImageFile(file) {
  const fileName = file.name.toLowerCase()
  let score = 34
  const explanations = []

  if (file.type === 'image/webp') {
    score += 15
    explanations.push('Modern compressed image format often used by generators and editing pipelines.')
  }

  if (fileName.includes('ai') || fileName.includes('generated') || fileName.includes('synthetic')) {
    score += 24
    explanations.push('File name contains generation-related wording.')
  }

  if (file.size < 180000) {
    score += 12
    explanations.push('Small file size can indicate heavy compression or exported generated content.')
  }

  if (file.size > 3500000) {
    score -= 8
    explanations.push('Large original-like file size slightly lowers the suspicion score.')
  }

  if (!explanations.length) {
    explanations.push('No strong file-level signals found. Visual model analysis is still required for a reliable result.')
  }

  const probability = clampScore(score)
  const status = probability >= 70 ? 'Suspicious / Possibly AI-generated' : probability >= 45 ? 'Needs review' : 'Low suspicion'
  const tone = probability >= 70 ? 'amber' : probability >= 45 ? 'cyan' : 'green'

  return {
    probability,
    status,
    tone,
    explanations,
    summary:
      probability >= 70
        ? 'The uploaded file has several suspicious file-level characteristics.'
        : probability >= 45
          ? 'The uploaded file needs additional visual model inspection.'
          : 'The uploaded file has low file-level suspicion in this heuristic prototype.',
  }
}
