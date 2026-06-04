import { loginUser, registerUser, requestPasswordReset, resetPassword, verifyEmailToken } from '../services/authService.js'
import { createAuditLog } from '../services/auditService.js'

function validateCredentials({ email, password }) {
  if (!email || !password) return 'Email and password are required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) return 'A valid email address is required.'
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

    if (request.body.password !== request.body.confirmPassword) {
      response.status(400).json({ error: 'Password and confirmation password must match.' })
      return
    }

    const result = await registerUser(request.body)
    await createAuditLog({
      userId: result.user.id,
      action: 'USER_REGISTERED_PENDING',
      entityType: 'users',
      entityId: result.user.id,
      details: { email: result.user.email },
      ipAddress: request.ip,
    })
    await createAuditLog({
      userId: result.user.id,
      action: 'EMAIL_VERIFICATION_SENT',
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
    if (error.code === 'EMAIL_NOT_VERIFIED') {
      await createAuditLog({
        userId: error.userId || null,
        action: 'LOGIN_BLOCKED_EMAIL_NOT_VERIFIED',
        entityType: 'users',
        entityId: error.userId || null,
        details: { email: request.body.email },
        ipAddress: request.ip,
      })
    }
    next(error)
  }
}

export function meController(request, response) {
  response.json({ user: request.user })
}

export function logoutController(request, response) {
  response.json({ ok: true })
}

export async function verifyEmailController(request, response, next) {
  try {
    if (!request.query.token) {
      response.status(400).json({ error: 'Verification token is required.' })
      return
    }

    const user = await verifyEmailToken(request.query.token)
    await createAuditLog({
      userId: user.id,
      action: 'EMAIL_VERIFIED',
      entityType: 'users',
      entityId: user.id,
      details: { email: user.email },
      ipAddress: request.ip,
    })
    response.json({ message: 'Email verified successfully. You can now log in.', user })
  } catch (error) {
    next(error)
  }
}

export async function forgotPasswordController(request, response, next) {
  try {
    if (!request.body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(request.body.email))) {
      response.status(400).json({ error: 'A valid email address is required.' })
      return
    }

    const result = await requestPasswordReset(request.body.email)
    if (result.userId) {
      await createAuditLog({
        userId: result.userId,
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'users',
        entityId: result.userId,
        details: { email: request.body.email },
        ipAddress: request.ip,
      })
    }
    response.json({ message: result.message })
  } catch (error) {
    next(error)
  }
}

export async function resetPasswordController(request, response, next) {
  try {
    if (!request.body.token) {
      response.status(400).json({ error: 'Password reset token is required.' })
      return
    }

    if (!request.body.password || String(request.body.password).length < 8) {
      response.status(400).json({ error: 'Password must be at least 8 characters.' })
      return
    }

    if (request.body.password !== request.body.confirmPassword) {
      response.status(400).json({ error: 'Password and confirmation password must match.' })
      return
    }

    const user = await resetPassword(request.body)
    await createAuditLog({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'users',
      entityId: user.id,
      details: { email: user.email },
      ipAddress: request.ip,
    })
    response.json({ message: 'Password reset completed. You can now log in.' })
  } catch (error) {
    next(error)
  }
}
