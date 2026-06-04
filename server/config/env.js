import dotenv from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectRoot = resolve(serverRoot, '..')

dotenv.config({ path: resolve(projectRoot, '.env') })
dotenv.config({ path: resolve(serverRoot, '.env'), override: true })

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || 'phishguard_dev_secret_change_me',
  aiImageModelUrl: process.env.AI_IMAGE_MODEL_URL || '',
  appFrontendUrl: process.env.APP_FRONTEND_URL || 'http://localhost:5173',
  appBackendUrl: process.env.APP_BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
  email: {
    host: process.env.EMAIL_HOST || '',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: String(process.env.EMAIL_SECURE || 'false').toLowerCase() === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'bvbankov73@gmail.com',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'localhost',
    name: process.env.DB_NAME || 'phishguard_ai',
  },
}
