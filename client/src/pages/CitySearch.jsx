import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Thermometer, DollarSign, Star, Heart, Plus, Filter, Globe, TrendingUp, X } from 'lucide-react'

const CITIES = [
  { id: 1, name: 'Bali', country: 'Indonesia', region: 'Asia', emoji: '🌴', temp: '28°C', costIndex: 2, rating: 4.8, tags: ['Beach', 'Culture', 'Food'], desc: 'Island paradise with stunning temples, rice terraces, and world-class surfing beaches.', trending: true },
  { id: 2, name: 'Santorini', country: 'Greece', region: 'Europe', emoji: '🏛️', temp: '22°C', costIndex: 4, rating: 4.9, tags: ['Luxury', 'Romance', 'Views'], desc: 'Iconic whitewashed villages perched on volcanic cliffs above the Aegean Sea.', trending: true },
  { id: 3, name: 'Tokyo', country: 'Japan', region: 'Asia', emoji: '🗼', temp: '18°C', costIndex: 3, rating: 4.9, tags: ['City', 'Culture', 'Food'], desc: 'Ultra-modern metropolis where ancient traditions blend seamlessly with futuristic innovation.', trending: false },
  { id: 4, name: 'New York', country: 'USA', region: 'Americas', emoji: '🗽', temp: '12°C', costIndex: 5, rating: 4.7, tags: ['City', 'Shopping', 'Arts'], desc: 'The city that never sleeps — iconic skyline, world-class museums, and endless entertainment.', trending: false },
  { id: 5, name: 'Maldives', country: 'Maldives', region: 'Asia', emoji: '🌊', temp: '30°C', costIndex: 5, rating: 5.0, tags: ['Beach', 'Luxury', 'Diving'], desc: 'Crystal-clear lagoons, overwater bungalows, and the most pristine beaches on earth.', trending: true },
  { id: 6, name: 'Paris', country: 'France', region: 'Europe', emoji: '🗼', temp: '14°C', costIndex: 4, rating: 4.7, tags: ['Romance', 'Arts', 'Food'], desc: 'City of light, love, and legendary cuisine. Home to the Eiffel Tower and Louvre.', trending: false },
  { id: 7, name: 'Dubai', country: 'UAE', region: 'Middle East', emoji: '🌆', temp: '35°C', costIndex: 4, rating: 4.6, tags: ['Luxury', 'Shopping', 'Desert'], desc: 'Futuristic skyline rising from the desert, featuring the world\'s tallest building and ultra-luxury experiences.', trending: true },
  { id: 8, name: 'Kyoto', country: 'Japan', region: 'Asia', emoji: '⛩️', temp: '16°C', costIndex: 3, rating: 4.8, tags: ['Culture', 'History', 'Nature'], desc: 'Ancient Japanese capital with thousands of temples, geisha districts, and bamboo forests.', trending: false },
  { id: 9, name: 'Barcelona', country: 'Spain', region: 'Europe', emoji: '🏖️', temp: '20°C', costIndex: 3, rating: 4.8, tags: ['Architecture', 'Beach', 'Food'], desc: 'Gaudi\'s masterpieces, vibrant nightlife, and Mediterranean beaches make this city unforgettable.', trending: false },
  { id: 10, name: 'Cape Town', country: 'South Africa', region: 'Africa', emoji: '🏔️', temp: '19°C', costIndex: 2, rating: 4.7, tags: ['Nature', 'Adventure', 'Beaches'], desc: 'Dramatic Table Mountain backdrop, stunning coastal drives, and diverse wildlife nearby.', trending: false },
  { id: 11, name: 'Machu Picchu', country: 'Peru', region: 'Americas', emoji: '🏛️', temp: '15°C', costIndex: 2, rating: 4.9, tags: ['Adventure', 'History', 'Nature'], desc: 'Ancient Incan citadel set high in the Andes Mountains, one of the world\'s greatest wonders.', trending: false },
  { id: 12, name: 'Amsterdam', country: 'Netherlands', region: 'Europe', emoji: '🚲', temp: '12°C', costIndex: 4, rating: 4.6, tags: ['Culture', 'History', 'Canals'], desc: 'Charming canal city with world-class museums, cycling culture, and vibrant nightlife.', trending: false },
]

