import { pool } from '../config/db.js'

export function sanitizeUser(user) {
  if (!user) return null
  const safeUser = { ...user }
  delete safeUser.password_hash
  delete safeUser.email_verification_token
  delete safeUser.email_verification_expires
  delete safeUser.password_reset_token
  delete safeUser.password_reset_expires
  return safeUser
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = :email LIMIT 1', { email })
  return rows[0] || null
}

export async function findUserById(id) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = :id LIMIT 1', { id })
  return rows[0] || null
}

export async function findUserByVerificationToken(tokenHash) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email_verification_token = :tokenHash LIMIT 1', { tokenHash })
  return rows[0] || null
}

export async function findUserByPasswordResetToken(tokenHash) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE password_reset_token = :tokenHash LIMIT 1', { tokenHash })
  return rows[0] || null
}

export async function createUser({
  name,
  email,
  passwordHash,
  role = 'user',
  status = 'pending',
  emailVerified = false,
  emailVerificationToken = null,
  emailVerificationExpires = null,
}) {
  const [result] = await pool.execute(
    `INSERT INTO users (
       name,
       email,
       password_hash,
       role,
       status,
       email_verified,
       email_verification_token,
       email_verification_expires
     )
     VALUES (
       :name,
       :email,
       :passwordHash,
       :role,
       :status,
       :emailVerified,
       :emailVerificationToken,
       :emailVerificationExpires
     )`,
    { name, email, passwordHash, role, status, emailVerified, emailVerificationToken, emailVerificationExpires },
  )
  return findUserById(result.insertId)
}

export async function listUsers() {
  const [rows] = await pool.query(`
    SELECT
      id,
      name,
      email,
      role,
      status,
      email_verified AS emailVerified,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM users
    ORDER BY created_at DESC
  `)
  return rows
}

export async function updateUserStatus(userId, status) {
  await pool.execute('UPDATE users SET status = :status WHERE id = :userId', { userId, status })
  return findUserById(userId)
}

export async function activateVerifiedUser(userId) {
  await pool.execute(
    `UPDATE users
     SET email_verified = TRUE,
         status = 'active',
         email_verification_token = NULL,
         email_verification_expires = NULL
     WHERE id = :userId`,
    { userId },
  )
  return findUserById(userId)
}

export async function setPasswordResetToken(userId, tokenHash, expiresAt) {
  await pool.execute(
    `UPDATE users
     SET password_reset_token = :tokenHash,
         password_reset_expires = :expiresAt
     WHERE id = :userId`,
    { userId, tokenHash, expiresAt },
  )
}

export async function updatePasswordAndClearReset(userId, passwordHash) {
  await pool.execute(
    `UPDATE users
     SET password_hash = :passwordHash,
         password_reset_token = NULL,
         password_reset_expires = NULL
     WHERE id = :userId`,
    { userId, passwordHash },
  )
  return findUserById(userId)
}
