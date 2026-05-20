import { analyzeImageFile } from '../agents/imageDetectionAgent.js'
import { saveImageAnalysis } from '../services/imageService.js'

export async function analyzeImageController(request, response, next) {
  try {
    if (!request.file) {
      response.status(400).json({ error: 'Image file is required.' })
      return
    }

    const result = analyzeImageFile(request.file)
    let persisted = true
    let checkId = null

    try {
      checkId = await saveImageAnalysis({ file: request.file, result, userId: request.user?.id || null, ipAddress: request.ip })
    } catch (error) {
      persisted = false
      result.persistenceWarning = error.message
    }

    response.json({ ...result, checkId, persisted })
  } catch (error) {
    next(error)
  }
}
