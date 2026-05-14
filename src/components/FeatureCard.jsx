import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FeatureCard({ icon: Icon, title, description, to, accent = 'cyan' }) {
  const accents = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/25',
    green: 'text-cyber-green bg-cyber-green/10 border-cyber-green/25',
    blue: 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue/25',
  }

  return (
    <Link to={to} className="panel group block p-6 transition hover:-translate-y-1 hover:border-cyber-cyan/40">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-xl border ${accents[accent]}`}>
          <Icon size={24} />
        </div>
        <ArrowUpRight className="text-slate-500 transition group-hover:text-cyber-cyan" size={20} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </Link>
  )
}
