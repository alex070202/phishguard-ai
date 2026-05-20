import { Router } from 'express'
import {
  adminChecksController,
  adminLogsController,
  adminStatsController,
  adminUsersController,
  banUserController,
  unbanUserController,
} from '../controllers/adminController.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

export const adminRoutes = Router()

adminRoutes.use(requireAuth, requireAdmin)
adminRoutes.get('/stats', adminStatsController)
adminRoutes.get('/users', adminUsersController)
adminRoutes.patch('/users/:id/ban', banUserController)
adminRoutes.patch('/users/:id/unban', unbanUserController)
adminRoutes.get('/logs', adminLogsController)
adminRoutes.get('/checks', adminChecksController)
