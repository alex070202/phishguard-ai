import { Router } from 'express'
import { analyzePhishingController } from '../controllers/phishingController.js'
import { optionalAuth } from '../middleware/auth.js'

export const phishingRoutes = Router()

phishingRoutes.post('/analyze', optionalAuth, analyzePhishingController)
