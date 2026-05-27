import { Router } from 'express'
import { contactController } from '../controllers/contactController.js'

export const contactRoutes = Router()

contactRoutes.post('/', contactController)
