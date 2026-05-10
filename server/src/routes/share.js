import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import crypto from 'crypto'

const router = express.Router()
const prisma = new PrismaClient()

// Generate share link for a trip
router.post('/generate/:tripId', authenticate, asyncHandler(async (req, res) => {
  const trip = await prisma.trip.findFirst({ where: { id: req.params.tripId, userId: req.user.userId } })
  if (!trip) return res.status(404).json({ message: 'Trip not found' })

  const shareId = crypto.randomBytes(12).toString('hex')
  const updated = await prisma.trip.update({
    where: { id: trip.id },
    data: { shareId, isPublic: true }
  })
  res.json({ shareId, shareUrl: `${process.env.CLIENT_URL}/share/${shareId}` })
}))

// Revoke share
router.delete('/revoke/:tripId', authenticate, asyncHandler(async (req, res) => {
  await prisma.trip.updateMany({
    where: { id: req.params.tripId, userId: req.user.userId },
    data: { shareId: null, isPublic: false }
  })
  res.json({ message: 'Share revoked' })
}))

// GET public shared itinerary (no auth required)
router.get('/:shareId', asyncHandler(async (req, res) => {
  const trip = await prisma.trip.findFirst({
    where: { shareId: req.params.shareId, isPublic: true },
    include: {
      activities: { orderBy: [{ date: 'asc' }, { order: 'asc' }] },
      user: { select: { name: true, avatar: true } }
    }
  })
  if (!trip) return res.status(404).json({ message: 'Shared itinerary not found' })
  res.json({ trip })
}))

export default router
