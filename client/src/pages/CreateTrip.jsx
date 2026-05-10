import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import { useTrips } from '../context/TripContext'
import { CheckCircle2, Upload, MapPin, Calendar, Users, Wallet, Globe, Lock, Image, ArrowRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const TRIP_TYPES = [
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'beach', label: 'Beach', emoji: '🏖️' },
  { value: 'city', label: 'City Break', emoji: '🏙️' },
  { value: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { value: 'road_trip', label: 'Road Trip', emoji: '🚗' },
  { value: 'cruise', label: 'Cruise', emoji: '🚢' },
  { value: 'backpacking', label: 'Backpacking', emoji: '🎒' },
  { value: 'luxury', label: 'Luxury', emoji: '✨' },
]

const STEPS = ['Basics', 'Details', 'Settings', 'Review']

const schema = z.object({
  name: z.string().min(3, 'Trip name must be at least 3 characters'),
  destination: z.string().min(2, 'Enter a destination'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Select a start date'),
  endDate: z.string().min(1, 'Select an end date'),
  budget: z.string().optional(),
  travelersCount: z.string().default('1'),
  tripType: z.string().min(1, 'Select a trip type'),
  privacy: z.enum(['private', 'public', 'shared']),
})

export default function CreateTrip() {
  const [step, setStep] = useState(0)
  const [coverPreview, setCoverPreview] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const { createTrip } = useTrips()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', destination: '', description: '',
      startDate: '', endDate: '', budget: '',
      travelersCount: '1', tripType: '', privacy: 'private',
    }
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => {
      const f = files[0]
      if (f) {
        setCoverFile(f)
        setCoverPreview(URL.createObjectURL(f))
      }
    }
  })

  const values = form.watch()

  const STEPS_CONTENT = [
    { title: 'Trip Basics', subtitle: 'Give your adventure a name' },
    { title: 'Trip Details', subtitle: 'Dates, travelers & budget' },
    { title: 'Preferences', subtitle: 'Type and privacy settings' },
    { title: 'Review', subtitle: 'Everything looks good?' },
  ]

  const nextStep = async () => {
    const fields = [
      ['name', 'destination', 'description'],
      ['startDate', 'endDate', 'budget', 'travelersCount'],
      ['tripType', 'privacy'],
    ]
    const valid = await form.trigger(fields[step])
    if (valid) setStep(s => s + 1)
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => formData.append(k, v))
      if (coverFile) formData.append('cover', coverFile)
      const trip = await createTrip(data)
      navigate(`/trips/${trip.id}/itinerary`)
    } catch (err) {
      toast.error('Failed to create trip')
    }
  }

  return (
    <div className="page-container p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Plan a New Trip</h1>
          <p className="text-slate-400">Create your perfect travel itinerary in minutes</p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-violet-400' : 'text-slate-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i < step ? 'bg-violet-500 text-white' :
                  i === step ? 'bg-violet-500/20 border-2 border-violet-500 text-violet-400' :
                  'bg-white/5 border border-white/10 text-slate-600'
                }`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-px transition-all duration-300"
                  style={{ background: i < step ? 'linear-gradient(90deg, #8b5cf6, rgba(139,92,246,0.3))' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-1">{STEPS_CONTENT[step].title}</h2>
          <p className="text-slate-400 text-sm mb-6">{STEPS_CONTENT[step].subtitle}</p>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 0: Basics */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                      <Globe size={14} /> Trip Name *
                    </label>
                    <input className="input-glass" placeholder="e.g. Bali Adventure 2024"
                      {...form.register('name')} />
                    {form.formState.errors.name && <p className="text-red-400 text-xs mt-1">{form.formState.errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                      <MapPin size={14} /> Destination *
                    </label>
                    <input className="input-glass" placeholder="e.g. Bali, Indonesia"
                      {...form.register('destination')} />
                    {form.formState.errors.destination && <p className="text-red-400 text-xs mt-1">{form.formState.errors.destination.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                    <textarea className="input-glass resize-none" rows={3}
                      placeholder="What's this trip about? Any special plans?"
                      {...form.register('description')} />
                  </div>

                  {/* Cover image dropzone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                      <Image size={14} /> Cover Image
                    </label>
                    <div {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
                      }`}>
                      <input {...getInputProps()} />
                      {coverPreview ? (
                        <div className="relative">
                          <img src={coverPreview} alt="" className="h-32 mx-auto rounded-xl object-cover" />
                          <p className="text-slate-400 text-xs mt-2">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} className="text-slate-500 mx-auto mb-2" />
                          <p className="text-slate-400 text-sm">Drop a cover image or <span className="text-violet-400">browse</span></p>
                          <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                        <Calendar size={14} /> Start Date *
                      </label>
                      <input type="date" className="input-glass" {...form.register('startDate')} />
                      {form.formState.errors.startDate && <p className="text-red-400 text-xs mt-1">{form.formState.errors.startDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                        <Calendar size={14} /> End Date *
                      </label>
                      <input type="date" className="input-glass" {...form.register('endDate')} />
                      {form.formState.errors.endDate && <p className="text-red-400 text-xs mt-1">{form.formState.errors.endDate.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                        <Wallet size={14} /> Total Budget (USD)
                      </label>
                      <input type="number" className="input-glass" placeholder="e.g. 3000"
                        {...form.register('budget')} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                        <Users size={14} /> Travelers
                      </label>
                      <input type="number" min="1" max="50" className="input-glass"
                        {...form.register('travelersCount')} />
                    </div>
                  </div>

                  {/* Duration preview */}
                  {values.startDate && values.endDate && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 border-violet-500/20">
                      <p className="text-slate-400 text-sm">Trip Duration</p>
                      <p className="text-white font-bold text-xl">
                        {Math.max(0, Math.ceil((new Date(values.endDate) - new Date(values.startDate)) / (1000 * 60 * 60 * 24)))} days
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Settings */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Trip Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {TRIP_TYPES.map(type => (
                        <label key={type.value}
                          className={`cursor-pointer rounded-xl p-3 text-center border transition-all duration-200 ${
                            values.tripType === type.value
                              ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                          }`}>
                          <input type="radio" className="sr-only" value={type.value} {...form.register('tripType')} />
                          <div className="text-2xl mb-1">{type.emoji}</div>
                          <div className="text-xs font-medium">{type.label}</div>
                        </label>
                      ))}
                    </div>
                    {form.formState.errors.tripType && <p className="text-red-400 text-xs mt-1">{form.formState.errors.tripType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Lock size={14} /> Privacy
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'private', label: 'Private', desc: 'Only you', emoji: '🔒' },
                        { value: 'shared', label: 'Shared', desc: 'Invite only', emoji: '👥' },
                        { value: 'public', label: 'Public', desc: 'Anyone can view', emoji: '🌐' },
                      ].map(opt => (
                        <label key={opt.value}
                          className={`cursor-pointer rounded-xl p-4 text-center border transition-all duration-200 ${
                            values.privacy === opt.value
                              ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                          }`}>
                          <input type="radio" className="sr-only" value={opt.value} {...form.register('privacy')} />
                          <div className="text-xl mb-1">{opt.emoji}</div>
                          <div className="text-sm font-semibold">{opt.label}</div>
                          <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {coverPreview && (
                    <div className="h-40 rounded-xl overflow-hidden">
                      <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Trip Name', value: values.name },
                      { label: 'Destination', value: values.destination },
                      { label: 'Start Date', value: values.startDate },
                      { label: 'End Date', value: values.endDate },
                      { label: 'Budget', value: values.budget ? `$${values.budget}` : 'Not set' },
                      { label: 'Travelers', value: values.travelersCount },
                      { label: 'Type', value: TRIP_TYPES.find(t => t.value === values.tripType)?.label || 'Not set' },
                      { label: 'Privacy', value: values.privacy },
                    ].map(item => (
                      <div key={item.label} className="bg-white/5 rounded-xl p-3">
                        <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                        <p className="text-white text-sm font-medium capitalize">{item.value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <button type="button"
                onClick={() => step === 0 ? navigate('/trips') : setStep(s => s - 1)}
                className="btn-secondary flex items-center gap-2">
                <ArrowLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
              </button>

              {step < 3 ? (
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit"
                  disabled={form.formState.isSubmitting}
                  className="btn-primary flex items-center gap-2">
                  {form.formState.isSubmitting ? 'Creating...' : (<>Create Trip <CheckCircle2 size={16} /></>)}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
