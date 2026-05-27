import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta.jsx'

export default function Unauthorized() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <PageMeta title="Unauthorized" description="Authentication is required to access this PhishGuard AI page." />
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-white">Authentication required</h1>
        <p className="mt-4 text-slate-400">Sign in with an authorized account to access protected dashboard and admin resources.</p>
        <Link className="primary-button mt-6" to="/login">Go to login</Link>
      </div>
    </section>
  )
}
