import { pool } from '../config/db.js'
import { createAuditLog } from './auditService.js'

export async function saveImageAnalysis({ file, result, userId = null, ipAddress = null }) {
  const analyzedAt = new Date(result.analyzedAt)
  const [checkResult] = await pool.execute(
    `INSERT INTO image_checks
      (user_id, file_name, mime_type, file_size, ai_probability, status, indicators, explanation, analyzed_at)
     VALUES
      (:userId, :fileName, :mimeType, :fileSize, :aiProbability, :status, :indicators, :explanation, :analyzedAt)`,
    {
      userId,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      aiProbability: result.aiProbability,
      status: result.status,
      indicators: JSON.stringify(result.indicators),
      explanation: result.explanation,
      analyzedAt,
    },
  )

  await pool.execute(
    `INSERT INTO detection_results (source_type, source_id, user_id, score, status, indicators, explanation)
     VALUES ('image', :sourceId, :userId, :score, :status, :indicators, :explanation)`,
    {
      sourceId: checkResult.insertId,
      userId,
      score: result.aiProbability,
      status: result.status,
      indicators: JSON.stringify(result.indicators),
      explanation: result.explanation,
    },
  )

  await createAuditLog({
    userId,
    action: 'images.analyze',
    entityType: 'image_checks',
    entityId: checkResult.insertId,
    details: { fileName: file.originalname, mimeType: file.mimetype, fileSize: file.size },
    metadata: { aiProbability: result.aiProbability, status: result.status },
    ipAddress,
  })

  return checkResult.insertId
}
