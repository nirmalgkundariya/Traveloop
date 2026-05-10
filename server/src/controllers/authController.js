import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { asyncHandler } from '../middleware/errorHandler.js'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'

const signToken = (userId, role) =>
  jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const signup = asyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body)
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) return res.status(409).json({ message: 'Email already in use' })

  const hashed = await bcrypt.hash(data.password, 12)
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed },
    select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true }
  })

  const token = signToken(user.id, user.role)
  res.status(201).json({ token, user })
})

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body)
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

  const token = signToken(user.id, user.role)
  const { password, ...safeUser } = user
  res.json({ token, user: safeUser })
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, location: true, createdAt: true }
  })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({ user })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, location } = req.body
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { name, bio, location },
    select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, location: true }
  })
  res.json({ user })
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return res.status(400).json({ message: 'Current password incorrect' })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: req.user.userId }, data: { password: hashed } })
  res.json({ message: 'Password updated' })
})
