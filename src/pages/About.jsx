import { Cpu, Database, GraduationCap, Layers3, MailSearch, ScanEye } from 'lucide-react'
import ResultCard from '../components/ResultCard.jsx'

const technologies = ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Express', 'MySQL', 'Multer']

export default function About() {
  return (
    <div className="space-y-8">
      <section className="panel p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Master thesis project</p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">About PhishGuard AI</h1>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">
              PhishGuard AI is a web-based cybersecurity platform developed as a master thesis project. It combines a React interface, an Express API, rule-based detection services, and a MySQL schema for storing analysis results.
            </p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-cyber-cyan/25 bg-cyber-cyan/10 text-cyber-cyan">
            <GraduationCap size={34} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <ResultCard icon={MailSearch} title="Phishing Email Detection" tone="red">
          The phishing module evaluates sender email, suspicious URLs, message text, domain mismatch, shorteners, urgency terms, and dangerous keywords.
        </ResultCard>
        <ResultCard icon={ScanEye} title="AI Image Detection" tone="green">
          The image module accepts validated uploads, checks file-level signals, and returns a structured placeholder report ready for future model integration.
        </ResultCard>
      </section>

      <section className="panel p-7">
        <div className="flex items-center gap-3">
          <Layers3 className="text-cyber-cyan" size={24} />
          <h2 className="text-xl font-semibold text-white">Technologies</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {technologies.map((technology) => (
            <span key={technology} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {technology}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <Cpu className="text-cyber-blue" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">Model integration path</h3>
          <p className="mt-3 leading-7 text-slate-400">
            The service layer can be extended with text classification, URL reputation APIs, image forensics models, and confidence calibration.
          </p>
        </div>
        <div className="panel p-6">
          <Database className="text-cyber-green" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">Database-backed workflow</h3>
          <p className="mt-3 leading-7 text-slate-400">
            Analysis records are designed around normalized MySQL tables for checks, detection results, users, and audit logs.
          </p>
        </div>
      </section>
    </div>
  )
}
