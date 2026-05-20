import { pool } from '../config/db.js'
import { createAuditLog } from './auditService.js'

export async function savePhishingAnalysis({ payload, result, userId = null, ipAddress = null }) {
  const analyzedAt = new Date(result.analyzedAt)
  const [checkResult] = await pool.execute(
    `INSERT INTO phishing_checks
      (user_id, subject, sender_email, suspicious_url, email_content, risk_score, risk_level, detected_indicators, explanation, analyzed_at)
     VALUES
      (:userId, :subject, :senderEmail, :suspiciousUrl, :emailContent, :riskScore, :riskLevel, :detectedIndicators, :explanation, :analyzedAt)`,
    {
      userId,
      subject: payload.subject || null,
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
    `INSERT INTO detection_results (source_type, source_id, user_id, score, status, indicators, explanation)
     VALUES ('phishing', :sourceId, :userId, :score, :status, :indicators, :explanation)`,
    {
      sourceId: checkResult.insertId,
      userId,
      score: result.riskScore,
      status: result.riskLevel,
      indicators: JSON.stringify(result.detectedIndicators),
      explanation: result.explanation,
    },
  )

  await createAuditLog({
    userId,
    action: 'phishing.analyze',
    entityType: 'phishing_checks',
    entityId: checkResult.insertId,
    details: { senderEmail: payload.senderEmail || null, suspiciousUrl: payload.suspiciousUrl || null },
    metadata: { riskScore: result.riskScore, riskLevel: result.riskLevel },
    ipAddress,
  })

  return checkResult.insertId
}
