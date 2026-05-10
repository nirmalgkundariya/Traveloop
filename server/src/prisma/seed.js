import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@traveloop.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@traveloop.com',
      password: adminPassword,
      role: 'admin',
    }
  })

  // Create test user
  const userPassword = await bcrypt.hash('test1234', 12)
  const user = await prisma.user.upsert({
    where: { email: 'test@traveloop.com' },
    update: {},
    create: {
      name: 'Test Traveler',
      email: 'test@traveloop.com',
      password: userPassword,
      bio: 'Love exploring new places!',
      location: 'Mumbai, India',
    }
  })

  // Create a sample trip
  const trip = await prisma.trip.create({
    data: {
      title: 'Bali Adventure 2025',
      destination: 'Bali, Indonesia',
      description: 'A 10-day trip exploring the beauty of Bali',
      startDate: new Date('2025-06-15'),
      endDate: new Date('2025-06-25'),
      budget: 150000,
      currency: 'INR',
      status: 'planning',
      userId: user.id,
    }
  })

  // Add activities
  await prisma.activity.createMany({
    data: [
      { tripId: trip.id, title: 'Arrive at Ngurah Rai Airport', date: new Date('2025-06-15'), time: '14:00', type: 'transport', order: 0 },
      { tripId: trip.id, title: 'Check-in: Ubud Jungle Resort', date: new Date('2025-06-15'), time: '17:00', type: 'accommodation', order: 1 },
      { tripId: trip.id, title: 'Tegallalang Rice Terraces', date: new Date('2025-06-16'), time: '08:00', type: 'attraction', cost: 500, order: 0 },
      { tripId: trip.id, title: 'Ubud Monkey Forest', date: new Date('2025-06-16'), time: '14:00', type: 'attraction', cost: 200, order: 1 },
    ]
  })

  // Add packing items
  await prisma.packingItem.createMany({
    data: [
      { tripId: trip.id, name: 'Passport', category: 'Documents', quantity: 1 },
      { tripId: trip.id, name: 'Sunscreen SPF50', category: 'Health', quantity: 2 },
      { tripId: trip.id, name: 'T-shirts', category: 'Clothing', quantity: 5 },
      { tripId: trip.id, name: 'Shorts', category: 'Clothing', quantity: 3 },
    ]
  })

  console.log('✅ Seed complete!')
  console.log(`\n👤 Admin: admin@traveloop.com / admin123`)
  console.log(`👤 User: test@traveloop.com / test1234`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
