import { Router } from 'express'
import { getDashboardStatsController, getHistoryController } from '../controllers/dashboardController.js'

export const dashboardRoutes = Router()

dashboardRoutes.get('/dashboard/stats', getDashboardStatsController)
dashboardRoutes.get('/history', getHistoryController)
