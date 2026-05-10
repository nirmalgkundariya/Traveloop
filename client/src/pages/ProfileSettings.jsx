import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { User, Mail, Lock, Bell, Shield, Trash2, Camera, Save, Globe, Moon, Sun, LogOut, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
]

export default function ProfileSettings() {
  const { user, updateUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [darkMode, setDarkMode] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [notifications, setNotifications] = useState({
    email: true, push: false, tripReminders: true, newsletter: false, marketing: false
  })
  const [privacy, setPrivacy] = useState({
    publicProfile: true, shareTrips: false, showLocation: true
  })

  const profileForm = useForm({ defaultValues: { name: user?.name || '', email: user?.email || '', bio: '', location: '' } })
  const passwordForm = useForm()

  const onSaveProfile = async (data) => {
    try {
      await api.put('/auth/profile', data)
      updateUser(data)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
  }

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) return toast.error("Passwords don't match")
    try {
      await api.put('/auth/password', { currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Password changed!')
      passwordForm.reset()
    } catch { toast.error('Failed to change password') }
  }

  const handleAvatarChange = (e) => {
    const f = e.target.files[0]
    if (f) setAvatarPreview(URL.createObjectURL(f))
  }

  return (
    <div className="page-container p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Account Settings</h1>
        <p className="text-slate-400">Manage your profile and preferences</p>
      </motion.div>

      {/* Profile hero card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)' }}>
            {avatarPreview || user?.avatar ? (
              <img src={avatarPreview || user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.[0] || 'U'}
              </div>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
            <Camera size={20} className="text-white" />
            <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
          </label>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
          <p className="text-slate-400">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <span className="badge badge-violet">Free Plan</span>
            <span className="badge badge-sky flex items-center gap-1"><Globe size={10} /> Public Profile</span>
          </div>
        </div>

        <div className="sm:ml-auto flex gap-3">
          <button onClick={() => { logout(); }} className="btn-secondary flex items-center gap-2 text-sm text-red-400 border-red-500/20 hover:bg-red-500/10">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab sidebar */}
        <div className="space-y-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`nav-item w-full ${activeTab === tab.id ? 'active' : ''}`}>
              <tab.icon size={17} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 space-y-5">

            {activeTab === 'profile' && (
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><User size={13} />Full Name</label>
                    <input className="input-glass" {...profileForm.register('name')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Mail size={13} />Email</label>
                    <input className="input-glass" type="email" {...profileForm.register('email')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
                  <textarea className="input-glass resize-none" rows={3}
                    placeholder="Tell the community about yourself..."
                    {...profileForm.register('bio')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2"><Globe size={13} />Location</label>
                  <input className="input-glass" placeholder="e.g. Mumbai, India" {...profileForm.register('location')} />
                </div>

                <div className="divider" />
                <h3 className="text-lg font-bold text-white">Appearance</h3>
                <div className="flex items-center justify-between glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon size={18} className="text-violet-400" /> : <Sun size={18} className="text-amber-400" />}
                    <div>
                      <p className="text-white text-sm font-medium">Dark Mode</p>
                      <p className="text-slate-500 text-xs">Currently {darkMode ? 'enabled' : 'disabled'}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setDarkMode(d => !d)}
                    className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-violet-500' : 'bg-white/20'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <button type="submit" disabled={profileForm.formState.isSubmitting}
                  className="btn-primary flex items-center gap-2">
                  <Save size={16} /> {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Change Password</h3>
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input type="password" className="input-glass" {...passwordForm.register(field)} />
                  </div>
                ))}
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Lock size={16} /> Update Password
                </button>

                <div className="divider" />
                <h3 className="text-lg font-bold text-white">Danger Zone</h3>
                <div className="glass-card p-4 border border-red-500/20">
                  <p className="text-white text-sm font-medium mb-1">Delete Account</p>
                  <p className="text-slate-400 text-xs mb-3">This will permanently delete all your trips and data. This cannot be undone.</p>
                  <button type="button" className="flex items-center gap-2 text-red-400 text-sm hover:text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl transition-colors">
                    <Trash2 size={14} /> Delete My Account
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'tripReminders', label: 'Trip Reminders', desc: 'Reminders before your trips' },
                  { key: 'newsletter', label: 'Newsletter', desc: 'Travel tips and inspiration' },
                  { key: 'marketing', label: 'Marketing Emails', desc: 'Deals and promotions' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                      className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key] ? 'bg-violet-500' : 'bg-white/20'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[item.key] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success('Notification settings saved!')} className="btn-primary flex items-center gap-2">
                  <Check size={16} /> Save Preferences
                </button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Privacy Settings</h3>
                {[
                  { key: 'publicProfile', label: 'Public Profile', desc: 'Others can find your profile' },
                  { key: 'shareTrips', label: 'Share Trips Publicly', desc: 'Allow your trips to be discoverable' },
                  { key: 'showLocation', label: 'Show Location', desc: 'Display your home city' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button onClick={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className={`w-12 h-6 rounded-full transition-all relative ${privacy[item.key] ? 'bg-violet-500' : 'bg-white/20'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${privacy[item.key] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success('Privacy settings saved!')} className="btn-primary flex items-center gap-2">
                  <Shield size={16} /> Save Privacy Settings
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
