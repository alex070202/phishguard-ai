import { AlertTriangle, CheckCircle2, Link2, MailWarning, Radar, ShieldX, Sparkles } from 'lucide-react'
import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import RecommendationList from '../components/RecommendationList.jsx'
import RiskScoreCard from '../components/RiskScoreCard.jsx'
import { analyzePhishing } from '../services/api.js'

const suspiciousSample = {
  subject: 'Профилът ви е в заплаха',
  senderEmail: 'security@paypaI-support.com',
  suspiciousUrl: 'https://bit.ly/account-verify-now',
  emailContent: 'Профилът ви е в заплаха. Потвърдете акаунта си до 24 часа. Въведете данните си, за да продължите.',
}

export default function PhishingAnalyzer() {
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
      setError(requestError.message)
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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Phishing module</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Phishing Email Analyzer</h1>
        <p className="mt-4 leading-7 text-slate-400">
          Submit email metadata to the backend rule engine for risk scoring, explanation, and database logging.
        </p>

        <form onSubmit={handleSubmit} className="panel mt-7 space-y-5 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">Use your own content or load a controlled test case for presentation.</p>
            <button type="button" className="secondary-button py-2" onClick={loadSuspiciousSample}>
              <Sparkles size={16} />
              Load suspicious sample
            </button>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Subject</span>
            <input
              className="input-field"
              placeholder="Профилът ви е в заплаха"
              value={formData.subject}
              onChange={(event) => updateField('subject', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Sender email</span>
            <input
              className="input-field"
              type="email"
              placeholder="security@paypaI-support.com"
              value={formData.senderEmail}
              onChange={(event) => updateField('senderEmail', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Suspicious URL</span>
            <input
              className="input-field"
              type="url"
              placeholder="https://bit.ly/account-verify"
              value={formData.suspiciousUrl}
              onChange={(event) => updateField('suspiciousUrl', event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email content</span>
            <textarea
              className="input-field min-h-48 resize-y"
              placeholder="Your account will be suspended in 24 hours. Confirm your identity immediately..."
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
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </section>

      <section className="space-y-5">
        {result ? (
          <>
            <RiskScoreCard
              score={result.score}
              label={result.level}
              tone={result.tone}
              caption={result.summary}
            />
            {result.persistenceWarning && (
              <div className="rounded-xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm text-cyber-amber">
                Analysis completed, but database persistence failed: {result.persistenceWarning}
              </div>
            )}

            <div className="panel p-6">
              <div className="flex items-center gap-3">
                <ShieldX className="text-cyber-red" size={24} />
                <h2 className="text-xl font-semibold text-white">Detected indicators</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {result.indicators.map((indicator) => (
                  <div key={indicator} className="flex items-center gap-3 rounded-xl border border-cyber-red/20 bg-cyber-red/10 p-4">
                    <AlertTriangle className="shrink-0 text-cyber-red" size={18} />
                    <span className="text-sm text-slate-200">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard icon={MailWarning} title="Sender analysis" tone="red">
                The sender is evaluated for invalid format, unusual domain characters, brand impersonation, and spoofing-like naming.
              </ResultCard>
              <ResultCard icon={Link2} title="URL analysis" tone="amber">
                The submitted link is checked for shortening services, insecure HTTP usage, and mismatch with the sender domain.
              </ResultCard>
            </div>

            <RecommendationList items={result.recommendations} tone={result.tone} />
          </>
        ) : (
          <div className="panel flex min-h-[28rem] items-center justify-center p-8 text-center">
            <div>
              <CheckCircle2 className="mx-auto text-cyber-green" size={42} />
              <h2 className="mt-5 text-2xl font-semibold text-white">Ready to analyze</h2>
              <p className="mt-3 max-w-md text-slate-400">
                Submit the form to request a backend analysis and render the returned indicators.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
