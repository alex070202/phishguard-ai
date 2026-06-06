import { AlertTriangle, CheckCircle2, Link2, MailWarning, Radar, ShieldX, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ResultCard from '../components/ResultCard.jsx'
import RecommendationList from '../components/RecommendationList.jsx'
import RiskScoreCard from '../components/RiskScoreCard.jsx'
import { translateError, translateIndicator, translateRecommendation, translateRiskLevel } from '../i18n/display.js'
import { analyzePhishing } from '../services/api.js'

const suspiciousSample = {
  subject: 'Профилът ви е в заплаха',
  senderEmail: 'security@paypaI-support.com',
  suspiciousUrl: 'https://bit.ly/account-verify-now',
  emailContent: 'Профилът ви е в заплаха. Потвърдете акаунта си до 24 часа. Въведете данните си, за да продължите.',
}

export default function PhishingAnalyzer() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    subject: '',
    senderEmail: '',
    suspiciousUrl: '',
    emailContent: '',
  })
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const nextResult = await analyzePhishing(formData)
      setResult(nextResult)
    } catch (requestError) {
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  function loadSuspiciousSample() {
    setFormData(suspiciousSample)
    setResult(null)
    setError('')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">{t('phishing.eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t('phishing.title')}</h1>
        <p className="mt-4 leading-7 text-slate-400">
          {t('phishing.description')}
        </p>

        <form onSubmit={handleSubmit} className="panel mt-7 space-y-5 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">{t('phishing.sampleHelp')}</p>
            <button type="button" className="secondary-button py-2" onClick={loadSuspiciousSample}>
              <Sparkles size={16} />
              {t('phishing.loadSample')}
            </button>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('phishing.subject')}</span>
            <input
              className="input-field"
              placeholder={t('phishing.subjectPlaceholder')}
              value={formData.subject}
              onChange={(event) => updateField('subject', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('phishing.sender')}</span>
            <input
              className="input-field"
              type="email"
              placeholder="security@paypaI-support.com"
              value={formData.senderEmail}
              onChange={(event) => updateField('senderEmail', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('phishing.url')}</span>
            <input
              className="input-field"
              type="url"
              placeholder="https://bit.ly/account-verify"
              value={formData.suspiciousUrl}
              onChange={(event) => updateField('suspiciousUrl', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('phishing.content')}</span>
            <textarea
              className="input-field min-h-48 resize-y"
              placeholder={t('phishing.contentPlaceholder')}
              value={formData.emailContent}
              onChange={(event) => updateField('emailContent', event.target.value)}
            />
          </label>

          {error && (
            <div className="rounded-xl border border-cyber-red/25 bg-cyber-red/10 p-4 text-sm text-cyber-red">
              {error}
            </div>
          )}

          <button type="submit" className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading}>
            <Radar size={18} />
            {isLoading ? t('phishing.analyzing') : t('phishing.analyze')}
          </button>
        </form>
      </section>

      <section className="space-y-5">
        {result ? (
          <>
            <RiskScoreCard
              score={result.score}
              label={translateRiskLevel(t, result.level)}
              tone={result.tone}
              caption={t('phishing.resultSummary', { level: translateRiskLevel(t, result.level), count: result.indicators.length })}
            />
            {result.persistenceWarning && (
              <div className="rounded-xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm text-cyber-amber">
                {t('phishing.persistenceWarning', { message: result.persistenceWarning })}
              </div>
            )}

            <div className="panel p-6">
              <div className="flex items-center gap-3">
                <ShieldX className="text-cyber-red" size={24} />
                <h2 className="text-xl font-semibold text-white">{t('phishing.detected')}</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {result.indicators.map((indicator) => (
                  <div key={indicator} className="flex items-center gap-3 rounded-xl border border-cyber-red/20 bg-cyber-red/10 p-4">
                    <AlertTriangle className="shrink-0 text-cyber-red" size={18} />
                    <span className="text-sm text-slate-200">{translateIndicator(t, indicator)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard icon={MailWarning} title={t('phishing.senderAnalysis')} tone="red">
                {t('phishing.senderAnalysisText')}
              </ResultCard>
              <ResultCard icon={Link2} title={t('phishing.urlAnalysis')} tone="amber">
                {t('phishing.urlAnalysisText')}
              </ResultCard>
            </div>

            <RecommendationList items={result.recommendations.map((item) => translateRecommendation(t, item))} tone={result.tone} />
          </>
        ) : (
          <div className="panel flex min-h-[28rem] items-center justify-center p-8 text-center">
            <div>
              <CheckCircle2 className="mx-auto text-cyber-green" size={42} />
              <h2 className="mt-5 text-2xl font-semibold text-white">{t('phishing.ready')}</h2>
              <p className="mt-3 max-w-md text-slate-400">
                {t('phishing.readyText')}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
