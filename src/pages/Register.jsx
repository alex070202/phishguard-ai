import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { registerUser } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await registerUser(formData)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="panel p-7">
        <UserPlus className="text-cyber-green" size={32} />
        <h1 className="mt-4 text-3xl font-bold text-white">Register</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Create an analyst account. Dashboard records will be scoped to your user profile.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Name</span>
            <input className="input-field" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
            <input className="input-field" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
            <input className="input-field" type="password" minLength={8} value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} required />
          </label>

          {error && <div className="rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>}

          <button className="primary-button w-full disabled:opacity-60" type="submit" disabled={isLoading}>
            <UserPlus size={18} />
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-400">
          Already registered? <Link className="font-semibold text-cyber-cyan hover:text-cyan-300" to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  )
}
