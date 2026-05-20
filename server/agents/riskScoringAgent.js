export function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function riskLevelFromScore(score) {
  if (score >= 75) return 'High'
  if (score >= 45) return 'Medium'
  return 'Low'
}

export function imageStatusFromProbability(probability) {
  if (probability >= 70) return 'Suspicious / Possibly AI-generated'
  if (probability >= 45) return 'Needs manual review'
  return 'Low suspicion'
}

export function scoreIndicators(baseScore, indicatorMatches) {
  const detectedIndicators = indicatorMatches.filter((indicator) => indicator.detected)
  const score = clampScore(
    baseScore + detectedIndicators.reduce((total, indicator) => total + indicator.weight, 0),
  )

  return {
    score,
    detectedIndicators: detectedIndicators.map(({ key, label, evidence }) => ({ key, label, evidence })),
  }
}
