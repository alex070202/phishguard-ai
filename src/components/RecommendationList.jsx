import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function RecommendationList({ title, items = [], tone = 'cyan' }) {
  const { t } = useTranslation()
  const tones = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/25',
    red: 'text-cyber-red bg-cyber-red/10 border-cyber-red/25',
    green: 'text-cyber-green bg-cyber-green/10 border-cyber-green/25',
    amber: 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/25',
  }

  return (
    <div className="panel p-6">
      <h2 className="text-xl font-semibold text-white">{title || t('phishing.recommended')}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
            <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${tones[tone]}`}>
              <CheckCircle2 size={16} />
            </div>
            <p className="text-sm leading-6 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
