import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Clock, DollarSign, Heart, Plus, Filter, X, Zap, Mountain, Utensils, Music, Leaf, ShoppingBag, Camera } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Zap },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'food', label: 'Food & Drink', icon: Utensils },
  { id: 'culture', label: 'Culture', icon: Camera },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'nature', label: 'Nature', icon: Leaf },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
]

const ACTIVITIES = [
  { id: 1, title: 'White Water Rafting', category: 'adventure', location: 'Bali, Indonesia', rating: 4.8, reviews: 2341, duration: '3 hours', cost: 45, popular: true, emoji: '🚣', desc: 'Thrilling rapids through lush jungle gorges' },
  { id: 2, title: 'Balinese Cooking Class', category: 'food', location: 'Ubud, Bali', rating: 4.9, reviews: 1876, duration: '4 hours', cost: 55, popular: true, emoji: '👨‍🍳', desc: 'Learn authentic recipes in a traditional kitchen' },
  { id: 3, title: 'Sunset Kecak Dance', category: 'culture', location: 'Uluwatu, Bali', rating: 4.9, reviews: 3201, duration: '1.5 hours', cost: 15, popular: true, emoji: '🔥', desc: 'Ancient fire dance ritual with dramatic cliff sunset backdrop' },
  { id: 4, title: 'Rooftop Bar Hopping', category: 'nightlife', location: 'Seminyak, Bali', rating: 4.6, reviews: 891, duration: '5 hours', cost: 60, popular: false, emoji: '🍹', desc: 'Explore the best rooftop cocktail bars at sunset' },
  { id: 5, title: 'Monkey Forest Walk', category: 'nature', location: 'Ubud, Bali', rating: 4.7, reviews: 4512, duration: '2 hours', cost: 5, popular: false, emoji: '🐒', desc: 'Sacred forest sanctuary home to 700+ wild macaques' },
  { id: 6, title: 'Traditional Market Tour', category: 'shopping', location: 'Denpasar, Bali', rating: 4.5, reviews: 654, duration: '3 hours', cost: 25, popular: false, emoji: '🛍️', desc: 'Navigate vibrant local markets with an expert guide' },
  { id: 7, title: 'Mount Batur Sunrise Trek', category: 'adventure', location: 'Kintamani, Bali', rating: 4.9, reviews: 5678, duration: '7 hours', cost: 65, popular: true, emoji: '🌋', desc: 'Pre-dawn hike to active volcano for spectacular sunrise views' },
  { id: 8, title: 'Seafood Beach BBQ', category: 'food', location: 'Jimbaran, Bali', rating: 4.7, reviews: 2109, duration: '2 hours', cost: 40, popular: false, emoji: '🦞', desc: 'Fresh catches grilled tableside on a candlelit beach' },
  { id: 9, title: 'Temple Hopping Tour', category: 'culture', location: 'Bali', rating: 4.8, reviews: 3345, duration: '8 hours', cost: 35, popular: true, emoji: '⛩️', desc: 'Visit 5 of Bali\'s most sacred and stunning temples' },
  { id: 10, title: 'Snorkeling at Nusa Penida', category: 'adventure', location: 'Nusa Penida, Bali', rating: 4.8, reviews: 2876, duration: '6 hours', cost: 55, popular: false, emoji: '🤿', desc: 'Crystal-clear waters, manta rays and vibrant coral reefs' },
  { id: 11, title: 'Rice Terrace Walk', category: 'nature', location: 'Tegalalang, Bali', rating: 4.6, reviews: 1543, duration: '2 hours', cost: 8, popular: false, emoji: '🌾', desc: 'Scenic walk through iconic UNESCO terraced rice fields' },
  { id: 12, title: 'Traditional Batik Workshop', category: 'culture', location: 'Ubud, Bali', rating: 4.7, reviews: 743, duration: '3 hours', cost: 30, popular: false, emoji: '🎨', desc: 'Learn the ancient art of Indonesian wax-resist dyeing' },
]

function ActivityCard({ activity, index, saved, onSave }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-card-hover p-5 flex gap-4"
    >
      {/* Emoji icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
        style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
        {activity.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold">{activity.title}</h3>
              {activity.popular && <span className="badge badge-amber text-xs">Popular</span>}
            </div>
            <p className="text-slate-500 text-xs mt-0.5">{activity.location}</p>
          </div>
          <button onClick={() => onSave(activity.id)}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${saved ? 'text-red-400 bg-red-500/10' : 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'}`}>
            <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-slate-400 text-sm mt-1.5 line-clamp-1">{activity.desc}</p>

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400" fill="currentColor" />
            <span className="text-white text-sm font-medium">{activity.rating}</span>
            <span className="text-slate-500 text-xs">({activity.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Clock size={11} /> {activity.duration}
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
            <DollarSign size={12} /> {activity.cost} <span className="text-slate-500 text-xs font-normal">/ person</span>
          </div>
        </div>
      </div>

      <button className="btn-primary text-sm px-4 py-2 self-center flex-shrink-0 flex items-center gap-1.5">
        <Plus size={13} /> Add
      </button>
    </motion.div>
  )
}

export default function ActivitySearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [maxCost, setMaxCost] = useState(200)
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [savedActivities, setSavedActivities] = useState(new Set())
  const [sortBy, setSortBy] = useState('popular')

  const filtered = ACTIVITIES
    .filter(a => {
      const q = query.toLowerCase()
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
      const matchC = category === 'all' || a.category === category
      const matchCost = a.cost <= maxCost
      const matchR = a.rating >= minRating
      return matchQ && matchC && matchCost && matchR
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.reviews - a.reviews
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price_low') return a.cost - b.cost
      if (sortBy === 'price_high') return b.cost - a.cost
      return 0
    })

  const toggleSave = (id) => setSavedActivities(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Discover Activities</h1>
        <p className="text-slate-400">Find and add amazing experiences to your trips</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-glass pl-11" placeholder="Search activities..."
              value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="input-glass w-auto text-sm"
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_low">Price: Low</option>
            <option value="price_high">Price: High</option>
          </select>
          <button onClick={() => setShowFilters(f => !f)}
            className={`btn-secondary flex items-center gap-2 text-sm ${showFilters ? 'border-violet-500 text-violet-400' : ''}`}>
            <Filter size={14} /> Filters
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                category === cat.id
                  ? 'bg-violet-500 text-white shadow-glow'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}>
              <cat.icon size={13} /> {cat.label}
            </button>
          ))}
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Max Price: <span className="text-emerald-400 font-semibold">${maxCost}</span>
                </label>
                <input type="range" min={5} max={200} step={5} value={maxCost}
                  onChange={e => setMaxCost(+e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Min Rating: <span className="text-amber-400 font-semibold">{'★'.repeat(Math.round(minRating))}{minRating > 0 ? ` (${minRating})` : ' Any'}</span>
                </label>
                <input type="range" min={0} max={5} step={0.5} value={minRating}
                  onChange={e => setMinRating(+e.target.value)} className="w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          <span className="text-white font-semibold">{filtered.length}</span> activities
        </p>
        {savedActivities.size > 0 && (
          <span className="badge badge-red flex items-center gap-1">
            <Heart size={10} /> {savedActivities.size} saved
          </span>
        )}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">No activities found</h3>
            <p className="text-slate-400">Try adjusting filters or search terms</p>
          </div>
        ) : (
          filtered.map((activity, i) => (
            <ActivityCard key={activity.id} activity={activity} index={i}
              saved={savedActivities.has(activity.id)} onSave={toggleSave} />
          ))
        )}
      </div>
    </div>
  )
}
