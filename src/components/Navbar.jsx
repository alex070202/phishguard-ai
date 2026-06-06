import { Link, NavLink } from 'react-router-dom'
import { Activity, BarChart3, FileSearch, Home, Image, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/phishing', labelKey: 'nav.phishing', icon: FileSearch },
  { to: '/image-detector', labelKey: 'nav.image', icon: Image },
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: BarChart3 },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { isAuthenticated, isAdmin, logoutUser, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const visibleLinks = isAdmin
    ? [...links, { to: '/admin', labelKey: 'nav.admin', icon: ShieldCheck }]
    : links
  const navLinkClass = ({ isActive }) =>
    [
      'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium outline-none transition focus:ring-2 focus:ring-cyber-cyan/40',
      isActive ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-slate-300 hover:bg-white/5 hover:text-white',
    ].join(' ')

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-950/85 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-wide">PhishGuard AI</p>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Activity size={12} />
              {t('nav.workspace')}
            </p>
          </div>
        </Link>

          <button className="secondary-button px-3 py-2 lg:hidden" type="button" onClick={() => setIsOpen((current) => !current)} aria-label={t('nav.toggle')}>
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className={`${isOpen ? 'flex' : 'hidden'} mt-4 flex-col gap-2 lg:mt-0 lg:flex lg:flex-row lg:items-center lg:justify-end`}>
          {visibleLinks.map(({ to, labelKey, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={16} />
              {t(labelKey)}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button type="button" className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 outline-none transition hover:bg-white/5 hover:text-white focus:ring-2 focus:ring-cyber-cyan/40" onClick={() => { logoutUser(); setIsOpen(false) }}>
              <LogOut size={16} />
              {user?.name || t('nav.logout')}
            </button>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setIsOpen(false)}>
                {t('nav.login')}
              </NavLink>
              <NavLink to="/register" className={navLinkClass} onClick={() => setIsOpen(false)}>
                {t('nav.register')}
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
