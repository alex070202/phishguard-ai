import { pool } from '../config/db.js'
import { listUsers, updateUserStatus } from './userService.js'

function parseJson(value) {
  if (!value) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export async function getAdminStats() {
  const [[stats]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM users WHERE status = 'banned') AS bannedUsers,
      (SELECT COUNT(*) FROM phishing_checks) AS phishingChecks,
      (SELECT COUNT(*) FROM image_checks) AS imageChecks,
      (SELECT COUNT(*) FROM detection_results WHERE score >= 66) AS highRiskDetections,
      (SELECT COUNT(*) FROM audit_logs) AS auditLogs
  `)

  return Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, Number(value || 0)]))
}

export async function getAdminUsers() {
  return listUsers()
}

export async function banUser(userId) {
  return updateUserStatus(userId, 'banned')
}

export async function unbanUser(userId) {
  return updateUserStatus(userId, 'active')
}

export async function getAdminLogs(search = '') {
  const searchTerm = `%${search}%`
  const [rows] = await pool.execute(`
    SELECT al.*, u.email AS userEmail
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE :search = ''
      OR al.action LIKE :searchTerm
      OR al.entity_type LIKE :searchTerm
      OR u.email LIKE :searchTerm
    ORDER BY al.created_at DESC
    LIMIT 100
  `, { search, searchTerm })

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userEmail: row.userEmail,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: parseJson(row.details),
    metadata: parseJson(row.metadata),
    ipAddress: row.ip_address,
    createdAt: row.created_at,
  }))
}

export async function getAdminChecks(search = '') {
  const searchTerm = `%${search}%`
  const [rows] = await pool.execute(`
    SELECT
      dr.id,
      dr.source_type AS sourceType,
      dr.score,
      dr.status,
      dr.created_at AS createdAt,
      u.email AS userEmail,
      pc.sender_email AS senderEmail,
      pc.subject,
      pc.suspicious_url AS suspiciousUrl,
      ic.file_name AS fileName
    FROM detection_results dr
    LEFT JOIN users u ON dr.user_id = u.id
    LEFT JOIN phishing_checks pc ON dr.source_type = 'phishing' AND dr.source_id = pc.id
    LEFT JOIN image_checks ic ON dr.source_type = 'image' AND dr.source_id = ic.id
    WHERE :search = ''
      OR u.email LIKE :searchTerm
      OR pc.sender_email LIKE :searchTerm
      OR pc.subject LIKE :searchTerm
      OR pc.suspicious_url LIKE :searchTerm
      OR ic.file_name LIKE :searchTerm
      OR dr.status LIKE :searchTerm
    ORDER BY dr.created_at DESC
    LIMIT 100
  `, { search, searchTerm })

  return rows.map((row) => ({
    id: `PG-${row.id}`,
    type: row.sourceType === 'phishing' ? 'Email' : 'Image',
    userEmail: row.userEmail || 'anonymous',
    target: row.sourceType === 'phishing' ? row.senderEmail || row.suspiciousUrl : row.fileName,
    subject: row.subject,
    score: Number(row.score),
    status: row.status,
    date: new Date(row.createdAt).toISOString().slice(0, 10),
  }))
}
