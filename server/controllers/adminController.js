import { createAuditLog } from '../services/auditService.js'
import { banUser, getAdminChecks, getAdminLogs, getAdminStats, getAdminUsers, unbanUser } from '../services/adminService.js'
import { sanitizeUser } from '../services/userService.js'

export async function adminStatsController(request, response, next) {
  try {
    response.json(await getAdminStats())
  } catch (error) {
    next(error)
  }
}

export async function adminUsersController(request, response, next) {
  try {
    response.json(await getAdminUsers())
  } catch (error) {
    next(error)
  }
}

export async function banUserController(request, response, next) {
  try {
    const user = await banUser(request.params.id)
    await createAuditLog({
      userId: request.user.id,
      action: 'admin.user.ban',
      entityType: 'users',
      entityId: request.params.id,
      details: { targetEmail: user?.email },
      ipAddress: request.ip,
    })
    response.json({ user: sanitizeUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function unbanUserController(request, response, next) {
  try {
    const user = await unbanUser(request.params.id)
    await createAuditLog({
      userId: request.user.id,
      action: 'admin.user.unban',
      entityType: 'users',
      entityId: request.params.id,
      details: { targetEmail: user?.email },
      ipAddress: request.ip,
    })
    response.json({ user: sanitizeUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function adminLogsController(request, response, next) {
  try {
    response.json(await getAdminLogs(request.query.search || ''))
  } catch (error) {
    next(error)
  }
}

export async function adminChecksController(request, response, next) {
  try {
    response.json(await getAdminChecks(request.query.search || ''))
  } catch (error) {
    next(error)
  }
}
