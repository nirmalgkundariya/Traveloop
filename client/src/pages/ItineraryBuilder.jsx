import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Plus, GripVertical, Trash2, Edit3, Clock, MapPin, Hotel, Car, Utensils, Star, ChevronDown, ChevronRight, Save, Eye } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const ACTIVITY_ICONS = {
  hotel: Hotel, transport: Car, food: Utensils, sightseeing: Star, activity: Star, other: MapPin
}

const DAY_COLORS = [
  'from-violet-500/20 to-violet-500/5',
  'from-sky-500/20 to-sky-500/5',
  'from-emerald-500/20 to-emerald-500/5',
  'from-amber-500/20 to-amber-500/5',
  'from-pink-500/20 to-pink-500/5',
  'from-cyan-500/20 to-cyan-500/5',
]

function StopItem({ stop, onDelete, onEdit }) {
  const Icon = ACTIVITY_ICONS[stop.type] || MapPin
  return (
    <motion.div layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/30 group transition-all">
      <div className="mt-0.5 text-slate-600 cursor-grab active:cursor-grabbing">
        <GripVertical size={16} />
      </div>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
        stop.type === 'hotel' ? 'bg-violet-500/20 text-violet-400' :
        stop.type === 'transport' ? 'bg-sky-500/20 text-sky-400' :
        stop.type === 'food' ? 'bg-amber-500/20 text-amber-400' :
        'bg-emerald-500/20 text-emerald-400'
      }`}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{stop.title}</p>
        {stop.location && <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><MapPin size={10} />{stop.location}</p>}
        {stop.time && <p className="text-slate-500 text-xs flex items-center gap-1"><Clock size={10} />{stop.time}</p>}
        {stop.notes && <p className="text-slate-600 text-xs mt-1 italic">{stop.notes}</p>}
        {stop.cost && <p className="text-emerald-400 text-xs mt-0.5">${stop.cost}</p>}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(stop)} className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors">
          <Edit3 size={13} />
        </button>
        <button onClick={() => onDelete(stop.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  )
}

function AddStopModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ title: '', type: 'sightseeing', time: '', location: '', notes: '', cost: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title) return toast.error('Add a title')
    onAdd({ ...form, id: Date.now().toString() })
    onClose()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-4">Add Stop</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-glass" placeholder="Stop title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <select className="input-glass" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="sightseeing">Sightseeing</option>
              <option value="food">Food & Drink</option>
              <option value="hotel">Accommodation</option>
              <option value="transport">Transport</option>
              <option value="activity">Activity</option>
              <option value="other">Other</option>
            </select>
            <input type="time" className="input-glass" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <input className="input-glass" placeholder="Location (optional)" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <input type="number" className="input-glass" placeholder="Cost (USD, optional)" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} />
          <textarea className="input-glass resize-none" rows={2} placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Stop</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ItineraryBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [days, setDays] = useState([])
  const [expandedDay, setExpandedDay] = useState(0)
  const [showAddStop, setShowAddStop] = useState(null) // day index
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItinerary()
  }, [id])

  const fetchItinerary = async () => {
    try {
      const res = await api.get(`/trips/${id}`)
      setTrip(res.data.trip)
      if (res.data.trip.itinerary?.days) {
        setDays(res.data.trip.itinerary.days)
      } else {
        // Generate days from trip dates
        const start = new Date(res.data.trip.startDate || Date.now())
        const end = new Date(res.data.trip.endDate || Date.now())
        const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
        setDays(Array.from({ length: dayCount }, (_, i) => ({
          id: i + 1,
          date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          title: `Day ${i + 1}`,
          stops: [],
        })))
      }
    } catch {
      // Demo mode
      setTrip({ name: 'Demo Trip', destination: 'Bali, Indonesia' })
      setDays([
        { id: 1, date: '2024-06-01', title: 'Day 1 - Arrival', stops: [
          { id: '1', type: 'transport', title: 'Flight to Bali', time: '10:00', location: 'Ngurah Rai Airport', cost: '0' },
          { id: '2', type: 'hotel', title: 'Check-in Four Seasons', time: '15:00', location: 'Jimbaran Bay', cost: '250' },
          { id: '3', type: 'food', title: 'Seafood dinner', time: '19:00', location: 'Jimbaran Beach', cost: '40' },
        ]},
        { id: 2, date: '2024-06-02', title: 'Day 2 - Ubud', stops: [
          { id: '4', type: 'sightseeing', title: 'Tegalalang Rice Terraces', time: '09:00', location: 'Ubud', cost: '5' },
          { id: '5', type: 'activity', title: 'Cooking class', time: '14:00', location: 'Ubud Center', cost: '45' },
        ]},
        { id: 3, date: '2024-06-03', title: 'Day 3 - Temples', stops: [] },
      ])
    }
  }

  const addStop = (dayIdx, stop) => {
    setDays(prev => prev.map((d, i) => i === dayIdx ? { ...d, stops: [...d.stops, stop] } : d))
  }

  const deleteStop = (dayIdx, stopId) => {
    setDays(prev => prev.map((d, i) => i === dayIdx ? { ...d, stops: d.stops.filter(s => s.id !== stopId) } : d))
  }

  const addDay = () => {
    const lastDay = days[days.length - 1]
    const newDate = lastDay
      ? new Date(new Date(lastDay.date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    setDays(prev => [...prev, { id: Date.now(), date: newDate, title: `Day ${prev.length + 1}`, stops: [] }])
    setExpandedDay(days.length)
  }

  const saveItinerary = async () => {
    setSaving(true)
    try {
      await api.put(`/trips/${id}/itinerary`, { days })
      toast.success('Itinerary saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const totalCost = days.flatMap(d => d.stops).reduce((sum, s) => sum + (parseFloat(s.cost) || 0), 0)

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Itinerary Builder</h1>
          <p className="text-slate-400">{trip?.name || 'Loading...'} · {trip?.destination}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/trips/${id}/view`)} className="btn-secondary flex items-center gap-2">
            <Eye size={16} /> Preview
          </button>
          <button onClick={saveItinerary} disabled={saving} className="btn-primary flex items-center gap-2">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Days', value: days.length },
          { label: 'Stops', value: days.flatMap(d => d.stops).length },
          { label: 'Est. Cost', value: `$${totalCost.toFixed(0)}` },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-slate-400 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Days */}
      <div className="space-y-4">
        {days.map((day, dayIdx) => (
          <motion.div key={day.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.05 }}
            className="glass-card overflow-hidden">
            {/* Day header */}
            <button
              onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
              className={`w-full flex items-center gap-4 p-5 bg-gradient-to-r ${DAY_COLORS[dayIdx % DAY_COLORS.length]} hover:bg-white/5 transition-all`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold flex-shrink-0">
                {dayIdx + 1}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h3 className="text-white font-semibold">{day.title}</h3>
                <p className="text-slate-400 text-sm">{day.date} · {day.stops.length} stop{day.stops.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                {day.stops.length > 0 && (
                  <span className="text-sm text-slate-400">
                    ${day.stops.reduce((s, stop) => s + (parseFloat(stop.cost) || 0), 0).toFixed(0)}
                  </span>
                )}
                {expandedDay === dayIdx ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
              </div>
            </button>

            {/* Day content */}
            <AnimatePresence>
              {expandedDay === dayIdx && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden">
                  <div className="p-5 pt-0 space-y-2">
                    {day.stops.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No stops added yet</p>
                      </div>
                    ) : (
                      <Reorder.Group axis="y" values={day.stops}
                        onReorder={(newStops) => setDays(prev => prev.map((d, i) => i === dayIdx ? { ...d, stops: newStops } : d))}
                        className="space-y-2">
                        {day.stops.map(stop => (
                          <Reorder.Item key={stop.id} value={stop}>
                            <StopItem stop={stop}
                              onDelete={(sid) => deleteStop(dayIdx, sid)}
                              onEdit={() => {}} />
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                    <button
                      onClick={() => setShowAddStop(dayIdx)}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-violet-400 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-sm mt-2">
                      <Plus size={16} /> Add Stop
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Add day button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={addDay}
          className="w-full p-5 glass-card border-dashed flex items-center justify-center gap-3 text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all">
          <Plus size={20} /> Add Day
        </motion.button>
      </div>

      {/* Add stop modal */}
      <AnimatePresence>
        {showAddStop !== null && (
          <AddStopModal
            onAdd={(stop) => { addStop(showAddStop, stop); setShowAddStop(null) }}
            onClose={() => setShowAddStop(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
