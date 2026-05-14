export default function ResultCard({ icon: Icon, title, children, tone = 'cyan' }) {
  const tones = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/25',
    red: 'text-cyber-red bg-cyber-red/10 border-cyber-red/25',
    green: 'text-cyber-green bg-cyber-green/10 border-cyber-green/25',
    amber: 'text-cyber-amber bg-cyber-amber/10 border-cyber-amber/25',
    blue: 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue/25',
  }

  return (
    <div className="soft-panel p-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`grid h-10 w-10 place-items-center rounded-lg border ${tones[tone]}`}>
            <Icon size={20} />
          </div>
        )}
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4 text-sm leading-7 text-slate-400">{children}</div>
    </div>
  )
}
