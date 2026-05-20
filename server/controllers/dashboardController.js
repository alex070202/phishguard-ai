import { getAnalysisHistory, getDashboardStats } from '../services/dashboardService.js'

export async function getDashboardStatsController(request, response, next) {
  try {
    response.json(await getDashboardStats())
  } catch (error) {
    next(error)
  }
}

export async function getHistoryController(request, response, next) {
  try {
    response.json(await getAnalysisHistory())
  } catch (error) {
    next(error)
  }
}
