import fs from 'fs/promises'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import { env } from '../config/env.js'

const schemaPath = new URL('./schema.sql', import.meta.url)

async function runMigration() {
  const dbName = env.db.name.replace(/[^a-zA-Z0-9_]/g, '')
  const sql = (await fs.readFile(schemaPath, 'utf8')).replaceAll('phishguard_ai', dbName)
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  })

  try {
    await connection.query(sql)
    await ensureColumn(connection, dbName, 'users', 'password_hash', 'VARCHAR(255) NULL')
    await ensureColumn(connection, dbName, 'users', 'status', "ENUM('active', 'banned') NOT NULL DEFAULT 'active'")
    await ensureColumn(connection, dbName, 'users', 'updated_at', 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    await connection.query("UPDATE users SET role = 'user' WHERE role NOT IN ('user', 'admin')")
    await connection.query("ALTER TABLE users MODIFY role ENUM('user', 'admin') NOT NULL DEFAULT 'user'")

    await ensureColumn(connection, dbName, 'phishing_checks', 'subject', 'VARCHAR(255) NULL AFTER user_id')
    await ensureColumn(connection, dbName, 'detection_results', 'user_id', 'BIGINT UNSIGNED NULL AFTER source_id')
    await ensureIndex(connection, dbName, 'detection_results', 'idx_detection_user', 'CREATE INDEX idx_detection_user ON detection_results (user_id)')

    await ensureColumn(connection, dbName, 'audit_logs', 'user_id', 'BIGINT UNSIGNED NULL AFTER id')
    await ensureColumn(connection, dbName, 'audit_logs', 'details', 'JSON NULL AFTER entity_id')
    await ensureColumn(connection, dbName, 'audit_logs', 'ip_address', 'VARCHAR(80) NULL AFTER metadata')

    const adminPasswordHash = await bcrypt.hash('Admin123!', 12)
    const fallbackPasswordHash = await bcrypt.hash('ChangeMe123!', 12)
    await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'admin', 'active')
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         role = 'admin',
         status = 'active',
         password_hash = IF(password_hash IS NULL OR password_hash = '', VALUES(password_hash), password_hash)`,
      ['Demo Admin', 'admin@phishguard.ai', adminPasswordHash],
    )
    await connection.execute(
      `UPDATE users
       SET password_hash = ?
       WHERE password_hash IS NULL OR password_hash = ''`,
      [fallbackPasswordHash],
    )
    await connection.query('ALTER TABLE users MODIFY password_hash VARCHAR(255) NOT NULL')
    console.log(`Database schema is ready: ${env.db.name}`)
  } finally {
    await connection.end()
  }
}

async function ensureColumn(connection, dbName, tableName, columnName, definition) {
  const [rows] = await connection.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [dbName, tableName, columnName],
  )

  if (!rows.length) {
    await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`)
  }
}

async function ensureIndex(connection, dbName, tableName, indexName, createSql) {
  const [rows] = await connection.execute(
    `SELECT INDEX_NAME
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [dbName, tableName, indexName],
  )

  if (!rows.length) {
    await connection.query(createSql)
  }
}

runMigration().catch((error) => {
  console.error('Migration failed:', error.message)
  process.exit(1)
})
