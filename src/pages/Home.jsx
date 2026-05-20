import { FileSearch, Image, ShieldAlert, Workflow } from 'lucide-react'
import FeatureCard from '../components/FeatureCard.jsx'
import Hero from '../components/Hero.jsx'

export default function Home() {
  return (
    <div className="space-y-10">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Platform modules</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Two analysis flows, one backend record.</h2>
          <p className="mt-4 leading-7 text-slate-400">
            Each check is submitted to an Express API, evaluated by a service module, and prepared for storage in MySQL.
          </p>
        </div>
        <div className="grid gap-5 lg:col-span-2 md:grid-cols-2">
          <FeatureCard
            icon={FileSearch}
            title="Phishing Email Detection"
            description="Analyze sender patterns, suspicious links, spoofing signals, and urgency language in email content."
            to="/phishing"
            accent="cyan"
          />
          <FeatureCard
            icon={Image}
            title="AI Image Detection"
            description="Validate image uploads and return a placeholder probability report that can later be replaced with a model."
            to="/image-detector"
            accent="green"
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <ShieldAlert className="text-cyber-red" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">Operational interface</h3>
          <p className="mt-3 leading-7 text-slate-400">
            The UI presents inputs, results, warnings, persistence status, and dashboard history without relying on static demo-only data.
          </p>
        </div>
        <div className="panel p-6">
          <Workflow className="text-cyber-cyan" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">Service-oriented structure</h3>
          <p className="mt-3 leading-7 text-slate-400">
            Backend agents separate detection, scoring, reporting, and database persistence so the thesis can evolve cleanly.
          </p>
        </div>
      </section>
    </div>
  )
}
