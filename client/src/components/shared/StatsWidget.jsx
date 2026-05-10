import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatsWidget({ title, value, change, icon: Icon, color = 'violet', prefix = '', suffix = '', index = 0 }) {
  const colorMap = {
    violet: { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', text: '#a78bfa' },
    sky: { bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.3)', text: '#38bdf8' },
    green: { bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.3)', text: '#34d399' },
    amber: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
    red: { bg: 'rgba(248, 113, 113, 0.15)', border: 'rgba(248, 113, 113, 0.3)', text: '#f87171' },
  }

  const c = colorMap[color] || colorMap.violet

  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus
  const trendColor = change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-slate-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="stat-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon size={20} style={{ color: c.text }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      <div className="text-sm text-slate-400 mt-0.5">{title}</div>
    </motion.div>
  )
}
