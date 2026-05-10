import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Globe, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[0-9]/, 'One number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password?.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password || '') },
    { label: 'Number', pass: /[0-9]/.test(password || '') },
    { label: 'Special char', pass: /[^A-Za-z0-9]/.test(password || '') },
  ]
  const score = checks.filter(c => c.pass).length
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-400']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  if (!password) return null

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map((c, i) => (
          <span key={i} className={`text-xs flex items-center gap-1 ${c.pass ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CheckCircle2 size={10} /> {c.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function InputField({ label, icon: Icon, error, type = 'text', rightEl, ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative glow-focus rounded-xl">
        {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />}
        <input
          type={type}
          className={`input-glass ${Icon ? 'pl-10' : 'pl-4'} ${rightEl ? 'pr-10' : ''}`}
          {...rest}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

const DESTINATIONS = [
  { city: 'Santorini', country: 'Greece', emoji: '🏛️' },
  { city: 'Kyoto', country: 'Japan', emoji: '⛩️' },
  { city: 'Maldives', country: 'Indian Ocean', emoji: '🌊' },
  { city: 'Paris', country: 'France', emoji: '🗼' },
  { city: 'Bali', country: 'Indonesia', emoji: '🌴' },
]

export default function AuthPage() {
  const [mode, setMode] = useState('login') // login | signup | forgot
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [destIdx, setDestIdx] = useState(0)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  // Cycle destinations
  useState(() => {
    const t = setInterval(() => setDestIdx(i => (i + 1) % DESTINATIONS.length), 3000)
    return () => clearInterval(t)
  })

  const loginForm = useForm({ resolver: zodResolver(loginSchema) })
  const signupForm = useForm({ resolver: zodResolver(signupSchema) })

  const onLogin = async (data) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  const onSignup = async (data) => {
    try {
      await signup({ name: data.name, email: data.email, password: data.password })
      toast.success('Account created! Welcome to TraveLoop 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    }
  }

  const dest = DESTINATIONS[destIdx]

  return (
    <div className="min-h-screen flex">
      {/* Left panel — visual */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-16 overflow-hidden">
        {/* Animated gradient bg */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(56,189,248,0.1) 100%)' }} />

        {/* Large destination showcase */}
        <motion.div
          key={destIdx}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="text-8xl mb-6 filter drop-shadow-lg">{dest.emoji}</div>
          <h2 className="text-5xl font-bold text-white mb-2">{dest.city}</h2>
          <p className="text-slate-400 text-xl mb-8">{dest.country}</p>
        </motion.div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-3 mt-8">
          {['Smart itinerary planning', 'Real-time budget tracking', 'Collaborative trip sharing', 'AI destination suggestions'].map((feat, i) => (
            <motion.div key={feat}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="flex items-center gap-3 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={12} className="text-violet-400" />
              </div>
              {feat}
            </motion.div>
          ))}
        </div>

        {/* Floating mini cards */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-24 right-16 glass-card p-4 text-sm"
        >
          <p className="text-slate-400 text-xs">Active travelers</p>
          <p className="text-white font-bold text-lg">128,400+</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-24 left-16 glass-card p-4 text-sm"
        >
          <p className="text-slate-400 text-xs">Trips planned</p>
          <p className="text-white font-bold text-lg">842K+</p>
        </motion.div>

        {/* Destination dots */}
        <div className="absolute bottom-8 flex gap-2">
          {DESTINATIONS.map((_, i) => (
            <button key={i} onClick={() => setDestIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === destIdx ? 'w-8 bg-violet-500' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">TraveLoop</span>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
                <p className="text-slate-400 mb-8">Sign in to continue your journey</p>

                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <InputField label="Email" icon={Mail} type="email"
                    error={loginForm.formState.errors.email?.message}
                    placeholder="you@example.com"
                    {...loginForm.register('email')} />

                  <InputField label="Password" icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    error={loginForm.formState.errors.password?.message}
                    placeholder="••••••••"
                    rightEl={
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="text-slate-400 hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    {...loginForm.register('password')} />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setMode('forgot')}
                      className="text-violet-400 hover:text-violet-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                    {loginForm.formState.isSubmitting ? 'Signing in...' : (<>Sign In <ArrowRight size={16} /></>)}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="divider" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-sm text-slate-500"
                    style={{ background: '#060d22' }}>or</span>
                </div>

                <button className="btn-secondary w-full flex items-center justify-center gap-2 mb-6">
                  <Globe size={16} /> Continue with Google
                </button>

                <p className="text-center text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-violet-400 hover:text-violet-300 font-semibold">
                    Create one
                  </button>
                </p>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
                <p className="text-slate-400 mb-8">Start planning your perfect trips</p>

                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <InputField label="Full Name" icon={User}
                    error={signupForm.formState.errors.name?.message}
                    placeholder="John Doe"
                    {...signupForm.register('name')} />

                  <InputField label="Email" icon={Mail} type="email"
                    error={signupForm.formState.errors.email?.message}
                    placeholder="you@example.com"
                    {...signupForm.register('email')} />

                  <div>
                    <InputField label="Password" icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      error={signupForm.formState.errors.password?.message}
                      placeholder="Min 8 characters"
                      rightEl={
                        <button type="button" onClick={() => setShowPassword(p => !p)}
                          className="text-slate-400 hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      {...signupForm.register('password')} />
                    <PasswordStrength password={signupForm.watch('password')} />
                  </div>

                  <InputField label="Confirm Password" icon={Lock}
                    type={showConfirm ? 'text' : 'password'}
                    error={signupForm.formState.errors.confirmPassword?.message}
                    placeholder="Repeat password"
                    rightEl={
                      <button type="button" onClick={() => setShowConfirm(p => !p)}
                        className="text-slate-400 hover:text-white transition-colors">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    {...signupForm.register('confirmPassword')} />

                  <button type="submit"
                    disabled={signupForm.formState.isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                    {signupForm.formState.isSubmitting ? 'Creating account...' : (<>Get Started <ArrowRight size={16} /></>)}
                  </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-violet-400 hover:text-violet-300 font-semibold">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <h1 className="text-3xl font-bold text-white mb-1">Reset password</h1>
                <p className="text-slate-400 mb-8">Enter your email to receive a reset link</p>

                <div className="space-y-4">
                  <InputField label="Email" icon={Mail} type="email" placeholder="you@example.com" />
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    Send Reset Link <ArrowRight size={16} />
                  </button>
                </div>

                <button onClick={() => setMode('login')}
                  className="mt-6 text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1">
                  ← Back to sign in
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
