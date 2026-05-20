import { Router } from 'express'
import { analyzeImageController } from '../controllers/imageController.js'
import { optionalAuth } from '../middleware/auth.js'
import { imageUpload, uploadErrorHandler } from '../middleware/upload.js'

export const imageRoutes = Router()

imageRoutes.post('/analyze', optionalAuth, imageUpload.single('image'), uploadErrorHandler, analyzeImageController)
