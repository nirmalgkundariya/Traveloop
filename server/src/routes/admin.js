import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate, requireAdmin)

// GET /api/admin/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [totalUsers, totalTrips, activeTrips] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.trip.count({ where: { status: 'active' } }),
  ])
  res.json({ totalUsers, totalTrips, activeTrips })
}))

// GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { trips: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json({ users })
}))

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', asyncHandler(async (req, res) => {
  const { role } = req.body
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, name: true, email: true, role: true }
  })
  res.json({ user })
}))

// DELETE /api/admin/users/:id
router.delete('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id === req.user.userId) {
    return res.status(400).json({ message: 'Cannot delete yourself' })
  }
  await prisma.user.delete({ where: { id: req.params.id } })
  res.json({ message: 'User deleted' })
}))

// GET /api/admin/trips
router.get('/trips', asyncHandler(async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  res.json({ trips })
}))

export default router
