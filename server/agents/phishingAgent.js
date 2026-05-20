import { riskLevelFromScore, scoreIndicators } from './riskScoringAgent.js'
import { buildPhishingReport } from './reportAgent.js'

const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'cutt.ly', 'rebrand.ly', 'is.gd']
const urgencyWords = ['urgent', 'immediately', 'suspended', 'verify', 'confirm', '24 hours', 'limited time', 'account locked']
const dangerousKeywords = ['password', 'credentials', 'bank', 'card', 'payment', 'security code', 'wire transfer', 'invoice']
const suspiciousTlds = ['zip', 'mov', 'click', 'top', 'xyz', 'work']

function getDomain(email) {
  return email.split('@')[1]?.toLowerCase().trim() || ''
}

function getUrlHost(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

function getRootToken(domain) {
  return domain.split('.')[0] || ''
}

export function analyzePhishing(payload) {
  const senderEmail = String(payload.senderEmail || '').trim()
  const suspiciousUrl = String(payload.suspiciousUrl || '').trim()
  const emailContent = String(payload.emailContent || '').trim()
  const content = emailContent.toLowerCase()
  const senderDomain = getDomain(senderEmail)
  const urlHost = getUrlHost(suspiciousUrl)
  const urlParts = suspiciousUrl.match(/https?:\/\/[^\s]+/gi) || []

  const indicatorMatches = [
    {
      key: 'invalid_sender',
      label: 'Invalid or incomplete sender email',
      weight: 16,
      detected: !senderEmail.includes('@') || !senderDomain.includes('.'),
      evidence: senderEmail || 'empty sender',
    },
    {
      key: 'suspicious_sender_domain',
      label: 'Suspicious sender domain',
      weight: 20,
      detected: Boolean(senderDomain && (senderDomain.includes('-') || /\d/.test(senderDomain))),
      evidence: senderDomain,
    },
    {
      key: 'shortened_url',
      label: 'Shortened URL',
      weight: 22,
      detected: Boolean(urlHost && shorteners.some((shortener) => urlHost.includes(shortener))),
      evidence: urlHost,
    },
    {
      key: 'urgency_language',
      label: 'Urgency language',
      weight: 16,
      detected: urgencyWords.some((word) => content.includes(word)),
      evidence: urgencyWords.filter((word) => content.includes(word)).join(', '),
    },
    {
      key: 'domain_mismatch',
      label: 'Domain mismatch',
      weight: 14,
      detected: Boolean(senderDomain && urlHost && !urlHost.includes(getRootToken(senderDomain))),
      evidence: `${senderDomain} -> ${urlHost}`,
    },
    {
      key: 'suspicious_links',
      label: 'Suspicious links',
      weight: 12,
      detected: urlParts.length > 1 || suspiciousUrl.startsWith('http://'),
      evidence: suspiciousUrl.startsWith('http://') ? 'plain HTTP link' : `${urlParts.length} links detected`,
    },
    {
      key: 'dangerous_keywords',
      label: 'Dangerous keywords',
      weight: 14,
      detected: dangerousKeywords.some((word) => content.includes(word)),
      evidence: dangerousKeywords.filter((word) => content.includes(word)).join(', '),
    },
    {
      key: 'suspicious_tld',
      label: 'Suspicious top-level domain',
      weight: 10,
      detected: suspiciousTlds.some((tld) => senderDomain.endsWith(`.${tld}`) || urlHost.endsWith(`.${tld}`)),
      evidence: senderDomain || urlHost,
    },
  ]

  const { score, detectedIndicators } = scoreIndicators(8, indicatorMatches)
  const riskLevel = riskLevelFromScore(score)
  const { explanation, recommendations } = buildPhishingReport({ riskScore: score, riskLevel, detectedIndicators })
  const analyzedAt = new Date().toISOString()

  return {
    riskScore: score,
    riskLevel,
    detectedIndicators,
    explanation,
    recommendations,
    analyzedAt,
  }
}
