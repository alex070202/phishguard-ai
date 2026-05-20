import { pool } from '../config/db.js'
import { createAuditLog } from './auditService.js'

export async function saveImageAnalysis({ file, result }) {
  const analyzedAt = new Date(result.analyzedAt)
  const [checkResult] = await pool.execute(
    `INSERT INTO image_checks
      (file_name, mime_type, file_size, ai_probability, status, indicators, explanation, analyzed_at)
     VALUES
      (:fileName, :mimeType, :fileSize, :aiProbability, :status, :indicators, :explanation, :analyzedAt)`,
    {
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
    `INSERT INTO detection_results (source_type, source_id, score, status, indicators, explanation)
     VALUES ('image', :sourceId, :score, :status, :indicators, :explanation)`,
    {
      sourceId: checkResult.insertId,
      score: result.aiProbability,
      status: result.status,
      indicators: JSON.stringify(result.indicators),
      explanation: result.explanation,
    },
  )

  await createAuditLog({
    action: 'images.analyze',
    entityType: 'image_checks',
    entityId: checkResult.insertId,
    metadata: { aiProbability: result.aiProbability, status: result.status },
  })

  return checkResult.insertId
}
