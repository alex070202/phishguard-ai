import { pool } from '../config/db.js'
import { createAuditLog } from './auditService.js'

export async function savePhishingAnalysis({ payload, result }) {
  const analyzedAt = new Date(result.analyzedAt)
  const [checkResult] = await pool.execute(
    `INSERT INTO phishing_checks
      (sender_email, suspicious_url, email_content, risk_score, risk_level, detected_indicators, explanation, analyzed_at)
     VALUES
      (:senderEmail, :suspiciousUrl, :emailContent, :riskScore, :riskLevel, :detectedIndicators, :explanation, :analyzedAt)`,
    {
      senderEmail: payload.senderEmail || null,
      suspiciousUrl: payload.suspiciousUrl || null,
      emailContent: payload.emailContent || null,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      detectedIndicators: JSON.stringify(result.detectedIndicators),
      explanation: result.explanation,
      analyzedAt,
    },
  )

  await pool.execute(
    `INSERT INTO detection_results (source_type, source_id, score, status, indicators, explanation)
     VALUES ('phishing', :sourceId, :score, :status, :indicators, :explanation)`,
    {
      sourceId: checkResult.insertId,
      score: result.riskScore,
      status: result.riskLevel,
      indicators: JSON.stringify(result.detectedIndicators),
      explanation: result.explanation,
    },
  )

  await createAuditLog({
    action: 'phishing.analyze',
    entityType: 'phishing_checks',
    entityId: checkResult.insertId,
    metadata: { riskScore: result.riskScore, riskLevel: result.riskLevel },
  })

  return checkResult.insertId
}
