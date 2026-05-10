import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Heart, Share2, Copy, MessageCircle, Star, Clock, Hotel, Car, Utensils, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO_SHARED = {
  title: 'Ultimate Bali Adventure',
  destination: 'Bali, Indonesia',
  author: { name: 'Sofia Chen', avatar: null, trips: 24 },
  startDate: '2024-06-01',
  endDate: '2024-06-05',
  travelersCount: 2,
  likes: 347,
  saves: 89,
  description: 'A perfect 5-day Bali itinerary covering temples, rice terraces, beaches and incredible food. We planned this after 3 trips and it hits all the highlights without feeling rushed.',
  tags: ['Beach', 'Culture', 'Food', 'Adventure', 'Budget-Friendly'],
  days: [
    { title: 'Day 1 — Arrival & Jimbaran', stops: [
      { type: 'transport', title: 'Arrive Ngurah Rai Airport', time: '13:00' },
      { type: 'hotel', title: 'Check-in — The Mulia Resort', time: '15:00', location: 'Nusa Dua' },
      { type: 'food', title: 'Sunset Seafood at Jimbaran Beach', time: '18:30', cost: '$40/pp' },
    ]},
    { title: 'Day 2 — Ubud & Culture', stops: [
      { type: 'sightseeing', title: 'Tegalalang Rice Terraces', time: '09:00', location: 'Ubud', cost: '$5' },
      { type: 'food', title: 'Locavore — Fine Dining Lunch', time: '13:00', cost: '$75/pp' },
      { type: 'activity', title: 'Traditional Cooking Class', time: '15:00', cost: '$45/pp' },
      { type: 'sightseeing', title: 'Ubud Palace at Sunset', time: '18:00' },
    ]},
    { title: 'Day 3 — Temple Trail', stops: [
      { type: 'sightseeing', title: 'Tanah Lot Temple', time: '07:00', cost: '$5' },
      { type: 'food', title: 'Local Warung Lunch', time: '12:00', cost: '$8/pp' },
      { type: 'sightseeing', title: 'Uluwatu Cliff Temple', time: '16:00', cost: '$5' },
      { type: 'activity', title: 'Kecak Fire Dance', time: '18:00', cost: '$15/pp' },
    ]},
  ],
  comments: [
    { id: 1, user: 'Alex M.', avatar: null, text: 'This itinerary was perfect! The Kecak dance at sunset was absolutely magical.', time: '2 days ago', likes: 12 },
    { id: 2, user: 'Priya S.', avatar: null, text: 'We followed this for our honeymoon. Couldn\'t recommend it more — every restaurant was fantastic!', time: '1 week ago', likes: 28 },
    { id: 3, user: 'James K.', avatar: null, text: 'The Locavore booking is essential, make a reservation weeks ahead. Worth every penny!', time: '2 weeks ago', likes: 19 },
  ]
}

const TYPE_COLORS = {
  hotel: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  transport: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  food: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  sightseeing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  activity: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}
const TYPE_ICONS = { hotel: Hotel, transport: Car, food: Utensils, sightseeing: Star, activity: Star }

export default function SharedItinerary() {
  const { shareId } = useParams()
  const [trip] = useState(DEMO_SHARED)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(DEMO_SHARED.comments)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    } catch { toast.error('Could not copy') }
  }

  const postComment = () => {
    if (!comment.trim()) return
    setComments(prev => [{
      id: Date.now(), user: 'You', avatar: null, text: comment, time: 'Just now', likes: 0
    }, ...prev])
    setComment('')
    toast.success('Comment posted!')
  }

  return (
    <div className="min-h-screen" style={{ background: '#060d22' }}>
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a237e 0%, #0d1b4b 50%, #4a1572 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center text-[12rem] opacity-10 select-none">🌴</div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#060d22] to-transparent" />

        {/* Branding */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-white font-bold">TraveLoop</span>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {trip.tags.map(t => <span key={t} className="badge badge-violet text-xs">{t}</span>)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-violet-400" />{trip.destination}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} className="text-sky-400" />{trip.startDate} – {trip.endDate}</span>
              <span className="flex items-center gap-1.5"><Users size={13} />{trip.travelersCount} travelers</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Author + actions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
              {trip.author.name[0]}
            </div>
            <div>
              <p className="text-white font-semibold">{trip.author.name}</p>
              <p className="text-slate-400 text-sm">{trip.author.trips} trips planned</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setLiked(l => !l)}
              className={`btn-secondary flex items-center gap-2 text-sm ${liked ? 'border-red-500/40 text-red-400' : ''}`}>
              <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              {trip.likes + (liked ? 1 : 0)}
            </button>
            <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm">
              <Share2 size={15} /> Share
            </button>
            <button onClick={() => { setSaved(s => !s); toast.success(saved ? 'Removed from saves' : 'Saved!') }}
              className={`btn-primary flex items-center gap-2 text-sm ${saved ? 'opacity-80' : ''}`}>
              <Copy size={15} /> {saved ? 'Saved' : 'Save Trip'}
            </button>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card p-6">
          <p className="text-slate-300 leading-relaxed">{trip.description}</p>
        </motion.div>

        {/* Itinerary days */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Itinerary</h2>
          {trip.days.map((day, di) => (
            <motion.div key={di}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: di * 0.1 }}
              className="glass-card overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center gap-4"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(56,189,248,0.05))' }}>
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
                  {di + 1}
                </div>
                <h3 className="text-white font-semibold text-lg">{day.title}</h3>
              </div>
              <div className="p-5 space-y-3">
                {day.stops.map((stop, si) => {
                  const style = TYPE_COLORS[stop.type] || TYPE_COLORS.sightseeing
                  const Icon = TYPE_ICONS[stop.type] || Star
                  return (
                    <div key={si} className={`flex items-center gap-4 p-3 rounded-xl border ${style}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{stop.title}</p>
                        <div className="flex gap-3 mt-0.5">
                          {stop.time && <span className="text-slate-500 text-xs flex items-center gap-0.5"><Clock size={10} />{stop.time}</span>}
                          {stop.location && <span className="text-slate-500 text-xs flex items-center gap-0.5"><MapPin size={10} />{stop.location}</span>}
                        </div>
                      </div>
                      {stop.cost && <span className="text-emerald-400 text-xs font-semibold flex-shrink-0">{stop.cost}</span>}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageCircle size={22} className="text-violet-400" /> Comments ({comments.length})
          </h2>

          {/* Add comment */}
          <div className="glass-card p-4 flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm flex-shrink-0">Y</div>
            <div className="flex-1">
              <textarea className="input-glass resize-none text-sm" rows={2}
                placeholder="Share your thoughts or tips..."
                value={comment} onChange={e => setComment(e.target.value)} />
              <div className="flex justify-end mt-2">
                <button onClick={postComment} className="btn-primary text-sm py-2 px-4">Post</button>
              </div>
            </div>
          </div>

          {/* Comment list */}
          <div className="space-y-3">
            {comments.map((c, i) => (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-4 flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm flex-shrink-0">
                  {c.user[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-semibold">{c.user}</span>
                    <span className="text-slate-600 text-xs">{c.time}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{c.text}</p>
                  <button className="text-slate-500 text-xs mt-2 flex items-center gap-1 hover:text-violet-400 transition-colors">
                    <Heart size={11} /> {c.likes} likes
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
