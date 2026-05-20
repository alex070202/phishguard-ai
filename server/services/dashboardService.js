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

export async function getDashboardStats() {
  const [[totals]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM phishing_checks) AS phishingChecks,
      (SELECT COUNT(*) FROM image_checks) AS imageChecks,
      (SELECT COUNT(*) FROM detection_results WHERE score >= 70) AS highRiskDetections,
      (SELECT COUNT(*) FROM detection_results) AS totalChecks
  `)

  return {
    totalChecks: Number(totals.totalChecks || 0),
    phishingChecks: Number(totals.phishingChecks || 0),
    imageChecks: Number(totals.imageChecks || 0),
    highRiskDetections: Number(totals.highRiskDetections || 0),
  }
}

export async function getAnalysisHistory() {
  const [rows] = await pool.query(`
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
      pc.suspicious_url AS suspiciousUrl,
      ic.file_name AS fileName,
      ic.mime_type AS mimeType
    FROM detection_results dr
    LEFT JOIN phishing_checks pc ON dr.source_type = 'phishing' AND dr.source_id = pc.id
    LEFT JOIN image_checks ic ON dr.source_type = 'image' AND dr.source_id = ic.id
    ORDER BY dr.created_at DESC
    LIMIT 50
  `)

  return rows.map((row) => ({
    id: `PG-${row.id}`,
    type: row.sourceType === 'phishing' ? 'Email' : 'Image',
    target: row.sourceType === 'phishing' ? row.senderEmail || row.suspiciousUrl || 'Unknown email' : row.fileName,
    score: Number(row.score),
    status: row.status,
    indicators: parseJson(row.indicators),
    explanation: row.explanation,
    date: new Date(row.createdAt).toISOString().slice(0, 10),
  }))
}
