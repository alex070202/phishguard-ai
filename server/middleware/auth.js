import { verifyToken } from '../services/authService.js'

function getBearerToken(request) {
  const header = request.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return ''
  return header.slice('Bearer '.length)
}

export async function optionalAuth(request, response, next) {
  const token = getBearerToken(request)
  if (!token) {
    next()
    return
  }

  try {
    request.user = await verifyToken(token)
    next()
  } catch (error) {
    response.status(error.statusCode || 401).json({ error: error.message })
  }
}

export async function requireAuth(request, response, next) {
  const token = getBearerToken(request)
  if (!token) {
    response.status(401).json({ error: 'Authentication is required.' })
    return
  }

  try {
    request.user = await verifyToken(token)
    next()
  } catch (error) {
    response.status(error.statusCode || 401).json({ error: error.message })
  }
}

export function requireAdmin(request, response, next) {
  if (request.user?.role !== 'admin') {
    response.status(403).json({ error: 'Admin access is required.' })
    return
  }

  next()
}
