import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { createUser, findUserByEmail, findUserById, sanitizeUser } from './userService.js'

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '8h' })
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const existingUser = await findUserByEmail(normalizedEmail)
  if (existingUser) {
    const error = new Error('A user with this email already exists.')
    error.statusCode = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await createUser({ name: String(name || '').trim(), email: normalizedEmail, passwordHash })
  return { token: signToken(user), user: sanitizeUser(user) }
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
    const error = new Error('This account is banned. Contact an administrator.')
    error.statusCode = 403
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
    const error = new Error('This account is banned. Contact an administrator.')
    error.statusCode = 403
    throw error
  }

  return sanitizeUser(user)
}
