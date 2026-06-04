import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../services/api.js'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [state, setState] = useState({ loading: true, error: '', message: '' })

  useEffect(() => {
    async function confirmEmail() {
      const token = searchParams.get('token')
      if (!token) {
        setState({ loading: false, error: 'Verification token is missing.', message: '' })
        return
      }

      try {
        const result = await verifyEmail(token)
        setState({ loading: false, error: '', message: result.message || 'Email verified successfully. You can now log in.' })
      } catch (error) {
        setState({ loading: false, error: error.message, message: '' })
      }
    }

    confirmEmail()
  }, [searchParams])

  return (
    <section className="mx-auto max-w-lg">
      <div className="panel p-7">
        {state.loading ? <Loader2 className="animate-spin text-cyber-cyan" size={32} /> : state.error ? <ShieldAlert className="text-cyber-red" size={32} /> : <CheckCircle2 className="text-cyber-green" size={32} />}
        <h1 className="mt-4 text-3xl font-bold text-white">Email verification</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">PhishGuard AI is checking the account confirmation link.</p>

        {state.loading && <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Verifying account...</div>}
        {state.error && <div className="mt-6 rounded-lg border border-cyber-red/25 bg-cyber-red/10 p-4 text-sm text-cyber-red">{state.error}</div>}
        {state.message && <div className="mt-6 rounded-lg border border-cyber-green/25 bg-cyber-green/10 p-4 text-sm text-cyber-green">{state.message}</div>}

        <Link className="primary-button mt-6 w-full justify-center" to="/login">Go to login</Link>
      </div>
    </section>
  )
}
