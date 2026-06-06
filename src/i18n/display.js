const errorKeys = [
  ['Invalid email or password.', 'errors.invalidCredentials'],
  ['Please verify your email before logging in.', 'errors.verifyBeforeLogin'],
  ['Your account has been banned.', 'errors.banned'],
  ['Email verification link is invalid or expired.', 'errors.verificationInvalid'],
  ['Password reset link is invalid or expired.', 'errors.resetInvalid'],
  ['A user with this email already exists.', 'errors.emailExists'],
  ['Authentication is required.', 'errors.authRequired'],
  ['Failed to fetch', 'errors.network'],
]

const indicatorKeys = {
  'Suspicious sender domain': 'phishing.indicators.suspiciousSender',
  'Urgency language detected': 'phishing.indicators.urgency',
  'Shortened URL detected': 'phishing.indicators.shortenedUrl',
  'Possible spoofing detected': 'phishing.indicators.spoofing',
  'Bulgarian urgency phrase detected': 'phishing.indicators.bgUrgency',
  'Bulgarian prize scam phrase detected': 'phishing.indicators.bgPrize',
  'Account threat language detected': 'phishing.indicators.accountThreat',
  'Sensitive data request detected': 'phishing.indicators.sensitiveData',
  'Banking or payment fraud language detected': 'phishing.indicators.banking',
  'Domain mismatch detected': 'phishing.indicators.domainMismatch',
}

const recommendationKeys = {
  'Do not open links or attachments from this message.': 'recommendations.noOpen',
  'Confirm the sender through a known official channel.': 'recommendations.confirmSender',
  'Escalate the email to a security administrator for review.': 'recommendations.escalate',
  'Review the sender domain and URL destination carefully.': 'recommendations.reviewDomain',
  'Do not enter credentials until the request is verified.': 'recommendations.noCredentials',
  'Use SPF, DKIM, DMARC, and URL reputation checks in production.': 'recommendations.emailControls',
  'Keep normal caution for unexpected account or payment requests.': 'recommendations.normalCaution',
  'Use backend reputation services before making a final decision.': 'recommendations.reputation',
  'Do not use the image as trusted evidence without independent verification.': 'recommendations.noImageTrust',
  'Review source, upload chain, and metadata before publishing or accepting it.': 'recommendations.reviewImageSource',
  'Run a dedicated image forensics or AI detector model for production decisions.': 'recommendations.runForensics',
  'Review visual consistency manually: text, hands, edges, lighting, and repeated textures.': 'recommendations.visualReview',
  'Compare the file against known originals or reverse image search results.': 'recommendations.reverseSearch',
  'Preserve the original file for later metadata checks.': 'recommendations.preserveOriginal',
  'Treat this result as informational until a real model is connected.': 'recommendations.informational'
}

export function translateError(t, message) {
  const match = errorKeys.find(([source]) => String(message || '').includes(source))
  return match ? t(match[1]) : message || t('common.requestFailed')
}

export function translateRiskLevel(t, value) {
  const normalized = String(value || '').toLowerCase()
  if (normalized.includes('high')) return t('common.high')
  if (normalized.includes('medium')) return t('common.medium')
  if (normalized.includes('low')) return t('common.low')
  return value
}

export function translateStatus(t, value) {
  const normalized = String(value || '').toLowerCase()
  const keys = {
    active: 'status.active',
    pending: 'status.pending',
    banned: 'status.banned',
    phishing: 'status.phishing',
    image: 'status.image',
    email: 'status.email',
    possibly_ai_generated: 'status.possiblyAi',
    needs_review: 'status.needsReview',
    low_suspicion: 'status.lowSuspicion',
    suspicious: 'status.suspicious',
    connected: 'dashboard.connected',
    unavailable: 'dashboard.unavailable',
    checking: 'dashboard.checking',
  }
  return keys[normalized] ? t(keys[normalized]) : translateRiskLevel(t, value)
}

export function translateIndicator(t, value) {
  const key = indicatorKeys[value]
  return key ? t(key) : value
}

export function translateRecommendation(t, value) {
  const key = recommendationKeys[value]
  return key ? t(key) : value
}
