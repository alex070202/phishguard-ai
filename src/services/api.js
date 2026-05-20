const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

function toneFromScore(score) {
  if (score >= 75) return 'red'
  if (score >= 45) return 'amber'
  return 'green'
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.')
  }

  return data
}

export async function analyzePhishing(payload) {
  const result = await requestJson('/phishing/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return {
    score: result.riskScore,
    level: result.riskLevel,
    tone: toneFromScore(result.riskScore),
    indicators: result.detectedIndicators.map((indicator) => indicator.label),
    rawIndicators: result.detectedIndicators,
    recommendations: result.recommendations,
    summary: result.explanation,
    analyzedAt: result.analyzedAt,
    persisted: result.persisted,
    persistenceWarning: result.persistenceWarning,
  }
}

export async function analyzeImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const result = await requestJson('/images/analyze', {
    method: 'POST',
    body: formData,
  })

  return {
    probability: result.aiProbability,
    status: result.status,
    tone: toneFromScore(result.aiProbability),
    explanations: result.indicators.map((indicator) => indicator.label),
    rawIndicators: result.indicators,
    recommendations: result.recommendations,
    summary: result.explanation,
    analyzedAt: result.analyzedAt,
    persisted: result.persisted,
    persistenceWarning: result.persistenceWarning,
  }
}

export function getDashboardStats() {
  return requestJson('/dashboard/stats')
}

export function getHistory() {
  return requestJson('/history')
}

export function getHealth() {
  return requestJson('/health')
}
