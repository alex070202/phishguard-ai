import { AlertOctagon, BarChart3, Download, FileSearch, Image, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  clearAnalysisHistory,
  exportAnalysisHistory,
  getAnalysisHistory,
  restoreDemoHistory,
} from '../utils/analysisHistory.js'

export default function Dashboard() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getAnalysisHistory())
  }, [])

  function clearHistory() {
    clearAnalysisHistory()
    setHistory([])
  }

  function resetDemoHistory() {
    setHistory(restoreDemoHistory())
  }

  function downloadHistory() {
    const csv = exportAnalysisHistory()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'phishguard-analysis-history.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = useMemo(() => {
    const phishingChecks = history.filter((item) => item.type === 'Email').length
    const imageChecks = history.filter((item) => item.type === 'Image').length
    const highRiskDetections = history.filter((item) => item.score >= 70 || item.status.toLowerCase().includes('high')).length

    return [
      { label: 'Total checks', value: history.length, icon: BarChart3, tone: 'text-cyber-cyan' },
      { label: 'Phishing checks', value: phishingChecks, icon: FileSearch, tone: 'text-cyber-blue' },
      { label: 'Image checks', value: imageChecks, icon: Image, tone: 'text-cyber-green' },
      { label: 'High risk detections', value: highRiskDetections, icon: AlertOctagon, tone: 'text-cyber-red' },
    ]
  }, [history])

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Security overview</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            A local operational view for phishing and AI-image analysis activity from this browser.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="secondary-button py-2" onClick={downloadHistory}>
            <Download size={16} />
            Export CSV
          </button>
          <button type="button" className="secondary-button py-2" onClick={resetDemoHistory}>
            <RotateCcw size={16} />
            Demo data
          </button>
          <button type="button" className="secondary-button py-2 text-cyber-red hover:border-cyber-red/40 hover:bg-cyber-red/10" onClick={clearHistory}>
            <Trash2 size={16} />
            Clear
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl border border-cyber-green/25 bg-cyber-green/10 px-4 py-2 text-sm font-semibold text-cyber-green">
            <ShieldCheck size={18} />
            System online
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="panel p-5 transition hover:-translate-y-1 hover:border-cyber-cyan/40">
            <div className="flex items-center justify-between">
              <Icon className={tone} size={24} />
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">Local</span>
            </div>
            <p className="mt-6 text-3xl font-bold text-white">{value}</p>
            <p className="mt-2 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white">Analysis history</h2>
          <p className="mt-2 text-sm text-slate-400">Recent detections saved locally from both platform modules.</p>
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
                  <td className="px-6 py-4 text-slate-300">{item.score}%</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{item.date}</td>
                </tr>
              ))}
              {!history.length && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan="6">
                    No local analysis history yet. Run an email or image check to populate the dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
