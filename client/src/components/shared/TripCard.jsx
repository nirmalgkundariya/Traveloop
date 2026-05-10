import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Wallet, MoreVertical, Heart, Star } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_COLORS = {
  planning: 'badge-violet',
  active: 'badge-green',
  completed: 'badge-sky',
  archived: 'badge-amber',
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

export default function TripCard({ trip, onDelete, onDuplicate, index = 0 }) {
  const navigate = useNavigate()
  const gradient = COVER_GRADIENTS[index % COVER_GRADIENTS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="trip-card group"
      onClick={() => navigate(`/trips/${trip.id}/view`)}
    >
      {/* Cover image */}
      <div className="h-40 relative overflow-hidden rounded-t-2xl">
        {trip.coverImage ? (
          <img src={trip.coverImage} alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            style={{ background: gradient }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${STATUS_COLORS[trip.status] || 'badge-violet'}`}>
            {trip.status || 'planning'}
          </span>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.stopPropagation() }}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/30 text-white/70 hover:text-red-400 transition-colors"
        >
          <Heart size={14} />
        </button>

        {/* Bottom info overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-base leading-tight">{trip.name}</h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Destination */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <MapPin size={14} className="text-violet-400 flex-shrink-0" />
          <span className="truncate">{trip.destination || 'No destination set'}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar size={14} className="text-sky-400 flex-shrink-0" />
          <span>
            {trip.startDate
              ? `${format(new Date(trip.startDate), 'MMM d')} – ${trip.endDate ? format(new Date(trip.endDate), 'MMM d, yyyy') : '...'}`
              : 'Dates not set'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Travelers & Budget */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Users size={13} />
              <span>{trip.travelersCount || 1}</span>
            </div>
            {trip.budget && (
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Wallet size={13} />
                <span>${trip.budget?.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <button
            onClick={(e) => { e.stopPropagation() }}
            className="p-1.5 text-slate-600 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Progress bar */}
        {trip.progress !== undefined && (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Planning progress</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${trip.progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
