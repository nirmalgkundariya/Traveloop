import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'
import StatsWidget from '../components/shared/StatsWidget'
import TripCard from '../components/shared/TripCard'
import { SkeletonGrid, SkeletonStat } from '../components/ui/Skeleton'
import { Map, PlusCircle, Globe, TrendingUp, Star, Wallet, Compass, ArrowRight, Cloud, Thermometer } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

const TRENDING = [
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', temp: '28°C', badge: 'Hot' },
  { name: 'Tokyo', country: 'Japan', emoji: '🗼', temp: '18°C', badge: 'Trending' },
  { name: 'Santorini', country: 'Greece', emoji: '🏛️', temp: '22°C', badge: 'Popular' },
  { name: 'New York', country: 'USA', emoji: '🗽', temp: '12°C', badge: 'Must-see' },
  { name: 'Dubai', country: 'UAE', emoji: '🌆', temp: '35°C', badge: 'Luxury' },
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️', temp: '16°C', badge: 'Cultural' },
]

const CHART_DATA = [
  { month: 'Jan', trips: 0 }, { month: 'Feb', trips: 1 }, { month: 'Mar', trips: 1 },
  { month: 'Apr', trips: 2 }, { month: 'May', trips: 3 }, { month: 'Jun', trips: 2 },
  { month: 'Jul', trips: 4 }, { month: 'Aug', trips: 3 }, { month: 'Sep', trips: 5 },
  { month: 'Oct', trips: 4 }, { month: 'Nov', trips: 6 }, { month: 'Dec', trips: 5 },
]

const QUICK_ACTIONS = [
  { label: 'New Trip', icon: PlusCircle, path: '/trips/create', color: 'violet' },
  { label: 'Find Cities', icon: Globe, path: '/cities', color: 'sky' },
  { label: 'Activities', icon: Star, path: '/activities', color: 'amber' },
  { label: 'My Trips', icon: Map, path: '/trips', color: 'green' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { trips, fetchTrips, loading } = useTrips()
  const navigate = useNavigate()
  const [greeting, setGreeting] = useState('')
  const [trendIdx, setTrendIdx] = useState(0)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening')
    fetchTrips()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTrendIdx(i => (i + 1) % TRENDING.length), 2000)
    return () => clearInterval(t)
  }, [])

  const upcomingTrips = trips.filter(t => t.status === 'planning' || t.status === 'active').slice(0, 3)
  const recentTrips = trips.slice(0, 6)

  return (
    <div className="page-container p-6 lg:p-8 space-y-8">
      {/* Hero/Welcome */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 lg:p-10"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(56,189,248,0.1) 50%, rgba(139,92,246,0.05) 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}>
        <div className="orb-violet w-72 h-72 -top-20 -right-20 opacity-30" />
        <div className="orb-sky w-48 h-48 bottom-0 right-1/3 opacity-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <motion.div
              key={trendIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="badge-violet badge mb-3 inline-flex items-center gap-1.5"
            >
              <Compass size={12} /> Trending: {TRENDING[trendIdx].name} {TRENDING[trendIdx].emoji}
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400 text-lg">Where are you heading next?</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/trips/create')} className="btn-primary flex items-center gap-2">
              <PlusCircle size={18} /> Plan a Trip
            </button>
            <button onClick={() => navigate('/cities')} className="btn-secondary flex items-center gap-2">
              <Globe size={18} /> Explore
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {QUICK_ACTIONS.map((a, i) => (
            <motion.button key={a.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(a.path)}
              className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all cursor-pointer">
              <a.icon size={20} className={`text-${a.color}-400`} />
              <span className="text-sm font-medium text-white">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [0, 1, 2, 3].map(i => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatsWidget title="Total Trips" value={trips.length} icon={Map} color="violet" change={12} index={0} />
            <StatsWidget title="Countries" value={new Set(trips.map(t => t.country)).size} icon={Globe} color="sky" change={5} index={1} />
            <StatsWidget title="Budget Saved" value={8420} prefix="$" icon={Wallet} color="green" change={8} index={2} />
            <StatsWidget title="Upcoming" value={upcomingTrips.length} icon={TrendingUp} color="amber" index={3} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent trips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Recent Trips</h2>
              <p className="section-subtitle">Your latest travel plans</p>
            </div>
            <button onClick={() => navigate('/trips')}
              className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <SkeletonGrid count={3} />
          ) : recentTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentTrips.slice(0, 4).map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card p-12 flex flex-col items-center text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No trips yet</h3>
              <p className="text-slate-400 mb-6">Start planning your first adventure!</p>
              <button onClick={() => navigate('/trips/create')} className="btn-primary flex items-center gap-2">
                <PlusCircle size={16} /> Create First Trip
              </button>
            </motion.div>
          )}
        </div>

        {/* Right sidebar widgets */}
        <div className="space-y-4">
          {/* Travel activity chart */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-1">Travel Activity</h3>
            <p className="text-xs text-slate-400 mb-4">Trips planned this year</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0a1535', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, color: '#f8fafc', fontSize: 12 }} />
                <Area type="monotone" dataKey="trips" stroke="#8b5cf6" strokeWidth={2} fill="url(#tripGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weather widget */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Weather</h3>
              <Cloud size={16} className="text-sky-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">☀️</div>
              <div>
                <div className="flex items-center gap-2">
                  <Thermometer size={14} className="text-amber-400" />
                  <span className="text-2xl font-bold text-white">28°C</span>
                </div>
                <p className="text-slate-400 text-sm">Your next destination</p>
              </div>
            </div>
          </div>

          {/* Trending destinations */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Trending Now 🔥</h3>
            <div className="space-y-3">
              {TRENDING.slice(0, 4).map((dest, i) => (
                <motion.div key={dest.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate('/cities')}>
                  <span className="text-2xl">{dest.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium group-hover:text-violet-400 transition-colors">{dest.name}</p>
                    <p className="text-slate-500 text-xs">{dest.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{dest.temp}</span>
                    <span className="badge badge-violet text-xs">{dest.badge}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
