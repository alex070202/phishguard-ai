import { AlertOctagon, BarChart3, FileSearch, Image, ShieldCheck } from 'lucide-react'

const stats = [
  { label: 'Total checks', value: '128', icon: BarChart3, tone: 'text-cyber-cyan' },
  { label: 'Phishing checks', value: '76', icon: FileSearch, tone: 'text-cyber-blue' },
  { label: 'Image checks', value: '52', icon: Image, tone: 'text-cyber-green' },
  { label: 'High risk detections', value: '19', icon: AlertOctagon, tone: 'text-cyber-red' },
]

const history = [
  { id: 'PG-1048', type: 'Email', target: 'security@paypaI-support.com', score: '87%', status: 'High risk', date: '2026-05-14' },
  { id: 'PG-1047', type: 'Image', target: 'profile_photo.png', score: '74%', status: 'Suspicious', date: '2026-05-14' },
  { id: 'PG-1046', type: 'Email', target: 'billing@cloud-secure.net', score: '42%', status: 'Medium', date: '2026-05-13' },
  { id: 'PG-1045', type: 'Image', target: 'product_visual.webp', score: '21%', status: 'Low', date: '2026-05-12' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Security overview</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            A mock operational view for phishing and AI-image analysis activity.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-cyber-green/25 bg-cyber-green/10 px-4 py-3 text-sm font-semibold text-cyber-green">
          <ShieldCheck size={18} />
          System online
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="panel p-5 transition hover:-translate-y-1 hover:border-cyber-cyan/40">
            <div className="flex items-center justify-between">
              <Icon className={tone} size={24} />
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">Mock</span>
            </div>
            <p className="mt-6 text-3xl font-bold text-white">{value}</p>
            <p className="mt-2 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white">Analysis history</h2>
          <p className="mt-2 text-sm text-slate-400">Recent mock detections from both platform modules.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {history.map((item) => (
                <tr key={item.id} className="transition hover:bg-white/[0.035]">
                  <td className="px-6 py-4 font-semibold text-white">{item.id}</td>
                  <td className="px-6 py-4 text-slate-300">{item.type}</td>
                  <td className="px-6 py-4 text-slate-300">{item.target}</td>
                  <td className="px-6 py-4 text-slate-300">{item.score}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
