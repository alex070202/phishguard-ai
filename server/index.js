import cors from 'cors'
import express from 'express'
import { checkDatabaseConnection } from './config/db.js'
import { env } from './config/env.js'
import { adminRoutes } from './routes/adminRoutes.js'
import { authRoutes } from './routes/authRoutes.js'
import { dashboardRoutes } from './routes/dashboardRoutes.js'
import { imageRoutes } from './routes/imageRoutes.js'
import { phishingRoutes } from './routes/phishingRoutes.js'

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS origin not allowed: ${origin}`))
    },
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', async (request, response) => {
  try {
    await checkDatabaseConnection()
    response.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    response.status(503).json({
      status: 'degraded',
      database: 'unavailable',
      message: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

app.use('/api/phishing', phishingRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', dashboardRoutes)

app.use((request, response) => {
  response.status(404).json({ error: 'API route not found.' })
})

app.use((error, request, response, _next) => {
  console.error(error)
  response.status(error.statusCode || 500).json({ error: error.message || 'Unexpected server error.' })
})

app.listen(env.port, () => {
  console.log(`PhishGuard AI API running on http://localhost:${env.port}`)
})
