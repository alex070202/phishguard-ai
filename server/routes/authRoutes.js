import { Router } from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import { authRateLimit, passwordResetRateLimit } from '../middleware/rateLimit.js'

export const authRoutes = Router()

authRoutes.post('/register', authRateLimit, registerController)
authRoutes.post('/login', authRateLimit, loginController)
authRoutes.get('/verify-email', verifyEmailController)
authRoutes.post('/forgot-password', passwordResetRateLimit, forgotPasswordController)
authRoutes.post('/reset-password', passwordResetRateLimit, resetPasswordController)
authRoutes.get('/me', requireAuth, meController)
authRoutes.post('/logout', requireAuth, logoutController)
