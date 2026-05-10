import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Trash2, Search, RotateCcw, Package, Shirt, Smartphone, FileText, Pill, Gem } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Package },
  { id: 'clothes', label: 'Clothes', icon: Shirt },
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'medicines', label: 'Medicines', icon: Pill },
  { id: 'accessories', label: 'Accessories', icon: Gem },
]

const DEFAULT_ITEMS = [
  { id: 1, name: 'Passport', category: 'documents', qty: 1, packed: true, essential: true },
  { id: 2, name: 'Travel Insurance', category: 'documents', qty: 1, packed: true, essential: true },
  { id: 3, name: 'Phone + Charger', category: 'electronics', qty: 1, packed: false, essential: true },
  { id: 4, name: 'Power Bank', category: 'electronics', qty: 1, packed: false, essential: false },
  { id: 5, name: 'Camera', category: 'electronics', qty: 1, packed: false, essential: false },
  { id: 6, name: 'T-Shirts', category: 'clothes', qty: 5, packed: true, essential: true },
  { id: 7, name: 'Shorts / Pants', category: 'clothes', qty: 3, packed: false, essential: true },
  { id: 8, name: 'Swimwear', category: 'clothes', qty: 2, packed: false, essential: false },
  { id: 9, name: 'Sunscreen SPF 50', category: 'medicines', qty: 1, packed: true, essential: true },
  { id: 10, name: 'Ibuprofen', category: 'medicines', qty: 1, packed: false, essential: true },
  { id: 11, name: 'Sunglasses', category: 'accessories', qty: 1, packed: true, essential: false },
  { id: 12, name: 'Travel Adapter', category: 'accessories', qty: 1, packed: false, essential: true },
]

const TEMPLATES = [
  { name: 'Beach Trip', emoji: '🏖️', items: ['Swimwear', 'Sunscreen', 'Beach Towel', 'Flip Flops', 'Sunglasses'] },
  { name: 'Business Travel', emoji: '💼', items: ['Formal Shirts', 'Laptop', 'Business Cards', 'Blazer', 'Dress Shoes'] },
  { name: 'Backpacking', emoji: '🎒', items: ['Backpack', 'Sleeping Bag', 'Tent', 'Water Bottle', 'First Aid Kit'] },
]

const CAT_COLORS = {
  clothes: 'text-violet-400 bg-violet-500/15',
  electronics: 'text-sky-400 bg-sky-500/15',
  documents: 'text-amber-400 bg-amber-500/15',
  medicines: 'text-red-400 bg-red-500/15',
  accessories: 'text-emerald-400 bg-emerald-500/15',
}

export default function PackingList() {
  const [items, setItems] = useState(DEFAULT_ITEMS)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [newItem, setNewItem] = useState({ name: '', category: 'clothes', qty: 1 })
  const [showAdd, setShowAdd] = useState(false)

  const filtered = items.filter(i => {
    const matchC = category === 'all' || i.category === category
    const matchS = !search || i.name.toLowerCase().includes(search.toLowerCase())
    return matchC && matchS
  })

  const packedCount = items.filter(i => i.packed).length
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0

  const togglePacked = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, packed: !i.packed } : i))
  }

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Item removed')
  }

  const addItem = () => {
    if (!newItem.name.trim()) return toast.error('Enter item name')
    setItems(prev => [...prev, { ...newItem, id: Date.now(), packed: false, essential: false }])
    setNewItem({ name: '', category: 'clothes', qty: 1 })
    setShowAdd(false)
    toast.success('Item added!')
  }

  const resetAll = () => {
    setItems(prev => prev.map(i => ({ ...i, packed: false })))
    toast.success('Checklist reset')
  }

  const addTemplate = (template) => {
    const newItems = template.items.map((name, i) => ({
      id: Date.now() + i, name, category: 'accessories', qty: 1, packed: false, essential: false
    }))
    setItems(prev => [...prev, ...newItems])
    toast.success(`${template.name} template added!`)
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Packing List</h1>
          <p className="text-slate-400">{packedCount} of {items.length} items packed</p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetAll} className="btn-secondary flex items-center gap-2 text-sm">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={() => setShowAdd(s => !s)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Add Item
          </button>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Packing Progress</span>
          <span className={`text-2xl font-bold ${progress === 100 ? 'text-emerald-400' : 'text-violet-400'}`}>
            {progress}%
          </span>
        </div>
        <div className="progress-bar h-3 mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: progress === 100 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#8b5cf6,#38bdf8)' }}
          />
        </div>
        {progress === 100 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-emerald-400 text-sm font-medium text-center">
            🎉 All packed! Ready for your trip!
          </motion.p>
        )}
      </motion.div>

      {/* Templates */}
      <div>
        <h3 className="text-white font-semibold mb-3">Quick Templates</h3>
        <div className="flex flex-wrap gap-3">
          {TEMPLATES.map(t => (
            <button key={t.name} onClick={() => addTemplate(t)}
              className="glass-card-hover px-4 py-2.5 text-sm flex items-center gap-2">
              <span>{t.emoji}</span>
              <span className="text-white font-medium">{t.name}</span>
              <Plus size={13} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Add item form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card p-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input className="input-glass col-span-1 sm:col-span-2" placeholder="Item name *"
                value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addItem()} />
              <select className="input-glass"
                value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <input type="number" min={1} max={99} className="input-glass" placeholder="Qty"
                value={newItem.qty} onChange={e => setNewItem(p => ({ ...p, qty: +e.target.value }))} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={addItem} className="btn-primary text-sm">Add Item</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-glass pl-11" placeholder="Search items..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                category === cat.id ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}>
              <cat.icon size={12} />
              {cat.label}
              <span className="ml-1 text-xs opacity-70">
                ({items.filter(i => (cat.id === 'all' || i.category === cat.id)).filter(i => i.packed).length}/
                {items.filter(i => cat.id === 'all' || i.category === cat.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card p-4 flex items-center gap-4 transition-all ${item.packed ? 'opacity-60' : ''}`}>
              {/* Checkbox */}
              <button onClick={() => togglePacked(item.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  item.packed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-violet-500'
                }`}>
                {item.packed && <Check size={13} className="text-white" strokeWidth={3} />}
              </button>

              {/* Category icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${CAT_COLORS[item.category] || 'bg-slate-500/15 text-slate-400'}`}>
                {(() => {
                  const cat = CATEGORIES.find(c => c.id === item.category)
                  return cat ? <cat.icon size={15} /> : <Package size={15} />
                })()}
              </div>

              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium transition-all ${item.packed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {item.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-500 text-xs capitalize">{item.category}</span>
                  {item.essential && <span className="badge badge-amber text-xs">Essential</span>}
                </div>
              </div>

              {/* Qty */}
              <div className="flex items-center gap-2 text-slate-400 text-sm flex-shrink-0">
                <span>×{item.qty}</span>
              </div>

              {/* Delete */}
              <button onClick={() => deleteItem(item.id)}
                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Package size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">No items found</p>
          </div>
        )}
      </div>
    </div>
  )
}
