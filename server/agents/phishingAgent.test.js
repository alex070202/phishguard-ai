import assert from 'node:assert/strict'
import test from 'node:test'

import { analyzePhishing } from './phishingAgent.js'

function analyze(emailContent, overrides = {}) {
  return analyzePhishing({
    senderEmail: 'notifications@example.com',
    suspiciousUrl: '',
    subject: '',
    emailContent,
    ...overrides,
  })
}

test('detects an uppercase Bulgarian winner phrase as medium risk', () => {
  const result = analyze('ВИЕ СТЕ НАШИЯТ ПЕЧЕЛИВШ!')

  assert.equal(result.riskLevel, 'Medium')
  assert.ok(result.riskScore >= 35)
  assert.ok(result.detectedIndicators.some((item) => item.key === 'bulgarian_prize_scam_phrase'))
  assert.match(result.explanation, /Bulgarian prize\/winner language/)
})

test('detects Bulgarian winner language with punctuation', () => {
  const result = analyze('Честито! Вие сте победител.')

  assert.equal(result.riskLevel, 'Medium')
  assert.ok(result.riskScore >= 35)
})

test('raises prize and action language to at least 60 percent', () => {
  const result = analyze('Спечелихте награда. Кликнете тук, за да я получите.')

  assert.ok(result.riskScore >= 60)
  assert.equal(result.riskLevel, 'High')
  assert.ok(result.detectedIndicators.some((item) => item.key === 'suspicious_action_phrase'))
})

test('classifies account threat and urgency language as high risk', () => {
  const result = analyze('Профилът ви е в заплаха. Потвърдете акаунта си до 24 часа.')

  assert.equal(result.riskLevel, 'High')
  assert.ok(result.riskScore >= 66)
})

test('keeps existing English phishing detection working', () => {
  const result = analyze('Urgent: verify your password immediately.', {
    suspiciousUrl: 'http://bit.ly/account-check',
  })

  assert.ok(result.riskScore >= 66)
  assert.ok(result.detectedIndicators.some((item) => item.key === 'urgency_language'))
  assert.ok(result.detectedIndicators.some((item) => item.key === 'shortened_url'))
})
