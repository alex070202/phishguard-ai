import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/api.js'

export default function ResetPassword() {
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
      setError('Password reset token is missing.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirmation password must match.')
      return
    }

    setIsLoading(true)
    try {
      const result = await resetPassword({ token, ...formData })
      setMessage(result.message || 'Password reset completed. You can now log in.')
      setFormData({ password: '', confirmPassword: '' })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <KeyRound className="text-cyber-green" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Choose a new password for your account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">New Password</span>
            <input className="input-field" type="password" minLength={8} value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Confirm New Password</span>
            <input className="input-field" type="password" minLength={8} value={formData.confirmPassword} onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))} required />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}
          {message && <div className="rounded-lg border border-cyber-green/25 bg-cyber-green/10 p-3 text-sm text-cyber-green">{message}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <KeyRound size={18} />
            {isLoading ? 'Updating password...' : 'Reset password'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Ready to sign in? <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/login">Go to login</Link>
        </p>
      </div>
    </section>
  )
}
