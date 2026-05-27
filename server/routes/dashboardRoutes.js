import { Router } from 'express'
import { clearMyHistoryController, getDashboardStatsController, getHistoryController } from '../controllers/dashboardController.js'
import { requireAuth } from '../middleware/auth.js'

export const dashboardRoutes = Router()

dashboardRoutes.get('/dashboard/stats', requireAuth, getDashboardStatsController)
dashboardRoutes.get('/history', requireAuth, getHistoryController)
dashboardRoutes.delete('/history/me', requireAuth, clearMyHistoryController)
