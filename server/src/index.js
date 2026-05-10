import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import tripRoutes from './routes/trips.js'
import activityRoutes from './routes/activities.js'
import budgetRoutes from './routes/budget.js'
import notesRoutes from './routes/notes.js'
import packingRoutes from './routes/packing.js'
import shareRoutes from './routes/share.js'
import adminRoutes from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api', limiter)

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again later.' }
})

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static uploads
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/packing', packingRoutes)
app.use('/api/share', shareRoutes)
app.use('/api/admin', adminRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🚀 TraveLoop API running on port ${PORT}`)
  console.log(`   ENV: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health: http://localhost:${PORT}/api/health\n`)
})

export default app
