import { LogIn, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
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
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <ShieldCheck className="text-cyber-cyan" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Access your saved checks, dashboard, and account-specific history.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input
              className="input-field"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          No account yet? <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/register">Create one</Link>
        </p>
      </div>
    </section>
  )
}
