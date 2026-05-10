import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import TripCard from '../components/shared/TripCard'
import { SkeletonGrid } from '../components/ui/Skeleton'
import { Search, Grid, List, Filter, PlusCircle, SlidersHorizontal, Archive, Heart, Sparkles } from 'lucide-react'

const STATUS_FILTERS = ['all', 'planning', 'active', 'completed', 'archived']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'budget', label: 'Highest Budget' },
]

export default function MyTrips() {
  const { trips, fetchTrips, loading } = useTrips()
  const [view, setView] = useState('grid') // grid | list
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchTrips() }, [])

  const filtered = trips
    .filter(t => status === 'all' || t.status === status)
    .filter(t => t.name?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'budget') return (b.budget || 0) - (a.budget || 0)
      return 0
    })

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Trips</h1>
          <p className="text-slate-400">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button onClick={() => navigate('/trips/create')} className="btn-primary flex items-center gap-2 self-start">
          <PlusCircle size={18} /> New Trip
        </button>
      </motion.div>

      {/* Search & filters bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-glass pl-9" placeholder="Search trips by name or destination..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <select className="input-glass text-sm py-0"
              value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(f => !f)}
              className={`btn-secondary flex items-center gap-2 text-sm py-2 ${showFilters ? 'border-violet-500 text-violet-400' : ''}`}>
              <SlidersHorizontal size={14} /> Filters
            </button>

            {/* View toggle */}
            <div className="flex border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')}
                className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Grid size={16} />
              </button>
              <button onClick={() => setView('list')}
                className={`p-2.5 transition-colors ${view === 'list' ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status filter pills */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {STATUS_FILTERS.map(s => (
              <button key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  status === s ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-16 flex flex-col items-center text-center">
          <div className="text-7xl mb-4">🗺️</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {search || status !== 'all' ? 'No trips found' : 'No trips yet'}
          </h3>
          <p className="text-slate-400 mb-8 max-w-sm">
            {search ? `Try a different search term` : 'Start planning your first adventure!'}
          </p>
          <button onClick={() => navigate('/trips/create')} className="btn-primary flex items-center gap-2">
            <PlusCircle size={16} /> Create First Trip
          </button>
        </motion.div>
      ) : (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
          : 'space-y-3'
        }>
          {filtered.map((trip, i) => (
            view === 'grid' ? (
              <TripCard key={trip.id} trip={trip} index={i} />
            ) : (
              <motion.div key={trip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card-hover p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/trips/${trip.id}/view`)}>
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
                  {trip.coverImage && <img src={trip.coverImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{trip.name}</h3>
                  <p className="text-sm text-slate-400 truncate">{trip.destination}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                  <span className={`badge ${trip.status === 'planning' ? 'badge-violet' : trip.status === 'active' ? 'badge-green' : 'badge-sky'}`}>
                    {trip.status || 'planning'}
                  </span>
                  {trip.budget && <span className="text-sm text-slate-400">${trip.budget?.toLocaleString()}</span>}
                </div>
              </motion.div>
            )
          ))}
        </div>
      )}
    </div>
  )
}
