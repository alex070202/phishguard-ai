import { createContactMessage } from '../services/contactService.js'

export async function contactController(request, response, next) {
  try {
    const name = String(request.body.name || '').trim()
    const email = String(request.body.email || '').trim().toLowerCase()
    const message = String(request.body.message || '').trim()

    if (!name || !email || !message) {
      response.status(400).json({ error: 'Name, email and message are required.' })
      return
    }

    if (!email.includes('@')) {
      response.status(400).json({ error: 'Please provide a valid email address.' })
      return
    }

    await createContactMessage({ name, email, message, ipAddress: request.ip })
    response.status(201).json({ ok: true, message: 'Message received.' })
  } catch (error) {
    next(error)
  }
}
