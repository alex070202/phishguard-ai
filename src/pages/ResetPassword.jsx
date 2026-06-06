import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { resetPassword } from '../services/api.js'
import { translateError } from '../i18n/display.js'

export default function ResetPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const token = searchParams.get('token')
    if (!token) {
      setError(t('auth.missingResetToken'))
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
      await resetPassword({ token, ...formData })
      setMessage(t('auth.resetSuccess'))
      setFormData({ password: '', confirmPassword: '' })
    } catch (requestError) {
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <KeyRound className="text-cyber-green" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">{t('auth.resetTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{t('auth.resetDescription')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('auth.newPassword')}</span>
            <input className="input-field" type="password" minLength={8} value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('auth.confirmNewPassword')}</span>
            <input className="input-field" type="password" minLength={8} value={formData.confirmPassword} onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))} required />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}
          {message && <div className="rounded-lg border border-cyber-green/25 bg-cyber-green/10 p-3 text-sm text-cyber-green">{message}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <KeyRound size={18} />
            {isLoading ? t('auth.updatingPassword') : t('auth.resetButton')}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          {t('auth.readySignIn')} <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/login">{t('auth.goLogin')}</Link>
        </p>
      </div>
    </section>
  )
}
