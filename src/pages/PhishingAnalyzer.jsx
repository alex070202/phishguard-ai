import { AlertTriangle, CheckCircle2, Link2, MailWarning, Radar, ShieldX } from 'lucide-react'
import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import RiskScoreCard from '../components/RiskScoreCard.jsx'

const indicators = [
  'suspicious sender domain',
  'urgency language',
  'shortened URL',
  'possible spoofing',
]

export default function PhishingAnalyzer() {
  const [showResult, setShowResult] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setShowResult(true)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Phishing module</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Phishing Email Analyzer</h1>
        <p className="mt-4 leading-7 text-slate-400">
          Paste email content and key metadata to simulate phishing risk analysis with a structured result summary.
        </p>

        <form onSubmit={handleSubmit} className="panel mt-7 space-y-5 p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Sender email</span>
            <input className="input-field" type="email" placeholder="security@paypaI-support.com" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Suspicious URL</span>
            <input className="input-field" type="url" placeholder="https://bit.ly/account-verify" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email content</span>
            <textarea
              className="input-field min-h-48 resize-y"
              placeholder="Your account will be suspended in 24 hours. Confirm your identity immediately..."
            />
          </label>

          <button type="submit" className="primary-button w-full">
            <Radar size={18} />
            Analyze
          </button>
        </form>
      </section>

      <section className="space-y-5">
        {showResult ? (
          <>
            <RiskScoreCard
              score={87}
              label="High"
              tone="red"
              caption="Mock result based on suspicious sender patterns, link behavior, and social engineering language."
            />

            <div className="panel p-6">
              <div className="flex items-center gap-3">
                <ShieldX className="text-cyber-red" size={24} />
                <h2 className="text-xl font-semibold text-white">Detected indicators</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {indicators.map((indicator) => (
                  <div key={indicator} className="flex items-center gap-3 rounded-xl border border-cyber-red/20 bg-cyber-red/10 p-4">
                    <AlertTriangle className="shrink-0 text-cyber-red" size={18} />
                    <span className="text-sm text-slate-200">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard icon={MailWarning} title="Sender analysis" tone="red">
                Domain similarity and spoofing markers suggest that the sender may be impersonating a trusted brand.
              </ResultCard>
              <ResultCard icon={Link2} title="URL analysis" tone="amber">
                The submitted link uses shortening behavior and may hide its final destination from the user.
              </ResultCard>
            </div>
          </>
        ) : (
          <div className="panel flex min-h-[28rem] items-center justify-center p-8 text-center">
            <div>
              <CheckCircle2 className="mx-auto text-cyber-green" size={42} />
              <h2 className="mt-5 text-2xl font-semibold text-white">Ready to analyze</h2>
              <p className="mt-3 max-w-md text-slate-400">
                Submit the form to display the mock phishing risk score, detected indicators, and explanation cards.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
