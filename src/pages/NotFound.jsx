import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta.jsx'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <PageMeta title="Page Not Found" description="The requested PhishGuard AI page could not be found." />
      <div className="panel p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">404</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-slate-400">The page may have moved, or the route does not exist in this workspace.</p>
        <Link className="primary-button mt-6" to="/">Return home</Link>
      </div>
    </section>
  )
}
