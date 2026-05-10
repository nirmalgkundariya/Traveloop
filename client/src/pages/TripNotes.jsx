import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Plus, Trash2, Pin, Search, Calendar, Image, Mic, Clock, Tag, X, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO_NOTES = [
  {
    id: 1, title: 'First impressions of Bali', content: 'Landed in Bali around 1pm. The heat hit me immediately as I stepped out of the airport. The taxi driver was incredibly friendly and gave us tips about avoiding tourist traps in Kuta. Definitely heading straight to Ubud tomorrow.',
    day: 1, date: '2024-06-01', pinned: true, tag: 'journal', mood: '😍'
  },
  {
    id: 2, title: 'Tegalalang Rice Terraces', content: 'Woke up at 7am to beat the crowds. The rice terraces were genuinely breathtaking — photos absolutely do not do it justice. The light in the early morning was perfect. Had the best Nasi Goreng for breakfast at a small warung overlooking the terraces.',
    day: 2, date: '2024-06-02', pinned: false, tag: 'highlight', mood: '🌟'
  },
  {
    id: 3, title: 'Reminder: Book Kecak dance tickets', content: 'Need to book Kecak fire dance tickets for tonight at Uluwatu. The show starts at 6pm. Recommended to arrive 45 mins early for good seats facing the sunset.',
    day: 2, date: '2024-06-02', pinned: true, tag: 'reminder', mood: '📝'
  },
  {
    id: 4, title: 'Locavore restaurant review', content: 'Incredible dining experience. The 7-course tasting menu was worth every penny. Chef Eelke Plasmeijer came to our table personally. The jackfruit dessert was mind-blowing. Must book 2 weeks in advance!',
    day: 2, date: '2024-06-02', pinned: false, tag: 'food', mood: '🍽️'
  },
]

const TAGS = ['all', 'journal', 'highlight', 'reminder', 'food', 'tips', 'other']
const TAG_COLORS = {
  journal: 'badge-violet',
  highlight: 'badge-amber',
  reminder: 'badge-sky',
  food: 'badge-green',
  tips: 'badge-red',
  other: 'badge',
}

const MOODS = ['😍', '😊', '😐', '😢', '😮', '🌟', '📝', '🍽️', '🏔️', '🌊']

function NoteCard({ note, onDelete, onPin, onEdit }) {
  return (
    <motion.div layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card-hover p-5 cursor-pointer group ${note.pinned ? 'border-violet-500/30' : ''}`}
      onClick={() => onEdit(note)}>
      {note.pinned && (
        <div className="flex items-center gap-1 text-violet-400 text-xs font-medium mb-2">
          <Pin size={10} /> Pinned
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-white font-semibold text-sm leading-snug">{note.title}</h3>
        <span className="text-2xl flex-shrink-0">{note.mood}</span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{note.content}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className={`badge ${TAG_COLORS[note.tag] || 'badge'} text-xs`}>{note.tag}</span>
          <span className="text-slate-600 text-xs flex items-center gap-1"><Calendar size={10} />{note.date}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onPin(note.id) }}
            className={`p-1.5 rounded-lg transition-colors ${note.pinned ? 'text-violet-400' : 'text-slate-600 hover:text-violet-400'} hover:bg-violet-500/10`}>
            <Pin size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState(note || { title: '', content: '', day: 1, tag: 'journal', mood: '😊' })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="glass-card p-6 w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{note ? 'Edit Note' : 'New Note'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <input className="input-glass font-semibold" placeholder="Note title..."
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

          {/* Mood picker */}
          <div>
            <p className="text-xs text-slate-500 mb-1.5">Mood</p>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button key={m} onClick={() => setForm(f => ({ ...f, mood: m }))}
                  className={`text-xl p-1.5 rounded-lg transition-all ${form.mood === m ? 'bg-violet-500/20 ring-1 ring-violet-500' : 'hover:bg-white/5'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Tag</p>
              <select className="input-glass text-sm"
                value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                {TAGS.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Day</p>
              <input type="number" min={1} className="input-glass text-sm"
                value={form.day} onChange={e => setForm(f => ({ ...f, day: +e.target.value }))} />
            </div>
          </div>

          <textarea className="input-glass resize-none leading-relaxed" rows={8}
            placeholder="Write your thoughts, tips, memories..."
            value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => { onSave({ ...form, id: form.id || Date.now(), date: new Date().toISOString().split('T')[0] }); onClose() }}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Edit3 size={14} /> Save Note
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TripNotes() {
  const { id } = useParams()
  const [notes, setNotes] = useState(DEMO_NOTES)
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('all')
  const [editNote, setEditNote] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filtered = notes
    .filter(n => tag === 'all' || n.tag === tag)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  const saveNote = (note) => {
    setNotes(prev => {
      const exists = prev.find(n => n.id === note.id)
      return exists ? prev.map(n => n.id === note.id ? note : n) : [note, ...prev]
    })
    toast.success(note.id && notes.find(n => n.id === note.id) ? 'Note updated!' : 'Note saved!')
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    toast.success('Note deleted')
  }

  const togglePin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Trip Journal</h1>
          <p className="text-slate-400">{notes.length} notes · {notes.filter(n => n.pinned).length} pinned</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Mic size={15} /> Voice Note
          </button>
          <button onClick={() => { setEditNote(null); setShowModal(true) }}
            className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> New Note
          </button>
        </div>
      </motion.div>

      {/* Search & filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-glass pl-11" placeholder="Search notes..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${
                tag === t ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}>{t}</button>
          ))}
        </div>
      </motion.div>

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-6xl mb-4">📔</div>
          <h3 className="text-xl font-bold text-white mb-2">No notes yet</h3>
          <p className="text-slate-400 mb-6">Start journaling your travel memories</p>
          <button onClick={() => { setEditNote(null); setShowModal(true) }} className="btn-primary flex items-center gap-2 mx-auto">
            <Plus size={16} /> Write First Note
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((note, i) => (
              <NoteCard key={note.id} note={note}
                onDelete={deleteNote}
                onPin={togglePin}
                onEdit={(n) => { setEditNote(n); setShowModal(true) }} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Note modal */}
      <AnimatePresence>
        {showModal && (
          <NoteModal
            note={editNote}
            onClose={() => { setShowModal(false); setEditNote(null) }}
            onSave={saveNote}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
