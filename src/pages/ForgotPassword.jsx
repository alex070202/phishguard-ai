import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/api.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    setIsLoading(true)
    try {
      const result = await forgotPassword({ email })
      setMessage(result.message || 'If an account with this email exists, a password reset link has been sent.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <MailCheck className="text-cyber-cyan" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">Forgot password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Request a secure reset link for your PhishGuard AI account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input className="input-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}
          {message && <div className="rounded-lg border border-cyber-green/25 bg-cyber-green/10 p-3 text-sm text-cyber-green">{message}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <MailCheck size={18} />
            {isLoading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Remembered it? <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  )
}
