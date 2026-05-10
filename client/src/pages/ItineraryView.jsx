import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, List, MapPin, Clock, Hotel, Car, Utensils, Star, Printer, Share2, Edit2, Download } from 'lucide-react'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const VIEWS = ['timeline', 'list', 'calendar']

const TYPE_STYLES = {
  hotel: { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400', dot: 'bg-violet-500' },
  transport: { bg: 'bg-sky-500/15', border: 'border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-500' },
  food: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500' },
  sightseeing: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  activity: { bg: 'bg-pink-500/15', border: 'border-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-500' },
  other: { bg: 'bg-slate-500/15', border: 'border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-500' },
}

const TYPE_ICONS = { hotel: Hotel, transport: Car, food: Utensils, sightseeing: Star, activity: Star, other: MapPin }

const DEMO_DAYS = [
  { id: 1, date: '2024-06-01', title: 'Day 1 — Arrival', stops: [
    { id: '1', type: 'transport', title: 'Flight GF 123 to Bali', time: '08:30', location: 'Ngurah Rai International', cost: '0', notes: 'Terminal 2, Gate B12' },
    { id: '2', type: 'transport', title: 'Airport Transfer', time: '13:30', location: 'Hotel transfer', cost: '25' },
    { id: '3', type: 'hotel', title: 'The Apurva Kempinski', time: '15:00', location: 'Jimbaran Bay, Bali', cost: '280' },
    { id: '4', type: 'food', title: 'Sundara Beachfront Dinner', time: '19:00', location: 'Jimbaran Beach', cost: '60', notes: 'Reservation confirmed' },
  ]},
  { id: 2, date: '2024-06-02', title: 'Day 2 — Ubud & Culture', stops: [
    { id: '5', type: 'sightseeing', title: 'Tegalalang Rice Terraces', time: '09:00', location: 'Tegalalang, Ubud', cost: '5' },
    { id: '6', type: 'food', title: 'Locavore Restaurant', time: '13:00', location: 'Ubud Center', cost: '75', notes: 'Farm-to-table experience' },
    { id: '7', type: 'activity', title: 'Balinese Cooking Class', time: '15:30', location: 'Ubud', cost: '45' },
    { id: '8', type: 'sightseeing', title: 'Ubud Palace Sunset', time: '18:00', location: 'Ubud Royal Palace', cost: '0' },
  ]},
  { id: 3, date: '2024-06-03', title: 'Day 3 — Temples', stops: [
    { id: '9', type: 'sightseeing', title: 'Tanah Lot Temple', time: '07:00', location: 'Tabanan', cost: '5' },
    { id: '10', type: 'food', title: 'Warung Mak Beng', time: '12:00', location: 'Sanur', cost: '8' },
    { id: '11', type: 'sightseeing', title: 'Uluwatu Temple', time: '16:00', location: 'Uluwatu', cost: '5' },
    { id: '12', type: 'activity', title: 'Kecak Fire Dance', time: '18:00', location: 'Uluwatu Cliff', cost: '15' },
  ]},
]

export default function ItineraryView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('timeline')
  const [trip, setTrip] = useState(null)
  const [days, setDays] = useState(DEMO_DAYS)
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(res => {
        setTrip(res.data.trip)
        if (res.data.trip.itinerary?.days) setDays(res.data.trip.itinerary.days)
      })
      .catch(() => setTrip({ name: 'Bali Adventure', destination: 'Bali, Indonesia', startDate: '2024-06-01', endDate: '2024-06-05', travelersCount: 2 }))
  }, [id])

  const totalCost = days.flatMap(d => d.stops).reduce((s, st) => s + (parseFloat(st.cost) || 0), 0)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{trip?.name || '...'}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-violet-400" />{trip?.destination}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} className="text-sky-400" />
                {trip?.startDate && format(new Date(trip.startDate), 'MMM d')} – {trip?.endDate && format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
              <span className="badge-violet badge">{days.length} days</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm">
              <Share2 size={15} /> Share
            </button>
            <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm">
              <Printer size={15} /> Print
            </button>
            <button onClick={() => navigate(`/trips/${id}/itinerary`)} className="btn-primary flex items-center gap-2 text-sm">
              <Edit2 size={15} /> Edit
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Days', value: days.length, color: 'violet' },
            { label: 'Stops', value: days.flatMap(d => d.stops).length, color: 'sky' },
            { label: 'Estimated', value: `$${totalCost.toFixed(0)}`, color: 'green' },
            { label: 'Travelers', value: trip?.travelersCount || 1, color: 'amber' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
          {VIEWS.map(v => (
            <button key={v}
              onClick={() => setViewMode(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                viewMode === v ? 'bg-violet-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}>{v}</button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {viewMode === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day selector */}
          <div className="space-y-2">
            {days.map((day, i) => (
              <motion.button key={day.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setActiveDay(i)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  activeDay === i
                    ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                    : 'glass-card border-transparent hover:border-white/10'
                }`}>
                <p className="font-semibold text-sm">{day.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{day.date}</p>
                <p className="text-xs text-slate-600 mt-1">{day.stops.length} stops</p>
              </motion.button>
            ))}
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            {days[activeDay] && (
              <motion.div key={activeDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-1">
                <h2 className="text-xl font-bold text-white mb-6">{days[activeDay].title}</h2>
                {days[activeDay].stops.length === 0 ? (
                  <div className="glass-card p-12 text-center text-slate-500">
                    <MapPin size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No stops for this day</p>
                  </div>
                ) : (
                  days[activeDay].stops.map((stop, si) => {
                    const style = TYPE_STYLES[stop.type] || TYPE_STYLES.other
                    const Icon = TYPE_ICONS[stop.type] || MapPin
                    return (
                      <motion.div key={stop.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: si * 0.07 }}
                        className="flex gap-4">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 border-current flex-shrink-0 mt-4 ${style.dot} border-navy-900`} />
                          {si < days[activeDay].stops.length - 1 && (
                            <div className="w-px flex-1 my-1" style={{ background: 'rgba(139,92,246,0.2)' }} />
                          )}
                        </div>
                        {/* Card */}
                        <div className={`flex-1 mb-4 p-4 rounded-xl border ${style.bg} ${style.border}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg}`}>
                                <Icon size={16} className={style.text} />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{stop.title}</h3>
                                <div className="flex flex-wrap gap-3 mt-1">
                                  {stop.time && <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{stop.time}</span>}
                                  {stop.location && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} />{stop.location}</span>}
                                </div>
                              </div>
                            </div>
                            {stop.cost && parseFloat(stop.cost) > 0 && (
                              <span className="text-emerald-400 text-sm font-semibold flex-shrink-0">${stop.cost}</span>
                            )}
                          </div>
                          {stop.notes && <p className="text-slate-400 text-sm mt-2 italic">{stop.notes}</p>}
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-6">
          {days.map((day, di) => (
            <motion.div key={day.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: di * 0.06 }} className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                  {di + 1}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{day.title}</h3>
                  <p className="text-slate-400 text-sm">{day.date}</p>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {day.stops.map(stop => {
                  const Icon = TYPE_ICONS[stop.type] || MapPin
                  const style = TYPE_STYLES[stop.type] || TYPE_STYLES.other
                  return (
                    <div key={stop.id} className="p-4 flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                        <Icon size={15} className={style.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{stop.title}</p>
                        <p className="text-slate-500 text-xs">{stop.location}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {stop.time && <p className="text-slate-400 text-xs">{stop.time}</p>}
                        {stop.cost && parseFloat(stop.cost) > 0 && <p className="text-emerald-400 text-xs font-semibold">${stop.cost}</p>}
                      </div>
                    </div>
                  )
                })}
                {day.stops.length === 0 && <div className="p-4 text-slate-600 text-sm text-center">No stops</div>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="glass-card p-8 text-center">
          <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">Calendar view — connect to your Google Calendar for full integration</p>
          <div className="grid grid-cols-7 gap-2 mt-8 text-center text-xs text-slate-500">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="font-semibold py-1">{d}</div>)}
            {days.map((day, i) => (
              <motion.div key={day.id} whileHover={{ scale: 1.05 }}
                onClick={() => { setViewMode('timeline'); setActiveDay(i) }}
                className="glass-card p-2 cursor-pointer hover:border-violet-500/30 col-start-auto">
                <p className="font-bold text-white">{new Date(day.date).getDate()}</p>
                <p className="text-violet-400 text-xs">{day.stops.length}✓</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
