import { pool } from '../config/db.js'

export async function createAuditLog({ action, entityType, entityId = null, metadata = {} }) {
  const [result] = await pool.execute(
    `INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
     VALUES (:action, :entityType, :entityId, :metadata)`,
    {
      action,
      entityType,
      entityId,
      metadata: JSON.stringify(metadata),
    },
  )

  return result.insertId
}
