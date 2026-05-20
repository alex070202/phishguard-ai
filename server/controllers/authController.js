import { loginUser, registerUser } from '../services/authService.js'
import { createAuditLog } from '../services/auditService.js'

function validateCredentials({ email, password }) {
  if (!email || !password) return 'Email and password are required.'
  if (String(password).length < 8) return 'Password must be at least 8 characters.'
  return ''
}

export async function registerController(request, response, next) {
  try {
    const validationError = validateCredentials(request.body)
    if (validationError || !request.body.name) {
      response.status(400).json({ error: validationError || 'Name is required.' })
      return
    }

    const result = await registerUser(request.body)
    await createAuditLog({
      userId: result.user.id,
      action: 'user.register',
      entityType: 'users',
      entityId: result.user.id,
      details: { email: result.user.email },
      ipAddress: request.ip,
    })
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export async function loginController(request, response, next) {
  try {
    const validationError = validateCredentials(request.body)
    if (validationError) {
      response.status(400).json({ error: validationError })
      return
    }

    const result = await loginUser(request.body)
    await createAuditLog({
      userId: result.user.id,
      action: 'user.login',
      entityType: 'users',
      entityId: result.user.id,
      details: { email: result.user.email },
      ipAddress: request.ip,
    })
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export function meController(request, response) {
  response.json({ user: request.user })
}

export function logoutController(request, response) {
  response.json({ ok: true })
}
