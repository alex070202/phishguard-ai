import { pool } from '../config/db.js'

export async function createAuditLog({
  userId = null,
  action,
  entityType = 'system',
  entityId = null,
  details = {},
  metadata = {},
  ipAddress = null,
}) {
  const [result] = await pool.execute(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, metadata, ip_address)
     VALUES (:userId, :action, :entityType, :entityId, :details, :metadata, :ipAddress)`,
    {
      userId,
      action,
      entityType,
      entityId,
      details: JSON.stringify(details),
      metadata: JSON.stringify(metadata),
      ipAddress,
    },
  )

  return result.insertId
}
