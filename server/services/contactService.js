import { pool } from '../config/db.js'
import { createAuditLog } from './auditService.js'

export async function createContactMessage({ name, email, message, ipAddress }) {
  const [result] = await pool.execute(
    `INSERT INTO contact_messages (name, email, message)
     VALUES (:name, :email, :message)`,
    { name, email, message },
  )

  await createAuditLog({
    action: 'contact.message.created',
    entityType: 'contact_messages',
    entityId: result.insertId,
    details: { email },
    ipAddress,
  })

  return result.insertId
}
