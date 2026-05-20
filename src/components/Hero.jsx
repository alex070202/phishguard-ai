import { ArrowRight, FileSearch, Image, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/25 bg-cyber-cyan/10 px-4 py-2 text-sm text-cyber-cyan">
          <LockKeyhole size={16} />
          Email and image detection workspace
        </div>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          PhishGuard AI
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          A thesis-grade web platform for evaluating phishing indicators, suspicious URLs, and file-level image authenticity signals with stored backend results.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/phishing" className="primary-button">
            <FileSearch size={18} />
            Analyze Email
            <ArrowRight size={18} />
          </Link>
          <Link to="/image-detector" className="secondary-button">
            <Image size={18} />
            Check Image
          </Link>
        </div>
      </div>

      <div className="panel p-5">
        <div className="grid gap-4">
          <div className="soft-panel p-5">
            <p className="text-sm text-slate-400">Current detection model</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-5xl font-bold text-cyber-cyan">v0.2</span>
              <span className="rounded-full bg-cyber-green/15 px-3 py-1 text-sm font-semibold text-cyber-green">
                API enabled
              </span>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Analysis engine</span>
                <span className="text-white">Rule-based services</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Persistence</span>
                <span className="text-white">MySQL schema</span>
              </div>
              <div className="flex justify-between">
                <span>Upload handling</span>
                <span className="text-white">Validated API</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="soft-panel p-4">
              <p className="text-2xl font-bold text-cyber-cyan">5</p>
              <p className="mt-1 text-sm text-slate-400">API routes</p>
            </div>
            <div className="soft-panel p-4">
              <p className="text-2xl font-bold text-cyber-green">4</p>
              <p className="mt-1 text-sm text-slate-400">Service agents</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
