import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { forgotPassword } from '../services/api.js'
import { translateError } from '../i18n/display.js'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('auth.validEmail'))
      return
    }

    setIsLoading(true)
    try {
      await forgotPassword({ email })
      setMessage(t('auth.forgotSuccess'))
    } catch (requestError) {
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <MailCheck className="text-cyber-cyan" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">{t('auth.forgotTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{t('auth.forgotDescription')}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.email')}</span>
            <input className="input-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}
          {message && <div className="rounded-lg border border-cyber-green/25 bg-cyber-green/10 p-3 text-sm text-cyber-green">{message}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <MailCheck size={18} />
            {isLoading ? t('auth.sendingLink') : t('auth.sendResetLink')}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          {t('auth.remembered')} <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/login">{t('auth.backLogin')}</Link>
        </p>
      </div>
    </section>
  )
}
