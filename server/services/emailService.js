import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

function isEmailConfigured() {
  return Boolean(env.email.host && env.email.user && env.email.pass)
}

function createTransporter() {
  if (!isEmailConfigured()) {
    const error = new Error('Email service is not configured. Set EMAIL_HOST, EMAIL_USER and EMAIL_PASS.')
    error.statusCode = 503
    throw error
  }

  return nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  })
}

function buttonLink(url, label) {
  return `
    <p style="margin:24px 0">
      <a href="${url}" target="_blank" rel="noopener noreferrer" style="background:#22d3ee;color:#020617;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">
        ${label}
      </a>
    </p>
    <p style="word-break:break-all;color:#475569;font-size:13px">
      <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#0891b2">${url}</a>
    </p>
  `
}

async function sendMail({ to, subject, html, text }) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"PhishGuard AI" <${env.email.from}>`,
    to,
    subject,
    html,
    text,
  })
}

export async function sendVerificationEmail({ to, name, token }) {
  const verifyUrl = `${env.appFrontendUrl.replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`
  const greeting = name ? `Hello ${name},` : 'Hello,'

  await sendMail({
    to,
    subject: 'Confirm your PhishGuard AI account',
    text: `${greeting}\n\nConfirm your PhishGuard AI account by opening this link:\n${verifyUrl}\n\nThis link expires soon. If you did not create this account, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Confirm your PhishGuard AI account</h2>
        <p>${greeting}</p>
        <p>Your account was created and is waiting for email confirmation before login is enabled.</p>
        ${buttonLink(verifyUrl, 'Confirm account')}
        <p>This link expires soon. If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail({ to, name, token }) {
  const resetUrl = `${env.appFrontendUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`
  const greeting = name ? `Hello ${name},` : 'Hello,'
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2>Reset your PhishGuard AI password</h2>
      <p>${greeting}</p>
      <p>Use the link below to set a new password for your account.</p>
      ${buttonLink(resetUrl, 'Reset password')}
      <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
    </div>
  `

  await sendMail({
    to,
    subject: 'Reset your PhishGuard AI password',
    text: `${greeting}\n\nReset your PhishGuard AI password by opening this link:\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
    html,
  })
}
