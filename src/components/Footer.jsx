import { Github, Mail, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'

const footerSections = [
  {
    titleKey: 'footer.platform',
    links: [
      { labelKey: 'footer.about', to: '/about' },
      { labelKey: 'footer.faq', to: '/faq' },
      { labelKey: 'footer.contact', to: '/contact' },
    ],
  },
  {
    titleKey: 'footer.policies',
    links: [
      { labelKey: 'footer.privacy', to: '/privacy-policy' },
      { labelKey: 'footer.terms', to: '/terms-of-service' },
      { labelKey: 'footer.cookies', to: '/cookie-policy' },
      { labelKey: 'footer.security', to: '/security-policy' },
    ],
  },
  {
    titleKey: 'footer.project',
    links: [
      { labelKey: 'footer.phishing', to: '/phishing' },
      { labelKey: 'footer.image', to: '/image-detector' },
      { labelKey: 'footer.dashboard', to: '/dashboard' },
    ],
  },
]

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="mt-12 border-t border-white/10 bg-navy-950/95">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-semibold text-white">PhishGuard AI</p>
              <p className="text-xs text-slate-500">{t('footer.subtitle')}</p>
            </div>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            {t('footer.description')}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="secondary-button py-2" to="/contact">
              <Mail size={16} />
              {t('footer.contact')}
            </Link>
            <a className="secondary-button py-2" href="https://github.com/" target="_blank" rel="noreferrer">
              <Github size={16} />
              {t('footer.github')}
            </a>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.titleKey}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">{t(section.titleKey)}</h2>
              <div className="mt-4 grid gap-2">
                {section.links.map((link) => (
                  <Link key={link.to} className="text-sm text-slate-500 transition hover:text-cyber-cyan" to={link.to}>
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-center sm:justify-self-start">
            <LanguageSwitcher />
          </div>
          <span className="text-center text-xs text-slate-500 sm:col-start-2">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </span>
          <div className="hidden sm:block" aria-hidden="true" />
        </div>
      </div>
    </footer>
  )
}
