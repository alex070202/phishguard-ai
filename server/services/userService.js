import { pool } from '../config/db.js'

export function sanitizeUser(user) {
  if (!user) return null
  const safeUser = { ...user }
  delete safeUser.password_hash
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

export async function createUser({ name, email, passwordHash, role = 'user' }) {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role, status)
     VALUES (:name, :email, :passwordHash, :role, 'active')`,
    { name, email, passwordHash, role },
  )
  return findUserById(result.insertId)
}

export async function listUsers() {
  const [rows] = await pool.query(`
    SELECT id, name, email, role, status, created_at AS createdAt, updated_at AS updatedAt
    FROM users
    ORDER BY created_at DESC
  `)
  return rows
}

export async function updateUserStatus(userId, status) {
  await pool.execute('UPDATE users SET status = :status WHERE id = :userId', { userId, status })
  return findUserById(userId)
}
