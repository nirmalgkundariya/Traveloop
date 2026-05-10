import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/activities?tripId=xxx
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId } = req.query
  const where = tripId ? { tripId, trip: { userId: req.user.userId } } : { trip: { userId: req.user.userId } }
  const activities = await prisma.activity.findMany({
    where,
    orderBy: [{ date: 'asc' }, { order: 'asc' }]
  })
  res.json({ activities })
}))

// POST /api/activities
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId, title, description, date, time, location, cost, type, order } = req.body
  // verify trip ownership
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } })
  if (!trip) return res.status(403).json({ message: 'Forbidden' })
  const activity = await prisma.activity.create({
    data: { tripId, title, description, date, time, location, cost: cost ? parseFloat(cost) : null, type, order: order || 0 }
  })
  res.status(201).json({ activity })
}))

// PUT /api/activities/:id
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { title, description, date, time, location, cost, type, order } = req.body
  const activity = await prisma.activity.updateMany({
    where: { id: req.params.id, trip: { userId: req.user.userId } },
    data: { title, description, date, time, location, cost: cost ? parseFloat(cost) : null, type, order }
  })
  if (activity.count === 0) return res.status(404).json({ message: 'Not found' })
  const updated = await prisma.activity.findUnique({ where: { id: req.params.id } })
  res.json({ activity: updated })
}))

// DELETE /api/activities/:id
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  await prisma.activity.deleteMany({
    where: { id: req.params.id, trip: { userId: req.user.userId } }
  })
  res.json({ message: 'Deleted' })
}))

// PUT /api/activities/reorder - bulk reorder
router.put('/reorder/bulk', authenticate, asyncHandler(async (req, res) => {
  const { items } = req.body // [{ id, order }]
  await Promise.all(items.map(item =>
    prisma.activity.update({ where: { id: item.id }, data: { order: item.order } })
  ))
  res.json({ message: 'Reordered' })
}))

export default router
