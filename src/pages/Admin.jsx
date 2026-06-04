import { Ban, CheckCircle2, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { banUser, getAdminChecks, getAdminLogs, getAdminStats, getAdminUsers, unbanUser } from '../services/api.js'

export default function Admin() {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [checks, setChecks] = useState([])
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData(nextSearch = search) {
    setIsLoading(true)
    setError('')

    try {
      const [statsResult, usersResult, checksResult, logsResult] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminChecks(nextSearch),
        getAdminLogs(nextSearch),
      ])
      setStats(statsResult)
      setUsers(usersResult)
      setChecks(checksResult)
      setLogs(logsResult)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleBan(user) {
    try {
      if (user.status === 'banned') {
        await unbanUser(user.id)
      } else {
        await banUser(user.id)
      }
      await loadAdminData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const statCards = [
    ['Users', stats.users || 0],
    ['Pending users', stats.pendingUsers || 0],
    ['Banned users', stats.bannedUsers || 0],
    ['Phishing checks', stats.phishingChecks || 0],
    ['Image checks', stats.imageChecks || 0],
    ['High risk', stats.highRiskDetections || 0],
    ['Audit logs', stats.auditLogs || 0],
  ]

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">Administration</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Admin panel</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">Manage users, review stored checks, and inspect audit activity.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => loadAdminData()}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {error && <div className="rounded-xl border border-cyber-red/25 bg-cyber-red/10 p-4 text-sm text-cyber-red">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map(([label, value]) => (
          <div className="panel p-5" key={label}>
            <ShieldCheck className="text-cyber-cyan" size={20} />
            <p className="mt-4 text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section className="panel p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3.5 text-slate-500" size={18} />
            <input className="input-field pl-10" placeholder="Search users, checks or audit logs" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <button className="primary-button" type="button" onClick={() => loadAdminData(search)}>Search</button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><Users size={20} /> Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Email verified</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 text-white">{user.name}</td>
                  <td className="px-5 py-4 text-slate-300">{user.email}</td>
                  <td className="px-5 py-4 text-slate-300">{user.role}</td>
                  <td className="px-5 py-4 text-slate-300">{user.status}</td>
                  <td className="px-5 py-4 text-slate-300">{user.emailVerified ? 'Yes' : 'No'}</td>
                  <td className="px-5 py-4">
                    <button className="secondary-button py-2" type="button" onClick={() => toggleBan(user)} disabled={user.role === 'admin'}>
                      {user.status === 'banned' ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                      {user.status === 'banned' ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataList title="Recent checks" items={checks} loading={isLoading} />
        <LogList title="Audit logs" items={logs} loading={isLoading} />
      </section>
    </div>
  )
}

function DataList({ title, items, loading }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/10 p-5"><h2 className="text-xl font-semibold text-white">{title}</h2></div>
      <div className="divide-y divide-white/10">
        {loading && <p className="p-5 text-sm text-slate-400">Loading...</p>}
        {!loading && !items.length && <p className="p-5 text-sm text-slate-400">No records found.</p>}
        {items.map((item) => (
          <div className="p-5" key={item.id}>
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-white">{item.target || item.id}</p>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{item.score}%</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{item.userEmail} · {item.type} · {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogList({ title, items, loading }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/10 p-5"><h2 className="text-xl font-semibold text-white">{title}</h2></div>
      <div className="divide-y divide-white/10">
        {loading && <p className="p-5 text-sm text-slate-400">Loading...</p>}
        {!loading && !items.length && <p className="p-5 text-sm text-slate-400">No logs found.</p>}
        {items.map((item) => (
          <div className="p-5" key={item.id}>
            <p className="font-semibold text-white">{item.action}</p>
            <p className="mt-2 text-sm text-slate-400">{item.userEmail || 'system'} · {new Date(item.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
