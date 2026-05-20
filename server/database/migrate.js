import fs from 'fs/promises'
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
    console.log(`Database schema is ready: ${env.db.name}`)
  } finally {
    await connection.end()
  }
}

runMigration().catch((error) => {
  console.error('Migration failed:', error.message)
  process.exit(1)
})
