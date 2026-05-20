import { riskLevelFromScore, scoreIndicators } from './riskScoringAgent.js'
import { buildPhishingReport } from './reportAgent.js'

const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'cutt.ly', 'rebrand.ly', 'is.gd']
const urgencyWords = ['urgent', 'immediately', 'suspended', 'verify', 'confirm', '24 hours', 'limited time', 'account locked']
const dangerousKeywords = ['password', 'credentials', 'bank', 'card', 'payment', 'security code', 'wire transfer', 'invoice']
const suspiciousTlds = ['zip', 'mov', 'click', 'top', 'xyz', 'work']
const bulgarianPrizePhrases = [
  'честито',
  'печелиш',
  'спечелихте',
  'награда',
  'получавате награда',
  'избран сте',
  'вие сте победител',
  'вземете наградата си',
]
const bulgarianAccountThreatPhrases = [
  'профилът ви е в заплаха',
  'профилът ви е в заплаха',
  'акаунтът ви ще бъде блокиран',
  'акаунтът ви е ограничен',
  'потвърдете акаунта си',
  'незабавно потвърждение',
  'потвърдете самоличността си',
  'входът ви е спрян',
  'профилът ви ще бъде изтрит',
]
const bulgarianUrgencyPhrases = [
  'веднага',
  'незабавно',
  'до 24 часа',
  'последен шанс',
  'спешно',
  'необходима е бърза реакция',
  'ако не потвърдите',
]
const bulgarianBankingPhrases = [
  'картата ви е блокирана',
  'банковата ви сметка',
  'потвърдете плащане',
  'неуспешно плащане',
  'възстановяване на сума',
  'актуализирайте платежните данни',
]
const bulgarianSuspiciousActionPhrases = [
  'натиснете тук',
  'кликнете тук',
  'отворете линка',
  'изтеглете файла',
  'въведете паролата си',
  'въведете данните си',
]

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

function getMatches(content, phrases) {
  return phrases.filter((phrase) => content.includes(phrase))
}

export function analyzePhishing(payload) {
  const senderEmail = String(payload.senderEmail || '').trim()
  const suspiciousUrl = String(payload.suspiciousUrl || '').trim()
  const emailContent = String(payload.emailContent || '').trim()
  const subject = String(payload.subject || '').trim()
  const content = `${subject} ${emailContent}`.toLocaleLowerCase('bg-BG')
  const senderDomain = getDomain(senderEmail)
  const urlHost = getUrlHost(suspiciousUrl)
  const urlParts = suspiciousUrl.match(/https?:\/\/[^\s]+/gi) || []
  const prizeMatches = getMatches(content, bulgarianPrizePhrases)
  const accountThreatMatches = getMatches(content, bulgarianAccountThreatPhrases)
  const bulgarianUrgencyMatches = getMatches(content, bulgarianUrgencyPhrases)
  const bankingMatches = getMatches(content, bulgarianBankingPhrases)
  const suspiciousActionMatches = getMatches(content, bulgarianSuspiciousActionPhrases)

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
      weight: 20,
      detected: Boolean(urlHost && shorteners.some((shortener) => urlHost.includes(shortener))),
      evidence: urlHost,
    },
    {
      key: 'urgency_language',
      label: 'Urgency language',
      weight: 15,
      detected: urgencyWords.some((word) => content.includes(word)),
      evidence: urgencyWords.filter((word) => content.includes(word)).join(', '),
    },
    {
      key: 'domain_mismatch',
      label: 'Domain mismatch',
      weight: 25,
      detected: Boolean(senderDomain && urlHost && !urlHost.includes(getRootToken(senderDomain))),
      evidence: `${senderDomain} -> ${urlHost}`,
    },
    {
      key: 'suspicious_links',
      label: 'Suspicious links',
      weight: 20,
      detected: urlParts.length > 1 || suspiciousUrl.startsWith('http://') || Boolean(urlHost && !urlHost.includes('.')),
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
    {
      key: 'bulgarian_urgency_phrase',
      label: 'Bulgarian urgency phrase detected',
      weight: 15,
      detected: bulgarianUrgencyMatches.length > 0,
      evidence: bulgarianUrgencyMatches.join(', '),
    },
    {
      key: 'bulgarian_prize_scam_phrase',
      label: 'Bulgarian prize scam phrase detected',
      weight: 20,
      detected: prizeMatches.length > 0,
      evidence: prizeMatches.join(', '),
    },
    {
      key: 'account_threat_language',
      label: 'Account threat language detected',
      weight: 25,
      detected: accountThreatMatches.length > 0,
      evidence: accountThreatMatches.join(', '),
    },
    {
      key: 'bulgarian_banking_payment_phrase',
      label: 'Bulgarian banking/payment phrase detected',
      weight: 25,
      detected: bankingMatches.length > 0,
      evidence: bankingMatches.join(', '),
    },
    {
      key: 'sensitive_data_request',
      label: 'Sensitive data request detected',
      weight: 30,
      detected: suspiciousActionMatches.some((phrase) => phrase.includes('паролата') || phrase.includes('данните')),
      evidence: suspiciousActionMatches.join(', '),
    },
    {
      key: 'suspicious_action_phrase',
      label: 'Suspicious action phrase detected',
      weight: 15,
      detected: suspiciousActionMatches.length > 0,
      evidence: suspiciousActionMatches.join(', '),
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
