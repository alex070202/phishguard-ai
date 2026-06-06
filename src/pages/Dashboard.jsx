import { AlertOctagon, BarChart3, Download, FileSearch, Image, RefreshCw, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { translateError, translateStatus } from '../i18n/display.js'
import { clearMyHistory, getDashboardStats, getHealth, getHistory } from '../services/api.js'

export default function Dashboard() {
  const { t } = useTranslation()
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
  const [successMessage, setSuccessMessage] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    loadDashboard('')
  }, [])

  async function loadDashboard(searchValue = search) {
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

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
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  const stats = useMemo(
    () => [
      { label: t('dashboard.total'), value: statsData.totalChecks, icon: BarChart3, tone: 'text-cyber-cyan' },
      { label: t('dashboard.phishing'), value: statsData.phishingChecks, icon: FileSearch, tone: 'text-cyber-blue' },
      { label: t('dashboard.images'), value: statsData.imageChecks, icon: Image, tone: 'text-cyber-green' },
      { label: t('dashboard.highRisk'), value: statsData.highRiskDetections, icon: AlertOctagon, tone: 'text-cyber-red' },
    ],
    [statsData, t],
  )

  function downloadHistory() {
    const header = [t('dashboard.id'), t('common.type'), t('common.target'), t('common.score'), t('common.status'), t('common.date')]
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

  async function handleClearHistory() {
    setIsClearing(true)
    setError('')
    setSuccessMessage('')

    try {
      await clearMyHistory()
      setIsConfirmOpen(false)
      setSearch('')
      await loadDashboard('')
      setSuccessMessage(t('dashboard.cleared'))
    } catch (requestError) {
      setError(translateError(t, requestError.message))
    } finally {
      setIsClearing(false)
    }
  }

  const databaseConnected = health.database === 'connected'

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">{t('dashboard.eyebrow')}</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t('dashboard.title')}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            {t('dashboard.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="secondary-button py-2" onClick={downloadHistory}>
            <Download size={16} />
            {t('dashboard.export')}
          </button>
          <button type="button" className="secondary-button py-2 text-cyber-red hover:border-cyber-red/40 hover:bg-cyber-red/10" onClick={() => setIsConfirmOpen(true)}>
            <Trash2 size={16} />
            {t('dashboard.clear')}
          </button>
          <button type="button" className="secondary-button py-2" onClick={() => loadDashboard(search)}>
            <RefreshCw size={16} />
            {t('common.refresh')}
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
            {t('dashboard.database')} {translateStatus(t, health.database)}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-cyber-red/25 bg-cyber-red/10 p-4 text-sm text-cyber-red">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl border border-cyber-green/25 bg-cyber-green/10 p-4 text-sm text-cyber-green">
          {successMessage}
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
            placeholder={t('dashboard.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') loadDashboard(search)
            }}
          />
          <button className="primary-button" type="button" onClick={() => loadDashboard(search)}>
            {t('common.search')}
          </button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white">{t('dashboard.history')}</h2>
          <p className="mt-2 text-sm text-slate-400">{t('dashboard.historyDescription')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">{t('dashboard.id')}</th>
                <th className="px-6 py-4 font-medium">{t('common.type')}</th>
                <th className="px-6 py-4 font-medium">{t('common.target')}</th>
                <th className="px-6 py-4 font-medium">{t('common.score')}</th>
                <th className="px-6 py-4 font-medium">{t('common.status')}</th>
                <th className="px-6 py-4 font-medium">{t('common.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan="6">
                    {t('dashboard.loadingHistory')}
                  </td>
                </tr>
              )}
              {!isLoading &&
                history.map((item) => (
                  <tr key={item.id} className="transition hover:bg-white/[0.035]">
                    <td className="px-6 py-4 font-semibold text-white">{item.id}</td>
                    <td className="px-6 py-4 text-slate-300">{translateStatus(t, item.type)}</td>
                    <td className="px-6 py-4 text-slate-300">{item.target}</td>
                    <td className="px-6 py-4 text-slate-300">{item.score}%</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                        {translateStatus(t, item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{item.date}</td>
                  </tr>
                ))}
              {!isLoading && !history.length && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan="6">
                    {search ? t('dashboard.noMatches') : t('dashboard.noHistory')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">{t('dashboard.clearTitle')}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {t('dashboard.clearConfirm')}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button className="secondary-button" type="button" onClick={() => setIsConfirmOpen(false)} disabled={isClearing}>
                {t('common.cancel')}
              </button>
              <button className="primary-button bg-cyber-red text-white hover:bg-red-400" type="button" onClick={handleClearHistory} disabled={isClearing}>
                {isClearing ? t('dashboard.clearing') : t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
