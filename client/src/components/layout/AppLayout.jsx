import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Map, PlusCircle, Search, Backpack,
  Wallet, BookOpen, Settings, LogOut, Menu, X, ChevronRight,
  Activity, Globe, Shield, Bell, Sparkles
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My Trips', icon: Map, path: '/trips' },
  { label: 'New Trip', icon: PlusCircle, path: '/trips/create', highlight: true },
  { label: 'City Search', icon: Globe, path: '/cities' },
  { label: 'Activities', icon: Activity, path: '/activities' },
]

const tripItems = [
  { label: 'Budget', icon: Wallet, pathSuffix: '/budget' },
  { label: 'Packing', icon: Backpack, pathSuffix: '/packing' },
  { label: 'Notes', icon: BookOpen, pathSuffix: '/notes' },
]

const bottomItems = [
  { label: 'Profile', icon: Settings, path: '/profile' },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060d22' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-64 flex flex-col"
        style={{
          background: 'rgba(10, 21, 53, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">TraveLoop</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="divider mx-4 mb-4" />

        {/* Main nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.97 }}
              onClick={() => { navigate(item.path); setSidebarOpen(false) }}
              className={`nav-item w-full ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'text-violet-400' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.highlight && (
                <span className="ml-auto badge-violet badge text-xs">New</span>
              )}
            </motion.button>
          ))}

          {/* User info */}
          {user && (
            <>
              <div className="pt-4 pb-2 px-1">
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Trip Tools</p>
              </div>
              <div className="text-xs text-slate-500 px-4 py-2 italic">
                Select a trip to access tools
              </div>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="pt-4 pb-2 px-1">
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Admin</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { navigate('/admin'); setSidebarOpen(false) }}
                className={`nav-item w-full ${isActive('/admin') ? 'active' : ''}`}
              >
                <Shield size={18} />
                <span>Admin Panel</span>
              </motion.button>
            </>
          )}
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-1">
          <div className="divider mb-3" />
          {/* User card */}
          <div className="glass-card p-3 flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => navigate('/profile')}
            className="nav-item w-full">
            <Settings size={18} /><span>Settings</span>
          </button>
          <button onClick={handleLogout}
            className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={18} /><span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-16 flex-shrink-0"
          style={{
            background: 'rgba(6, 13, 34, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors p-2">
              <Menu size={22} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span>TraveLoop</span>
              <ChevronRight size={14} />
              <span className="text-white capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors glass-card rounded-xl">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
            </button>
            <div className="w-8 h-8 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => navigate('/profile')}
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
