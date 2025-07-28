import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const clientPassword = await bcrypt.hash('password123', 10)
  const agentPassword = await bcrypt.hash('password123', 10)

  // Create sample users
  const client1 = await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      name: 'John Smith',
      phone: '+61412345678',
      password: clientPassword,
      role: 'CLIENT',
      clientProfile: {
        create: {
          dateOfBirth: new Date('1990-05-15'),
          nationality: 'Indian',
          address: '123 Main St',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia',
        },
      },
    },
  })

  const agent1 = await prisma.user.upsert({
    where: { email: 'agent1@example.com' },
    update: {},
    create: {
      email: 'agent1@example.com',
      name: 'Sarah Johnson',
      phone: '+61487654321',
      password: agentPassword,
      role: 'AGENT',
      agentProfile: {
        create: {
          maraNumber: 'MARN1234567',
          maraVerified: true,
          businessName: 'Johnson Migration Services',
          businessAddress: '456 Business Ave',
          businessCity: 'Melbourne',
          businessState: 'VIC',
          businessPostcode: '3000',
          businessCountry: 'Australia',
          businessPhone: '+61398765432',
          businessEmail: 'sarah@johnsonmigration.com',
          businessWebsite: 'https://johnsonmigration.com',
          bio: 'Experienced migration agent with over 10 years of experience helping clients with various visa applications.',
          specializations: ['Student Visa', 'Skilled Migration', 'Partner Visa', 'Employer Sponsored'],
          languages: ['English', 'Mandarin', 'Hindi'],
          hourlyRate: 150.00,
          consultationFee: 200.00,
          experience: 10,
          qualifications: ['Bachelor of Law', 'MARA Registration'],
          certifications: ['MARA', 'Migration Law Certificate'],
          status: 'APPROVED',
          isAvailable: true,
          rating: 4.8,
          totalReviews: 45,
          totalBookings: 120,
          totalEarnings: 18000.00,
        },
      },
    },
    include: {
      agentProfile: true,
    },
  })

  const agent2 = await prisma.user.upsert({
    where: { email: 'agent2@example.com' },
    update: {},
    create: {
      email: 'agent2@example.com',
      name: 'Michael Chen',
      phone: '+61411223344',
      password: agentPassword,
      role: 'AGENT',
      agentProfile: {
        create: {
          maraNumber: 'MARN7654321',
          maraVerified: true,
          businessName: 'Chen Immigration Solutions',
          businessAddress: '789 Professional Blvd',
          businessCity: 'Brisbane',
          businessState: 'QLD',
          businessPostcode: '4000',
          businessCountry: 'Australia',
          businessPhone: '+61711223344',
          businessEmail: 'michael@chenimmigration.com',
          businessWebsite: 'https://chenimmigration.com',
          bio: 'Specialized in business migration and investment visas with a focus on Asian markets.',
          specializations: ['Business Visa', 'Investment Visa', 'Skilled Migration', 'Family Visa'],
          languages: ['English', 'Cantonese', 'Mandarin'],
          hourlyRate: 180.00,
          consultationFee: 250.00,
          experience: 8,
          qualifications: ['Master of Migration Law', 'MARA Registration'],
          certifications: ['MARA', 'Business Migration Specialist'],
          status: 'APPROVED',
          isAvailable: true,
          rating: 4.9,
          totalReviews: 32,
          totalBookings: 85,
          totalEarnings: 15300.00,
        },
      },
    },
    include: {
      agentProfile: true,
    },
  })

  // Create sample services
  const service1 = await prisma.service.create({
    data: {
      agentId: agent1.agentProfile!.id,
      name: 'Student Visa Consultation',
      description: 'Comprehensive consultation for student visa applications including document preparation and application guidance.',
      price: 200.00,
      duration: 60,
      isActive: true,
    },
  })

  const service2 = await prisma.service.create({
    data: {
      agentId: agent1.agentProfile!.id,
      name: 'Skilled Migration Assessment',
      description: 'Skills assessment and migration pathway consultation for skilled workers.',
      price: 300.00,
      duration: 90,
      isActive: true,
    },
  })

  const service3 = await prisma.service.create({
    data: {
      agentId: agent2.agentProfile!.id,
      name: 'Business Migration Consultation',
      description: 'Expert advice on business and investment visa applications.',
      price: 400.00,
      duration: 120,
      isActive: true,
    },
  })

  // Create sample availability
  await prisma.availability.createMany({
    data: [
      {
        agentId: agent1.agentProfile!.id,
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
      {
        agentId: agent1.agentProfile!.id,
        dayOfWeek: 2, // Tuesday
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
      {
        agentId: agent1.agentProfile!.id,
        dayOfWeek: 3, // Wednesday
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
      {
        agentId: agent1.agentProfile!.id,
        dayOfWeek: 4, // Thursday
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
      {
        agentId: agent1.agentProfile!.id,
        dayOfWeek: 5, // Friday
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
      {
        agentId: agent2.agentProfile!.id,
        dayOfWeek: 1, // Monday
        startTime: '10:00',
        endTime: '18:00',
        isActive: true,
      },
      {
        agentId: agent2.agentProfile!.id,
        dayOfWeek: 2, // Tuesday
        startTime: '10:00',
        endTime: '18:00',
        isActive: true,
      },
      {
        agentId: agent2.agentProfile!.id,
        dayOfWeek: 3, // Wednesday
        startTime: '10:00',
        endTime: '18:00',
        isActive: true,
      },
      {
        agentId: agent2.agentProfile!.id,
        dayOfWeek: 4, // Thursday
        startTime: '10:00',
        endTime: '18:00',
        isActive: true,
      },
      {
        agentId: agent2.agentProfile!.id,
        dayOfWeek: 5, // Friday
        startTime: '10:00',
        endTime: '18:00',
        isActive: true,
      },
    ],
  })

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      clientId: client1.id,
      agentId: agent1.agentProfile!.id,
      serviceId: service1.id,
      date: new Date('2024-01-15'),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      status: 'CONFIRMED',
      notes: 'Student visa consultation for Master\'s program',
      meetingType: 'ONLINE',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      totalAmount: 200.00,
      commission: 20.00,
    },
  })

  // Create sample reviews
  await prisma.review.create({
    data: {
      clientId: client1.id,
      agentId: agent1.agentProfile!.id,
      bookingId: booking1.id,
      rating: 5,
      comment: 'Excellent service! Sarah was very knowledgeable and helped me understand the entire process clearly.',
      isPublic: true,
    },
  })

  // Create sample messages
  await prisma.message.create({
    data: {
      senderId: client1.id,
      receiverId: agent1.id,
      bookingId: booking1.id,
      content: 'Hi Sarah, I have some questions about the documents I need to prepare for my student visa application.',
      isRead: false,
    },
  })

  await prisma.message.create({
    data: {
      senderId: agent1.id,
      receiverId: client1.id,
      bookingId: booking1.id,
      content: 'Hi John, I\'d be happy to help! Please send me your current documents and I\'ll review them before our consultation.',
      isRead: true,
    },
  })

  // Create sample payments
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      clientId: client1.id,
      amount: 200.00,
      currency: 'AUD',
      status: 'COMPLETED',
      method: 'CREDIT_CARD',
      stripePaymentIntentId: 'pi_sample_payment_intent',
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 