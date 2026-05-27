import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta.jsx'

export default function BannedAccount() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <PageMeta title="Account Restricted" description="This PhishGuard AI account is restricted." />
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-white">Account restricted</h1>
        <p className="mt-4 text-slate-400">This account cannot access the platform. Contact an administrator if you believe this is incorrect.</p>
        <Link className="secondary-button mt-6" to="/contact">Contact support</Link>
      </div>
    </section>
  )
}
