import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { z } from 'zod'

const router = express.Router()
const prisma = new PrismaClient()

const tripSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  budget: z.number().optional(),
  currency: z.string().default('USD'),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
  isPublic: z.boolean().default(false),
})

// GET /api/trips
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { activities: true } } }
  })
  res.json({ trips })
}))

// GET /api/trips/:id
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const trip = await prisma.trip.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
    include: {
      activities: { orderBy: [{ date: 'asc' }, { order: 'asc' }] },
      budgetItems: true,
      packingItems: true,
      notes: { orderBy: { updatedAt: 'desc' } },
    }
  })
  if (!trip) return res.status(404).json({ message: 'Trip not found' })
  res.json({ trip })
}))

// POST /api/trips
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const data = tripSchema.parse(req.body)
  const trip = await prisma.trip.create({
    data: { ...data, userId: req.user.userId }
  })
  res.status(201).json({ trip })
}))

// PUT /api/trips/:id
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const data = tripSchema.partial().parse(req.body)
  const trip = await prisma.trip.updateMany({
    where: { id: req.params.id, userId: req.user.userId },
    data
  })
  if (trip.count === 0) return res.status(404).json({ message: 'Trip not found' })
  const updated = await prisma.trip.findUnique({ where: { id: req.params.id } })
  res.json({ trip: updated })
}))

// DELETE /api/trips/:id
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  await prisma.trip.deleteMany({ where: { id: req.params.id, userId: req.user.userId } })
  res.json({ message: 'Trip deleted' })
}))

export default router
