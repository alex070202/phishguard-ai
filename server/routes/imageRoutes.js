import { Router } from 'express'
import { analyzeImageController } from '../controllers/imageController.js'
import { imageUpload, uploadErrorHandler } from '../middleware/upload.js'

export const imageRoutes = Router()

imageRoutes.post('/analyze', imageUpload.single('image'), uploadErrorHandler, analyzeImageController)
