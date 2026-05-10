import { motion } from 'framer-motion'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#060d22' }}>
      {/* Background orbs */}
      <div className="orb-violet w-96 h-96 -top-32 -left-32" />
      <div className="orb-sky w-96 h-96 -bottom-32 -right-32" />
      <div className="orb-violet w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.08 }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="particle"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#8b5cf6' : '#38bdf8',
            animationDuration: `${Math.random() * 20 + 15}s`,
            animationDelay: `${Math.random() * 10}s`,
          }} />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}
