import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { sendPasswordResetEmail, sendVerificationEmail } from './emailService.js'
import {
  activateVerifiedUser,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByPasswordResetToken,
  findUserByVerificationToken,
  sanitizeUser,
  setPasswordResetToken,
  updatePasswordAndClearReset,
} from './userService.js'

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '8h' })
}

function createToken() {
  const token = crypto.randomBytes(32).toString('hex')
  return { token, tokenHash: hashToken(token) }
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex')
}

function addHours(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

function isExpired(value) {
  return !value || new Date(value).getTime() < Date.now()
}

export async function registerUser({ name, email, password, confirmPassword }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (password !== confirmPassword) {
    const error = new Error('Password and confirmation password must match.')
    error.statusCode = 400
    throw error
  }

  const existingUser = await findUserByEmail(normalizedEmail)
  if (existingUser) {
    const error = new Error('A user with this email already exists.')
    error.statusCode = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const { token, tokenHash } = createToken()
  const user = await createUser({
    name: String(name || '').trim(),
    email: normalizedEmail,
    passwordHash,
    status: 'pending',
    emailVerified: false,
    emailVerificationToken: tokenHash,
    emailVerificationExpires: addHours(24),
  })

  await sendVerificationEmail({ to: normalizedEmail, name: user.name, token })
  return {
    message: 'Please check your email to verify your account.',
    user: sanitizeUser(user),
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const user = await findUserByEmail(normalizedEmail)
  const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false

  if (!user || !passwordMatches) {
    const error = new Error('Invalid email or password.')
    error.statusCode = 401
    throw error
  }

  if (user.status === 'banned') {
    const error = new Error('Your account has been banned.')
    error.statusCode = 403
    throw error
  }

  if (user.status === 'pending' || !user.email_verified) {
    const error = new Error('Please verify your email before logging in.')
    error.statusCode = 403
    error.code = 'EMAIL_NOT_VERIFIED'
    error.userId = user.id
    throw error
  }

  return { token: signToken(user), user: sanitizeUser(user) }
}

export async function verifyToken(token) {
  const payload = jwt.verify(token, env.jwtSecret)
  const user = await findUserById(payload.sub)

  if (!user) {
    const error = new Error('Authenticated user no longer exists.')
    error.statusCode = 401
    throw error
  }

  if (user.status === 'banned') {
    const error = new Error('Your account has been banned.')
    error.statusCode = 403
    throw error
  }

  if (user.status !== 'active' || !user.email_verified) {
    const error = new Error('Please verify your email before logging in.')
    error.statusCode = 403
    throw error
  }

  return sanitizeUser(user)
}

export async function verifyEmailToken(token) {
  const user = await findUserByVerificationToken(hashToken(token))
  if (!user || isExpired(user.email_verification_expires)) {
    const error = new Error('Email verification link is invalid or expired.')
    error.statusCode = 400
    throw error
  }

  return sanitizeUser(await activateVerifiedUser(user.id))
}

export async function requestPasswordReset(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const user = await findUserByEmail(normalizedEmail)

  if (!user) {
    return { message: 'If an account with this email exists, a password reset link has been sent.' }
  }

  const { token, tokenHash } = createToken()
  await setPasswordResetToken(user.id, tokenHash, addHours(1))
  try {
    await sendPasswordResetEmail({ to: normalizedEmail, name: user.name, token })
  } catch (error) {
    console.error('Password reset email delivery failed:', error.message)
  }
  return { message: 'If an account with this email exists, a password reset link has been sent.', userId: user.id }
}

export async function resetPassword({ token, password, confirmPassword }) {
  if (password !== confirmPassword) {
    const error = new Error('Password and confirmation password must match.')
    error.statusCode = 400
    throw error
  }

  const user = await findUserByPasswordResetToken(hashToken(token))
  if (!user || isExpired(user.password_reset_expires)) {
    const error = new Error('Password reset link is invalid or expired.')
    error.statusCode = 400
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 12)
  return sanitizeUser(await updatePasswordAndClearReset(user.id, passwordHash))
}
