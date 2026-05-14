const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'cutt.ly', 'rebrand.ly']
const trustedBrands = ['paypal', 'google', 'microsoft', 'apple', 'amazon', 'facebook', 'instagram', 'dhl', 'netflix']
const urgencyWords = ['urgent', 'immediately', 'suspended', 'verify', 'confirm', '24 hours', 'limited time', 'account locked']
const credentialWords = ['password', 'login', 'credentials', 'bank', 'card', 'payment', 'invoice', 'security code']

function clampScore(score) {
  return Math.max(0, Math.min(100, score))
}

function getDomain(email) {
  return email.split('@')[1]?.toLowerCase() || ''
}

function getUrlHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

function hasBrandSpoofing(value) {
  const normalized = value.toLowerCase().replaceAll('1', 'l').replaceAll('0', 'o')
  return trustedBrands.some((brand) => normalized.includes(brand) && !normalized.endsWith(`${brand}.com`))
}

export function analyzePhishingEmail({ senderEmail, suspiciousUrl, emailContent }) {
  const domain = getDomain(senderEmail)
  const host = getUrlHost(suspiciousUrl)
  const content = emailContent.toLowerCase()
  const indicators = []
  let score = 8

  if (!senderEmail.includes('@') || !domain.includes('.')) {
    score += 18
    indicators.push('invalid or incomplete sender email')
  }

  if (domain && (domain.includes('-') || /\d/.test(domain) || hasBrandSpoofing(domain))) {
    score += 24
    indicators.push('suspicious sender domain')
  }

  if (host && shorteners.some((shortener) => host.includes(shortener))) {
    score += 22
    indicators.push('shortened URL')
  }

  if (host && suspiciousUrl.startsWith('http://')) {
    score += 12
    indicators.push('unsecured HTTP link')
  }

  if (urgencyWords.some((word) => content.includes(word))) {
    score += 18
    indicators.push('urgency language')
  }

  if (credentialWords.some((word) => content.includes(word))) {
    score += 14
    indicators.push('request for sensitive information')
  }

  if (domain && host && !host.includes(domain.split('.')[0])) {
    score += 10
    indicators.push('possible spoofing')
  }

  if (!indicators.length) {
    indicators.push('no strong phishing indicators detected')
  }

  const finalScore = clampScore(score)
  const level = finalScore >= 75 ? 'High' : finalScore >= 45 ? 'Medium' : 'Low'
  const tone = finalScore >= 75 ? 'red' : finalScore >= 45 ? 'amber' : 'green'

  return {
    score: finalScore,
    level,
    tone,
    indicators,
    summary:
      finalScore >= 75
        ? 'The message contains multiple strong phishing signals and should be treated as dangerous.'
        : finalScore >= 45
          ? 'The message contains suspicious signals and should be reviewed before any user action.'
          : 'The message has low heuristic risk, but a real system should still verify sender reputation and URLs.',
  }
}
