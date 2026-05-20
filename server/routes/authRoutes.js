import { Router } from 'express'
import { loginController, logoutController, meController, registerController } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

export const authRoutes = Router()

authRoutes.post('/register', registerController)
authRoutes.post('/login', loginController)
authRoutes.get('/me', requireAuth, meController)
authRoutes.post('/logout', requireAuth, logoutController)
