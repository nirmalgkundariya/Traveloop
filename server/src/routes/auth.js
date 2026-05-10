import express from 'express'
import { signup, login, getMe, updateProfile, changePassword } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', authenticate, getMe)
router.put('/profile', authenticate, updateProfile)
router.put('/password', authenticate, changePassword)

export default router
