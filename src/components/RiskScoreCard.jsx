export default function RiskScoreCard({ score, label, tone = 'red', caption, title = 'Risk score' }) {
  const tones = {
    red: 'text-cyber-red bg-cyber-red',
    amber: 'text-cyber-amber bg-cyber-amber',
    green: 'text-cyber-green bg-cyber-green',
    cyan: 'text-cyber-cyan bg-cyber-cyan',
  }

  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <p className={`mt-2 text-5xl font-bold ${tones[tone].split(' ')[0]}`}>{score}%</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${tones[tone].split(' ')[0]} bg-white/5`}>
          {label}
        </span>
      </div>
      <div className="mt-6 h-3 rounded-full bg-white/10">
        <div
          className={`h-3 rounded-full ${tones[tone].split(' ')[1]} shadow-glow`}
          style={{ width: `${score}%` }}
        />
      </div>
      {caption && <p className="mt-4 text-sm text-slate-400">{caption}</p>}
    </div>
  )
}
