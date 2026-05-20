import { analyzePhishing } from '../agents/phishingAgent.js'
import { savePhishingAnalysis } from '../services/phishingService.js'

export async function analyzePhishingController(request, response, next) {
  try {
    const payload = {
      senderEmail: request.body.senderEmail || '',
      suspiciousUrl: request.body.suspiciousUrl || '',
      emailContent: request.body.emailContent || '',
    }

    if (!payload.senderEmail && !payload.suspiciousUrl && !payload.emailContent) {
      response.status(400).json({ error: 'At least one phishing analysis field is required.' })
      return
    }

    const result = analyzePhishing(payload)
    let persisted = true
    let checkId = null

    try {
      checkId = await savePhishingAnalysis({ payload, result })
    } catch (error) {
      persisted = false
      result.persistenceWarning = error.message
    }

    response.json({ ...result, checkId, persisted })
  } catch (error) {
    next(error)
  }
}
