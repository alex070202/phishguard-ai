const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'phishguard_auth_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function authHeaders() {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function toneFromScore(score) {
  if (score >= 66) return 'red'
  if (score >= 31) return 'amber'
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
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
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
    headers: { ...authHeaders() },
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
  return requestJson('/dashboard/stats', { headers: authHeaders() })
}

export function getHistory(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return requestJson(`/history${query}`, { headers: authHeaders() })
}

export function getHealth() {
  return requestJson('/health')
}

export function register(payload) {
  return requestJson('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function login(payload) {
  return requestJson('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getMe() {
  return requestJson('/auth/me', { headers: authHeaders() })
}

export function logout() {
  return requestJson('/auth/logout', { method: 'POST', headers: authHeaders() })
}

export function getAdminStats() {
  return requestJson('/admin/stats', { headers: authHeaders() })
}

export function getAdminUsers() {
  return requestJson('/admin/users', { headers: authHeaders() })
}

export function banUser(userId) {
  return requestJson(`/admin/users/${userId}/ban`, { method: 'PATCH', headers: authHeaders() })
}

export function unbanUser(userId) {
  return requestJson(`/admin/users/${userId}/unban`, { method: 'PATCH', headers: authHeaders() })
}

export function getAdminLogs(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return requestJson(`/admin/logs${query}`, { headers: authHeaders() })
}

export function getAdminChecks(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return requestJson(`/admin/checks${query}`, { headers: authHeaders() })
}

export function sendContactMessage(payload) {
  return requestJson('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
