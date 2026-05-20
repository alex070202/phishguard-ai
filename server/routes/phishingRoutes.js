import { Router } from 'express'
import { analyzePhishingController } from '../controllers/phishingController.js'

export const phishingRoutes = Router()

phishingRoutes.post('/analyze', analyzePhishingController)
