import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId } = req.query
  if (!tripId) return res.status(400).json({ message: 'tripId required' })
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } })
  if (!trip) return res.status(403).json({ message: 'Forbidden' })
  const items = await prisma.packingItem.findMany({ where: { tripId }, orderBy: { category: 'asc' } })
  res.json({ items })
}))

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId, name, category, quantity, packed } = req.body
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } })
  if (!trip) return res.status(403).json({ message: 'Forbidden' })
  const item = await prisma.packingItem.create({
    data: { tripId, name, category: category || 'General', quantity: quantity || 1, packed: packed || false }
  })
  res.status(201).json({ item })
}))

router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { name, category, quantity, packed } = req.body
  const item = await prisma.packingItem.updateMany({
    where: { id: req.params.id, trip: { userId: req.user.userId } },
    data: { name, category, quantity, packed }
  })
  if (item.count === 0) return res.status(404).json({ message: 'Not found' })
  const updated = await prisma.packingItem.findUnique({ where: { id: req.params.id } })
  res.json({ item: updated })
}))

router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  await prisma.packingItem.deleteMany({ where: { id: req.params.id, trip: { userId: req.user.userId } } })
  res.json({ message: 'Deleted' })
}))

export default router
