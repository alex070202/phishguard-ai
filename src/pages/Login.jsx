import { LogIn, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { translateError } from '../i18n/display.js'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { loginUser } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const user = await loginUser(formData)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (requestError) {
      if (requestError.message.toLowerCase().includes('banned')) {
        navigate('/account-banned')
        return
      }
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <ShieldCheck className="text-cyber-cyan" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">{t('auth.loginTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{t('auth.loginDescription')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.email')}</span>
            <input
              className="input-field"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-300">
              {t('common.password')}
              <Link className="text-xs font-semibold text-cyber-cyan hover:text-cyan-300" to="/forgot-password">{t('auth.forgotLink')}</Link>
            </span>
            <input
              className="input-field"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <LogIn size={18} />
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          {t('auth.noAccount')} <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/register">{t('auth.createOne')}</Link>
        </p>
      </div>
    </section>
  )
}
