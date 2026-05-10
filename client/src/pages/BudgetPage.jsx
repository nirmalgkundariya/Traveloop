import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Wallet, AlertTriangle, TrendingUp, Plus, Trash2, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import toast from 'react-hot-toast'

const BUDGET_CATEGORIES = [
  { id: 'hotel', label: 'Accommodation', emoji: '🏨', color: '#8b5cf6', budget: 840, spent: 720 },
  { id: 'transport', label: 'Transport', emoji: '✈️', color: '#38bdf8', budget: 650, spent: 680 },
  { id: 'food', label: 'Food & Dining', emoji: '🍽️', color: '#f59e0b', budget: 480, spent: 320 },
  { id: 'activities', label: 'Activities', emoji: '🎯', color: '#10b981', budget: 350, spent: 210 },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#ec4899', budget: 200, spent: 340 },
  { id: 'misc', label: 'Miscellaneous', emoji: '📦', color: '#6366f1', budget: 180, spent: 95 },
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'INR', symbol: '₹', rate: 83.1 },
  { code: 'JPY', symbol: '¥', rate: 148.5 },
  { code: 'AUD', symbol: 'A$', rate: 1.53 },
]

const DAILY_DATA = [
  { day: 'Day 1', budget: 380, spent: 290 },
  { day: 'Day 2', budget: 320, spent: 415 },
  { day: 'Day 3', budget: 350, spent: 280 },
  { day: 'Day 4', budget: 400, spent: 355 },
  { day: 'Day 5', budget: 250, spent: 225 },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-3 text-sm">
      <p className="text-white font-semibold">{payload[0]?.name}</p>
      <p style={{ color: payload[0]?.payload?.color || '#8b5cf6' }}>
        ${payload[0]?.value?.toFixed(0)}
      </p>
    </div>
  )
}

export default function BudgetPage() {
  const { id } = useParams()
  const [currency, setCurrency] = useState('USD')
  const [totalBudget] = useState(2700)
  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'Flight tickets', category: 'transport', amount: 680, date: '2024-06-01' },
    { id: 2, desc: 'Hotel (5 nights)', category: 'hotel', amount: 720, date: '2024-06-01' },
    { id: 3, desc: 'Seafood dinner', category: 'food', amount: 60, date: '2024-06-01' },
    { id: 4, desc: 'Souvenirs', category: 'shopping', amount: 120, date: '2024-06-02' },
    { id: 5, desc: 'Temple tours', category: 'activities', amount: 85, date: '2024-06-02' },
  ])
  const [newExpense, setNewExpense] = useState({ desc: '', category: 'food', amount: '' })
  const [showAdd, setShowAdd] = useState(false)

  const curr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  const convert = (usd) => (usd * curr.rate).toFixed(curr.code === 'JPY' ? 0 : 2)

  const totalSpent = BUDGET_CATEGORIES.reduce((s, c) => s + c.spent, 0)
  const remaining = totalBudget - totalSpent
  const overBudget = remaining < 0
  const pct = Math.min((totalSpent / totalBudget) * 100, 100)

  const pieData = BUDGET_CATEGORIES.map(c => ({ name: c.label, value: c.spent, color: c.color }))

  const addExpense = () => {
    if (!newExpense.desc || !newExpense.amount) return toast.error('Fill all fields')
    setExpenses(prev => [...prev, { ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount), date: new Date().toISOString().split('T')[0] }])
    setNewExpense({ desc: '', category: 'food', amount: '' })
    setShowAdd(false)
    toast.success('Expense added!')
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Budget Tracker</h1>
          <p className="text-slate-400">Track and manage your travel spending</p>
        </div>
        <div className="flex gap-3">
          <select className="input-glass text-sm py-2 w-auto"
            value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
          </select>
          <button onClick={() => setShowAdd(s => !s)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Add Expense
          </button>
        </div>
      </motion.div>

      {/* Add expense form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">New Expense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input className="input-glass col-span-1 sm:col-span-2" placeholder="Description *"
              value={newExpense.desc} onChange={e => setNewExpense(p => ({ ...p, desc: e.target.value }))} />
            <select className="input-glass"
              value={newExpense.category} onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))}>
              {BUDGET_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
            <input type="number" className="input-glass" placeholder="Amount (USD) *"
              value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={addExpense} className="btn-primary text-sm flex items-center gap-2">
              <Plus size={14} /> Add
            </button>
          </div>
        </motion.div>
      )}

      {/* Budget overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: convert(totalBudget), icon: Wallet, color: 'violet' },
          { label: 'Total Spent', value: convert(totalSpent), icon: TrendingUp, color: overBudget ? 'red' : 'sky' },
          { label: overBudget ? 'Over Budget' : 'Remaining', value: convert(Math.abs(remaining)), icon: overBudget ? AlertTriangle : DollarSign, color: overBudget ? 'red' : 'green' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                s.color === 'violet' ? 'bg-violet-500/15 text-violet-400' :
                s.color === 'sky' ? 'bg-sky-500/15 text-sky-400' :
                s.color === 'green' ? 'bg-emerald-500/15 text-emerald-400' :
                'bg-red-500/15 text-red-400'
              }`}>
                <s.icon size={18} />
              </div>
              <span className="text-slate-400 text-sm">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{curr.symbol}{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main budget bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Overall Budget Usage</span>
          <span className={`font-bold text-lg ${overBudget ? 'text-red-400' : 'text-emerald-400'}`}>
            {pct.toFixed(1)}%
          </span>
        </div>
        <div className="progress-bar h-4 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: overBudget ? 'linear-gradient(90deg,#ef4444,#dc2626)' : 'linear-gradient(90deg,#8b5cf6,#38bdf8)' }}
          />
        </div>
        {overBudget && (
          <p className="text-red-400 text-sm flex items-center gap-1.5 mt-2">
            <AlertTriangle size={14} /> You're over budget by {curr.symbol}{convert(Math.abs(remaining))}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }} className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily bar chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Daily Budget vs Spent</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_DATA} barGap={4}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" name="Budget" fill="rgba(139,92,246,0.4)" radius={[4,4,0,0]} />
              <Bar dataKey="spent" name="Spent" fill="#8b5cf6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }} className="glass-card p-6">
        <h3 className="font-semibold text-white mb-5">Category Breakdown</h3>
        <div className="space-y-4">
          {BUDGET_CATEGORIES.map((cat, i) => {
            const pct = Math.min((cat.spent / cat.budget) * 100, 100)
            const over = cat.spent > cat.budget
            return (
              <motion.div key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span className="text-white text-sm font-medium">{cat.label}</span>
                    {over && <span className="badge badge-red text-xs">Over!</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span style={{ color: cat.color }} className="font-semibold">{curr.symbol}{convert(cat.spent)}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">{curr.symbol}{convert(cat.budget)}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    className="h-full rounded-full"
                    style={{ background: over ? '#ef4444' : cat.color }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Expense list */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h3 className="font-semibold text-white">Recent Expenses</h3>
        </div>
        <div className="divide-y divide-white/5">
          {expenses.map((exp, i) => {
            const cat = BUDGET_CATEGORIES.find(c => c.id === exp.category)
            return (
              <motion.div key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <span className="text-xl">{cat?.emoji || '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{exp.desc}</p>
                  <p className="text-slate-500 text-xs">{exp.date} · {cat?.label}</p>
                </div>
                <span className="text-white font-semibold">{curr.symbol}{convert(exp.amount)}</span>
                <button onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))}
                  className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
