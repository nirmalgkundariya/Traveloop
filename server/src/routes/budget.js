import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/budget?tripId=xxx
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId } = req.query
  if (!tripId) return res.status(400).json({ message: 'tripId required' })
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } })
  if (!trip) return res.status(403).json({ message: 'Forbidden' })
  const items = await prisma.budgetItem.findMany({ where: { tripId }, orderBy: { createdAt: 'asc' } })
  res.json({ items, budget: trip.budget, currency: trip.currency })
}))

// POST /api/budget
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId, category, description, amount, date, paid } = req.body
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } })
  if (!trip) return res.status(403).json({ message: 'Forbidden' })
  const item = await prisma.budgetItem.create({
    data: { tripId, category, description, amount: parseFloat(amount), date, paid: paid || false }
  })
  res.status(201).json({ item })
}))

// PUT /api/budget/:id
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { category, description, amount, date, paid } = req.body
  const item = await prisma.budgetItem.updateMany({
    where: { id: req.params.id, trip: { userId: req.user.userId } },
    data: { category, description, amount: amount ? parseFloat(amount) : undefined, date, paid }
  })
  if (item.count === 0) return res.status(404).json({ message: 'Not found' })
  const updated = await prisma.budgetItem.findUnique({ where: { id: req.params.id } })
  res.json({ item: updated })
}))

// DELETE /api/budget/:id
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  await prisma.budgetItem.deleteMany({
    where: { id: req.params.id, trip: { userId: req.user.userId } }
  })
  res.json({ message: 'Deleted' })
}))

export default router
