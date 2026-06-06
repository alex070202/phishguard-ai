import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { translateError } from '../i18n/display.js'

export default function Register() {
  const { registerUser } = useAuth()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError(t('auth.allRequired'))
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t('auth.validEmail'))
      return
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordLength'))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    setIsLoading(true)

    try {
      await registerUser(formData)
      setSuccess(t('auth.checkEmail'))
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    } catch (requestError) {
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <UserPlus className="text-cyber-green" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">{t('auth.registerTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{t('auth.registerDescription')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.name')}</span>
            <input className="input-field" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.email')}</span>
            <input className="input-field" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.password')}</span>
            <input className="input-field" type="password" minLength={8} value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('auth.confirmPassword')}</span>
            <input className="input-field" type="password" minLength={8} value={formData.confirmPassword} onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))} required />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}
          {success && <div className="rounded-lg border border-cyber-green/25 bg-cyber-green/10 p-3 text-sm text-cyber-green">{success}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <UserPlus size={18} />
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          {t('auth.alreadyRegistered')} <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/login">{t('auth.signIn')}</Link>
        </p>
      </div>
    </section>
  )
}
