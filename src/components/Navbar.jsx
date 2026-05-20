import { Link, NavLink } from 'react-router-dom'
import { Activity, BarChart3, FileSearch, Home, Image, Info, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/phishing', label: 'Email Analyzer', icon: FileSearch },
  { to: '/image-detector', label: 'Image Detector', icon: Image },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const { isAuthenticated, isAdmin, logoutUser, user } = useAuth()
  const visibleLinks = isAdmin
    ? [...links, { to: '/admin', label: 'Admin', icon: ShieldCheck }]
    : links

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-950/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-wide">PhishGuard AI</p>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Activity size={12} />
              Detection workspace
            </p>
          </div>
        </Link>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-cyber-cyan/15 text-cyber-cyan'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button type="button" className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white" onClick={logoutUser}>
              <LogOut size={16} />
              {user?.name || 'Logout'}
            </button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