const REGIONS = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Middle East']
const COST_LABELS = ['', '$', '$$', '$$$', '$$$$', '$$$$$']
const COST_COLORS = ['', 'text-emerald-400', 'text-emerald-400', 'text-amber-400', 'text-orange-400', 'text-red-400']

function CityCard({ city, index, onSave, saved }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      {/* Hero */}
      <div className="h-44 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, hsl(${city.id * 37}, 70%, 25%), hsl(${city.id * 37 + 60}, 60%, 15%))` }}>
        <div className="absolute inset-0 flex items-center justify-center text-7xl select-none opacity-60 group-hover:scale-110 transition-transform duration-500">
          {city.emoji}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {city.trending && (
            <span className="badge badge-amber flex items-center gap-1">
              <TrendingUp size={10} /> Trending
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(city.id) }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all ${saved ? 'bg-red-500/80 text-white' : 'bg-black/30 text-white/70 hover:text-red-400'}`}>
          <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
          <Star size={11} className="text-amber-400" fill="currentColor" />
          <span className="text-white text-xs font-semibold">{city.rating}</span>
        </div>

        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-xl leading-tight">{city.name}</h3>
          <p className="text-white/70 text-sm">{city.country}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{city.desc}</p>

        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Thermometer size={13} className="text-sky-400" /> {city.temp}
          </span>
          <span className={`flex items-center gap-1.5 ${COST_COLORS[city.costIndex]} font-medium`}>
            <DollarSign size={13} /> {COST_LABELS[city.costIndex]}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {city.tags.map(tag => (
            <span key={tag} className="badge badge-sky text-xs">{tag}</span>
          ))}
        </div>

        {/* Action */}
        <button className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 mt-1">
          <Plus size={14} /> Add to Trip
        </button>
      </div>
    </motion.div>
  )
}

export default function CitySearch() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All')
  const [maxCost, setMaxCost] = useState(5)
  const [savedCities, setSavedCities] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [displayCount, setDisplayCount] = useState(8)

  const filtered = CITIES.filter(c => {
    const q = query.toLowerCase()
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))
    const matchR = region === 'All' || c.region === region
    const matchC = c.costIndex <= maxCost
    return matchQ && matchR && matchC
  })

  const displayed = filtered.slice(0, displayCount)

  const toggleSave = (id) => {
    setSavedCities(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Explore Cities</h1>
        <p className="text-slate-400">Discover your next destination from {CITIES.length}+ cities worldwide</p>
      </motion.div>

      {/* Search bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-glass pl-12 text-base py-4"
            placeholder="Search cities, countries, or experiences..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Region pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {REGIONS.map(r => (
            <button key={r}
              onClick={() => setRegion(r)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                region === r ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}>
              {r === 'All' && <Globe size={13} />}
              {r}
            </button>
          ))}
          <button onClick={() => setShowFilters(f => !f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${showFilters ? 'border-violet-500 text-violet-400 bg-violet-500/10' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            <Filter size={13} /> More Filters
          </button>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                Max Cost Level: <span className={COST_COLORS[maxCost]}>{COST_LABELS[maxCost]}</span>
              </label>
              <input type="range" min={1} max={5} value={maxCost} onChange={e => setMaxCost(+e.target.value)} className="w-full" />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>Budget</span><span>Mid</span><span>Luxury</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          <span className="text-white font-semibold">{filtered.length}</span> cities found
          {query && <> for "<span className="text-violet-400">{query}</span>"</>}
        </p>
        {savedCities.size > 0 && (
          <span className="badge badge-red flex items-center gap-1">
            <Heart size={10} /> {savedCities.size} saved
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No cities found</h3>
          <p className="text-slate-400">Try different filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map((city, i) => (
              <CityCard key={city.id} city={city} index={i}
                onSave={toggleSave} saved={savedCities.has(city.id)} />
            ))}
          </div>

          {/* Load more */}
          {displayCount < filtered.length && (
            <div className="text-center">
              <button onClick={() => setDisplayCount(n => n + 8)}
                className="btn-secondary px-8">
                Load More ({filtered.length - displayCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
