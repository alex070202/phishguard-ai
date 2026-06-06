import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const language = i18n.resolvedLanguage === 'bg' ? 'bg' : 'en'

  function changeLanguage(nextLanguage) {
    i18n.changeLanguage(nextLanguage)
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-navy-900/90 p-1 shadow-lg shadow-black/30 backdrop-blur-md">
      <span className="px-1.5 text-slate-500" title={t('language.label')}>
        <Languages size={14} />
      </span>
      {['en', 'bg'].map((option) => (
        <button
          key={option}
          type="button"
          className={[
            'h-7 min-w-8 rounded-md px-1.5 text-[11px] font-semibold outline-none transition focus:ring-2 focus:ring-cyber-cyan/40',
            language === option ? 'bg-cyber-cyan text-navy-950' : 'text-slate-300 hover:bg-white/10 hover:text-white',
          ].join(' ')}
          onClick={() => changeLanguage(option)}
          aria-pressed={language === option}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
