import { riskLevelFromScore, scoreIndicators } from './riskScoringAgent.js'
import { buildPhishingReport } from './reportAgent.js'

const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'cutt.ly', 'rebrand.ly', 'is.gd']
const urgencyWords = ['urgent', 'immediately', 'suspended', 'verify', 'confirm', '24 hours', 'limited time', 'account locked']
const dangerousKeywords = ['password', 'credentials', 'bank', 'card', 'payment', 'security code', 'wire transfer', 'invoice']
const suspiciousTlds = ['zip', 'mov', 'click', 'top', 'xyz', 'work']

const bulgarianPrizePhrases = [
  'печелиш',
  'печелите',
  'спечели',
  'спечелихте',
  'печеливш',
  'печеливша',
  'печеливши',
  'победител',
  'победители',
  'избран сте',
  'избрани сте',
  'награда',
  'наградата',
  'получавате награда',
  'честито',
  'вие сте нашият печеливш',
  'вие сте победител',
  'вземете наградата',
  'получите наградата',
]
const bulgarianPrizePatterns = [
  /вие\s+сте\s+.*печеливш/i,
  /вие\s+сте\s+.*победител/i,
  /наш(ият|ия|ата|ите)?\s+печеливш/i,
  /честито.*(печел|наград|победител)/i,
  /(спечел|печел|наград|победител)/i,
]
const bulgarianAccountThreatPhrases = [
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
const bulgarianSensitiveDataPhrases = ['въведете паролата си', 'въведете данните си']

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

function normalizeContent(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('bg-BG')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getMatches(content, phrases) {
  return phrases.filter((phrase) => content.includes(phrase))
}

function getPatternMatches(content, patterns) {
  return patterns.flatMap((pattern) => {
    const match = content.match(pattern)
    return match?.[0] ? [match[0]] : []
  })
}

function uniqueMatches(matches) {
  return [...new Set(matches)]
}

function getContextualMinimumScore(detectedIndicators) {
  const detectedKeys = new Set(detectedIndicators.map((indicator) => indicator.key))
  const prizeScamDetected = detectedKeys.has('bulgarian_prize_scam_phrase')
  const suspiciousActionDetected = detectedKeys.has('suspicious_action_phrase')
  const sensitiveDataDetected = detectedKeys.has('sensitive_data_request')
  const suspiciousUrlDetected = [
    'shortened_url',
    'suspicious_links',
    'domain_mismatch',
    'suspicious_tld',
  ].some((key) => detectedKeys.has(key))

  let minimumScore = prizeScamDetected ? 35 : 0

  if (prizeScamDetected && suspiciousActionDetected) minimumScore = 66
  if (prizeScamDetected && suspiciousUrlDetected) minimumScore = 75
  if (prizeScamDetected && sensitiveDataDetected) minimumScore = 85

  if (detectedKeys.has('account_threat_language') && detectedKeys.has('bulgarian_urgency_phrase')) {
    minimumScore = Math.max(minimumScore, 66)
  }

  return minimumScore
}

export function analyzePhishing(payload) {
  const senderEmail = String(payload.senderEmail || '').trim()
  const suspiciousUrl = String(payload.suspiciousUrl || '').trim()
  const emailContent = String(payload.emailContent || '').trim()
  const subject = String(payload.subject || '').trim()
  const content = normalizeContent(`${subject} ${emailContent}`)
  const senderDomain = getDomain(senderEmail)
  const urlHost = getUrlHost(suspiciousUrl)
  const urlParts = suspiciousUrl.match(/https?:\/\/[^\s]+/gi) || []
  const prizeMatches = uniqueMatches([
    ...getMatches(content, bulgarianPrizePhrases),
    ...getPatternMatches(content, bulgarianPrizePatterns),
  ])
  const accountThreatMatches = getMatches(content, bulgarianAccountThreatPhrases)
  const bulgarianUrgencyMatches = getMatches(content, bulgarianUrgencyPhrases)
  const bankingMatches = getMatches(content, bulgarianBankingPhrases)
  const suspiciousActionMatches = getMatches(content, bulgarianSuspiciousActionPhrases)
  const sensitiveDataMatches = getMatches(content, bulgarianSensitiveDataPhrases)

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
      detected: sensitiveDataMatches.length > 0,
      evidence: sensitiveDataMatches.join(', '),
    },
    {
      key: 'suspicious_action_phrase',
      label: 'Suspicious action phrase detected',
      weight: 15,
      detected: suspiciousActionMatches.length > 0,
      evidence: suspiciousActionMatches.join(', '),
    },
  ]

  const scoredResult = scoreIndicators(8, indicatorMatches)
  const score = Math.max(scoredResult.score, getContextualMinimumScore(scoredResult.detectedIndicators))
  const detectedIndicators = scoredResult.detectedIndicators
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
