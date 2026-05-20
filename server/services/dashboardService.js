import { pool } from '../config/db.js'

function parseJson(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

export async function getDashboardStats(user) {
  const isAdmin = user.role === 'admin'
  const userFilter = isAdmin ? '1 = 1' : 'user_id = :userId'
  const [[totals]] = await pool.execute(`
    SELECT
      (SELECT COUNT(*) FROM phishing_checks WHERE ${userFilter}) AS phishingChecks,
      (SELECT COUNT(*) FROM image_checks WHERE ${userFilter}) AS imageChecks,
      (SELECT COUNT(*) FROM detection_results WHERE score >= 66 AND ${userFilter}) AS highRiskDetections,
      (SELECT COUNT(*) FROM detection_results WHERE ${userFilter}) AS totalChecks
  `, { userId: user.id })

  return {
    totalChecks: Number(totals.totalChecks || 0),
    phishingChecks: Number(totals.phishingChecks || 0),
    imageChecks: Number(totals.imageChecks || 0),
    highRiskDetections: Number(totals.highRiskDetections || 0),
  }
}

export async function getAnalysisHistory(user, search = '') {
  const isAdmin = user.role === 'admin'
  const searchTerm = `%${String(search || '').trim()}%`
  const filters = []
  const params = { userId: user.id, searchTerm }

  if (!isAdmin) {
    filters.push('dr.user_id = :userId')
  }

  if (search) {
    filters.push(`(
      pc.sender_email LIKE :searchTerm OR
      pc.subject LIKE :searchTerm OR
      pc.suspicious_url LIKE :searchTerm OR
      pc.email_content LIKE :searchTerm OR
      dr.status LIKE :searchTerm OR
      ic.file_name LIKE :searchTerm
    )`)
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  const [rows] = await pool.execute(`
    SELECT
      dr.id,
      dr.source_type AS sourceType,
      dr.source_id AS sourceId,
      dr.score,
      dr.status,
      dr.indicators,
      dr.explanation,
      dr.created_at AS createdAt,
      pc.sender_email AS senderEmail,
      pc.subject AS subject,
      pc.suspicious_url AS suspiciousUrl,
      ic.file_name AS fileName,
      ic.mime_type AS mimeType
    FROM detection_results dr
    LEFT JOIN phishing_checks pc ON dr.source_type = 'phishing' AND dr.source_id = pc.id
    LEFT JOIN image_checks ic ON dr.source_type = 'image' AND dr.source_id = ic.id
    ${whereClause}
    ORDER BY dr.created_at DESC
    LIMIT 50
  `, params)

  return rows.map((row) => ({
    id: `PG-${row.id}`,
    type: row.sourceType === 'phishing' ? 'Email' : 'Image',
    target: row.sourceType === 'phishing' ? row.senderEmail || row.suspiciousUrl || 'Unknown email' : row.fileName,
    subject: row.subject,
    score: Number(row.score),
    status: row.status,
    indicators: parseJson(row.indicators),
    explanation: row.explanation,
    date: new Date(row.createdAt).toISOString().slice(0, 10),
  }))
}
