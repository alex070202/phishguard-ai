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
          <h2 className="mt-3 text-3xl font-bold text-white">Focused protection for modern digital threats.</h2>
          <p className="mt-4 leading-7 text-slate-400">
            The first version uses mock analysis results to demonstrate the complete user experience before backend and AI model integration.
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
            description="Upload an image and review a mock probability score with visual authenticity explanations."
            to="/image-detector"
            accent="green"
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <ShieldAlert className="text-cyber-red" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">Cybersecurity SaaS interface</h3>
          <p className="mt-3 leading-7 text-slate-400">
            Dark navy interface, risk indicators, clean cards, and dashboard metrics tailored for a diploma project prototype.
          </p>
        </div>
        <div className="panel p-6">
          <Workflow className="text-cyber-cyan" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">Ready for expansion</h3>
          <p className="mt-3 leading-7 text-slate-400">
            Component-based React structure keeps the mock UI easy to connect with real APIs and machine learning services later.
          </p>
        </div>
      </section>
    </div>
  )
}
