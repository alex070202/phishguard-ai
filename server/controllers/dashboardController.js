import { getAnalysisHistory, getDashboardStats } from '../services/dashboardService.js'

export async function getDashboardStatsController(request, response, next) {
  try {
    response.json(await getDashboardStats(request.user))
  } catch (error) {
    next(error)
  }
}

export async function getHistoryController(request, response, next) {
  try {
    response.json(await getAnalysisHistory(request.user, request.query.search || ''))
  } catch (error) {
    next(error)
  }
}
