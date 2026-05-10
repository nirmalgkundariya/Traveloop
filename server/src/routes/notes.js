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
  const notes = await prisma.note.findMany({ where: { tripId }, orderBy: { updatedAt: 'desc' } })
  res.json({ notes })
}))

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { tripId, title, content } = req.body
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } })
  if (!trip) return res.status(403).json({ message: 'Forbidden' })
  const note = await prisma.note.create({ data: { tripId, title, content } })
  res.status(201).json({ note })
}))

router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const { title, content } = req.body
  const note = await prisma.note.updateMany({
    where: { id: req.params.id, trip: { userId: req.user.userId } },
    data: { title, content }
  })
  if (note.count === 0) return res.status(404).json({ message: 'Not found' })
  const updated = await prisma.note.findUnique({ where: { id: req.params.id } })
  res.json({ note: updated })
}))

router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  await prisma.note.deleteMany({ where: { id: req.params.id, trip: { userId: req.user.userId } } })
  res.json({ message: 'Deleted' })
}))

export default router
