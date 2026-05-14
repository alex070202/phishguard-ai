const HISTORY_KEY = 'phishguard-analysis-history'

export const fallbackHistory = [
  { id: 'PG-1048', type: 'Email', target: 'security@paypaI-support.com', score: 87, status: 'High risk', date: '2026-05-14' },
  { id: 'PG-1047', type: 'Image', target: 'profile_photo.png', score: 74, status: 'Suspicious', date: '2026-05-14' },
  { id: 'PG-1046', type: 'Email', target: 'billing@cloud-secure.net', score: 42, status: 'Medium', date: '2026-05-13' },
  { id: 'PG-1045', type: 'Image', target: 'product_visual.webp', score: 21, status: 'Low', date: '2026-05-12' },
]

export function getAnalysisHistory() {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY)
    return storedHistory ? JSON.parse(storedHistory) : fallbackHistory
  } catch {
    return fallbackHistory
  }
}

export function saveAnalysisRecord(record) {
  const nextRecord = {
    id: `PG-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().slice(0, 10),
    ...record,
  }
  const nextHistory = [nextRecord, ...getAnalysisHistory()].slice(0, 12)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
  return nextRecord
}

export function clearAnalysisHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
}

export function restoreDemoHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(fallbackHistory))
  return fallbackHistory
}

export function exportAnalysisHistory() {
  const history = getAnalysisHistory()
  const header = ['ID', 'Type', 'Target', 'Score', 'Status', 'Date']
  const rows = history.map((item) => [
    item.id,
    item.type,
    item.target,
    `${item.score}%`,
    item.status,
    item.date,
  ])

  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n')
}
