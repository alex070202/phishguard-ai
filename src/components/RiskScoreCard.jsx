import { useTranslation } from 'react-i18next'

export default function RiskScoreCard({ score, label, tone = 'red', caption, title }) {
  const { t } = useTranslation()
  const tones = {
    red: 'text-cyber-red bg-cyber-red',
    amber: 'text-cyber-amber bg-cyber-amber',
    green: 'text-cyber-green bg-cyber-green',
    cyan: 'text-cyber-cyan bg-cyber-cyan',
  }

  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{title || t('phishing.riskScore')}</p>
          <p className={`mt-2 text-5xl font-bold ${tones[tone].split(' ')[0]}`}>{score}%</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${tones[tone].split(' ')[0]} bg-white/5`}>
          {label}
        </span>
      </div>
      <div className="mt-6 h-3 rounded-full bg-white/10">
        <div
          className={`h-3 rounded-full ${tones[tone].split(' ')[1]} shadow-glow`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 grid grid-cols-3 text-xs text-slate-500">
        <span>{t('common.low')}</span>
        <span className="text-center">{t('common.medium')}</span>
        <span className="text-right">{t('common.high')}</span>
      </div>
      {caption && <p className="mt-4 text-sm text-slate-400">{caption}</p>}
    </div>
  )
}
