import { AlertOctagon, BarChart3, Download, FileSearch, Image, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getDashboardStats, getHealth, getHistory } from '../services/api.js'

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [statsData, setStatsData] = useState({
    totalChecks: 0,
    phishingChecks: 0,
    imageChecks: 0,
    highRiskDetections: 0,
  })
  const [health, setHealth] = useState({ status: 'checking', database: 'checking' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadDashboard('')
  }, [])

  async function loadDashboard(searchValue = search) {
    setIsLoading(true)
    setError('')

    try {
      const [statsResult, historyResult, healthResult] = await Promise.all([
        getDashboardStats(),
        getHistory(searchValue),
        getHealth().catch((healthError) => ({
          status: 'degraded',
          database: 'unavailable',
          message: healthError.message,
        })),
      ])

      setStatsData(statsResult)
      setHistory(historyResult)
      setHealth(healthResult)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = useMemo(
    () => [
      { label: 'Total checks', value: statsData.totalChecks, icon: BarChart3, tone: 'text-cyber-cyan' },
      { label: 'Phishing checks', value: statsData.phishingChecks, icon: FileSearch, tone: 'text-cyber-blue' },
      { label: 'Image checks', value: statsData.imageChecks, icon: Image, tone: 'text-cyber-green' },
      { label: 'High risk detections', value: statsData.highRiskDetections, icon: AlertOctagon, tone: 'text-cyber-red' },
    ],
    [statsData],
  )

  function downloadHistory() {
    const header = ['ID', 'Type', 'Target', 'Score', 'Status', 'Date']
    const rows = history.map((item) => [item.id, item.type, item.target, `${item.score}%`, item.status, item.date])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'phishguard-analysis-history.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const databaseConnected = health.database === 'connected'

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Security overview</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Operational view for stored phishing and image detection checks from the backend.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="secondary-button py-2" onClick={downloadHistory}>
            <Download size={16} />
            Export CSV
          </button>
          <button type="button" className="secondary-button py-2" onClick={() => loadDashboard(search)}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <div
            className={[
              'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold',
              databaseConnected
                ? 'border-cyber-green/25 bg-cyber-green/10 text-cyber-green'
                : 'border-cyber-amber/25 bg-cyber-amber/10 text-cyber-amber',
            ].join(' ')}
          >
            {databaseConnected ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            DB {health.database}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-cyber-red/25 bg-cyber-red/10 p-4 text-sm text-cyber-red">
          {error}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="panel p-5 transition hover:-translate-y-1 hover:border-cyber-cyan/40">
            <div className="flex items-center justify-between">
              <Icon className={tone} size={24} />
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">MySQL</span>
            </div>
            <p className="mt-6 text-3xl font-bold text-white">{value}</p>
            <p className="mt-2 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section className="panel p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="input-field"
            placeholder="Search by sender, subject, URL, content or risk level"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') loadDashboard(search)
            }}
          />
          <button className="primary-button" type="button" onClick={() => loadDashboard(search)}>
            Search
          </button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white">Analysis history</h2>
          <p className="mt-2 text-sm text-slate-400">Recent backend results from both detection modules.</p>
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
              {isLoading && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan="6">
                    Loading analysis history from backend...
                  </td>
                </tr>
              )}
              {!isLoading &&
                history.map((item) => (
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
              {!isLoading && !history.length && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan="6">
                    {search ? 'No matching checks found for this account.' : 'No stored checks yet. Run an email or image analysis to populate this table.'}
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
