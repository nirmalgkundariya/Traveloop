import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Map, Globe, TrendingUp, Search, Trash2, Shield, Activity, BarChart2, Eye, UserX } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'
import StatsWidget from '../components/shared/StatsWidget'

const DAU_DATA = [
  { day: 'Mon', users: 1240 }, { day: 'Tue', users: 1890 }, { day: 'Wed', users: 2100 },
  { day: 'Thu', users: 1780 }, { day: 'Fri', users: 2340 }, { day: 'Sat', users: 3200 }, { day: 'Sun', users: 2890 },
]

const GROWTH_DATA = [
  { month: 'Jan', users: 4200, trips: 890 }, { month: 'Feb', users: 5100, trips: 1120 },
  { month: 'Mar', users: 6800, trips: 1450 }, { month: 'Apr', users: 7900, trips: 1820 },
  { month: 'May', users: 9200, trips: 2100 }, { month: 'Jun', users: 11400, trips: 2680 },
  { month: 'Jul', users: 13100, trips: 3200 }, { month: 'Aug', users: 15600, trips: 3890 },
]

const TOP_DESTINATIONS = [
  { name: 'Bali', count: 2847, color: '#8b5cf6' },
  { name: 'Tokyo', count: 2341, color: '#38bdf8' },
  { name: 'Paris', count: 1987, color: '#f59e0b' },
  { name: 'Santorini', count: 1654, color: '#10b981' },
  { name: 'Maldives', count: 1432, color: '#ec4899' },
]

const MOCK_USERS = [
  { id: 1, name: 'Sofia Chen', email: 'sofia@example.com', trips: 24, joined: '2024-01-15', status: 'active', role: 'user' },
  { id: 2, name: 'Alex Kumar', email: 'alex@example.com', trips: 8, joined: '2024-02-20', status: 'active', role: 'user' },
  { id: 3, name: 'Maria Santos', email: 'maria@example.com', trips: 31, joined: '2023-11-08', status: 'active', role: 'user' },
  { id: 4, name: 'James Wilson', email: 'james@example.com', trips: 2, joined: '2024-03-01', status: 'suspended', role: 'user' },
  { id: 5, name: 'Priya Sharma', email: 'priya@example.com', trips: 15, joined: '2024-01-28', status: 'active', role: 'user' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-3 text-sm">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  )
}

const TABS = ['Overview', 'Users', 'Destinations', 'Search Analytics']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview')
  const [users, setUsers] = useState(MOCK_USERS)
  const [userSearch, setUserSearch] = useState('')

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const suspendUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-violet-400" />
            <span className="badge badge-violet text-xs">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400 mt-1">Platform overview and user management</p>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'
            }`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsWidget title="Total Users" value={15600} icon={Users} color="violet" change={18} index={0} />
            <StatsWidget title="Total Trips" value={48200} icon={Map} color="sky" change={24} index={1} />
            <StatsWidget title="Countries" value={89} icon={Globe} color="green" change={5} index={2} />
            <StatsWidget title="DAU" value={2890} icon={Activity} color="amber" change={12} index={3} />
          </div>

          {/* Growth chart */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Platform Growth</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#8b5cf6" strokeWidth={2} fill="url(#userGrad)" />
                <Area type="monotone" dataKey="trips" name="Trips" stroke="#38bdf8" strokeWidth={2} fill="url(#tripGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DAU */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Daily Active Users (This Week)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={DAU_DATA}>
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" name="Users" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top destinations pie */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Top Destinations</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={TOP_DESTINATIONS} dataKey="count" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                      {TOP_DESTINATIONS.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {TOP_DESTINATIONS.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-slate-300">{d.name}</span>
                      </div>
                      <span className="text-white font-semibold">{d.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'Users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input-glass pl-11" placeholder="Search users by name or email..."
                value={userSearch} onChange={e => setUserSearch(e.target.value)} />
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/10 grid grid-cols-5 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="col-span-2">User</span>
              <span>Trips</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-white/5">
              {filteredUsers.map((u, i) => (
                <motion.div key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
                      {u.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{u.name}</p>
                      <p className="text-slate-500 text-xs truncate">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 text-sm">{u.trips}</span>
                  <span className={`badge text-xs w-fit ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {u.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => suspendUser(u.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                      <UserX size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'Destinations' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Most Searched Destinations</h3>
            <div className="space-y-3">
              {[...TOP_DESTINATIONS, { name: 'New York', count: 1201, color: '#6366f1' }, { name: 'Barcelona', count: 987, color: '#f97316' }].map((d, i) => (
                <div key={d.name} className="flex items-center gap-4">
                  <span className="text-slate-500 text-sm w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{d.name}</span>
                      <span className="text-slate-400 text-sm">{d.count.toLocaleString()} trips</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / 2847) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.06 }}
                        className="h-full rounded-full"
                        style={{ background: d.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'Search Analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <BarChart2 size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Search Analytics</h3>
          <p className="text-slate-400">Connect your analytics platform for detailed search data insights</p>
        </motion.div>
      )}
    </div>
  )
}
