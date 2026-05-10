import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#060d22' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}
        >
          <Sparkles size={28} className="text-white" />
        </motion.div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">TraveLoop</h1>
          <p className="text-slate-400 text-sm">Loading your travel world...</p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              className="w-2 h-2 rounded-full bg-violet-500"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
