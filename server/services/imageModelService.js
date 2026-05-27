import http from 'http'
import https from 'https'
import { env } from '../config/env.js'

const ML_IMAGE_FIELD_NAME = 'image'
const ML_REQUEST_TIMEOUT_MS = 30000

export async function predictAiImage(file) {
  if (!env.aiImageModelUrl) {
    console.warn('[imageModelService] AI_IMAGE_MODEL_URL is not configured; using fallback analysis.')
    return {
      modelAvailable: false,
      fallbackUsed: true,
      modelName: 'model-service-not-configured',
      explanation: ['AI image model service URL is not configured.'],
    }
  }

  try {
    return await sendMultipartPrediction(file)
  } catch (error) {
    console.error('[imageModelService] ML request failed:', error.message)
    return {
      modelAvailable: false,
      fallbackUsed: true,
      modelName: 'model-service-unavailable',
      explanation: [`AI image model service is unavailable: ${error.message}`],
    }
  }
}

function sendMultipartPrediction(file) {
  return new Promise((resolve, reject) => {
    const url = new URL(env.aiImageModelUrl)
    const boundary = `----phishguard-${Date.now()}`
    const preamble = Buffer.from(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${ML_IMAGE_FIELD_NAME}"; filename="${escapeFilename(file.originalname)}"\r\n` +
        `Content-Type: ${file.mimetype}\r\n\r\n`,
    )
    const closing = Buffer.from(`\r\n--${boundary}--\r\n`)
    const body = Buffer.concat([preamble, file.buffer, closing])
    const client = url.protocol === 'https:' ? https : http

    console.info('[imageModelService] Sending image to ML service', {
      url: env.aiImageModelUrl,
      fieldName: ML_IMAGE_FIELD_NAME,
      filename: file.originalname,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      requestBytes: body.length,
    })

    const request = client.request(
      {
        method: 'POST',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
        timeout: ML_REQUEST_TIMEOUT_MS,
      },
      (response) => {
        const chunks = []
        response.on('data', (chunk) => chunks.push(chunk))
        response.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8')
          console.info('[imageModelService] ML response received', {
            url: env.aiImageModelUrl,
            statusCode: response.statusCode,
            body: raw,
          })

          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`model service returned ${response.statusCode}: ${raw}`))
            return
          }

          try {
            const parsed = JSON.parse(raw)
            resolve({
              aiProbability: normalizeProbability(parsed.aiProbability),
              status: parsed.status || parsed.label || 'unknown',
              label: parsed.label || 'unknown',
              confidence: normalizeProbability(parsed.confidence),
              modelName: parsed.modelName || 'external-ai-image-model',
              modelAvailable: Boolean(parsed.modelAvailable ?? true),
              fallbackUsed: Boolean(parsed.fallbackUsed ?? false),
              explanation: Array.isArray(parsed.explanation) ? parsed.explanation : [String(parsed.explanation || 'Model returned a prediction.')],
              signals: parsed.signals || null,
            })
          } catch (error) {
            reject(new Error(`model service returned invalid JSON: ${error.message}; body: ${raw}`))
          }
        })
      },
    )

    request.on('timeout', () => {
      console.error('[imageModelService] ML request timed out', {
        url: env.aiImageModelUrl,
        timeoutMs: ML_REQUEST_TIMEOUT_MS,
      })
      request.destroy(new Error(`model service request timed out after ${ML_REQUEST_TIMEOUT_MS}ms`))
    })
    request.on('error', (error) => {
      console.error('[imageModelService] ML fetch/network error', {
        url: env.aiImageModelUrl,
        message: error.message,
        code: error.code,
      })
      reject(error)
    })
    request.write(body)
    request.end()
  })
}

function escapeFilename(filename) {
  return String(filename || 'image').replaceAll('"', '')
}

function normalizeProbability(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return numeric > 1 ? Math.max(0, Math.min(1, numeric / 100)) : Math.max(0, Math.min(1, numeric))
}
