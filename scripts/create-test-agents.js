const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAgents() {
  try {
    console.log('Creating test agents...');
    
    // Create test users and agent profiles
    const testAgents = [
      {
        user: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'AGENT',
          phone: '+61412345678'
        },
        agentProfile: {
          businessName: 'Johnson Migration Services',
          businessAddress: '123 Collins St, Melbourne VIC 3000',
          businessCity: 'Melbourne',
          businessState: 'VIC',
          abn: '12345678901',
          maraNumber: 'MARN1234567',
          bio: 'Experienced migration agent specializing in skilled visas and family visas.',
          status: 'PENDING'
        }
      },
      {
        user: {
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'AGENT',
          phone: '+61423456789'
        },
        agentProfile: {
          businessName: 'Chen Immigration Solutions',
          businessAddress: '456 George St, Sydney NSW 2000',
          businessCity: 'Sydney',
          businessState: 'NSW',
          abn: '23456789012',
          maraNumber: 'MARN2345678',
          bio: 'Dedicated to helping families reunite through partner and parent visas.',
          status: 'APPROVED'
        }
      },
      {
        user: {
          name: 'Emma Wilson',
          email: 'emma.wilson@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'AGENT',
          phone: '+61434567890'
        },
        agentProfile: {
          businessName: 'Wilson Visa Services',
          businessAddress: '789 Queen St, Brisbane QLD 4000',
          businessCity: 'Brisbane',
          businessState: 'QLD',
          abn: '34567890123',
          maraNumber: 'MARN3456789',
          bio: 'Expert in business visas and investment migration.',
          status: 'REJECTED'
        }
      },
      {
        user: {
          name: 'David Brown',
          email: 'david.brown@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'AGENT',
          phone: '+61445678901'
        },
        agentProfile: {
          businessName: 'Brown Migration Group',
          businessAddress: '321 Hay St, Perth WA 6000',
          businessCity: 'Perth',
          businessState: 'WA',
          abn: '45678901234',
          maraNumber: 'MARN4567890',
          bio: 'Specializing in regional visas and state sponsorship.',
          status: 'SUSPENDED'
        }
      }
    ];

    for (const agentData of testAgents) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: agentData.user.email }
      });

      if (existingUser) {
        console.log(`User ${agentData.user.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: agentData.user
      });

      // Create agent profile
      const agentProfile = await prisma.agentProfile.create({
        data: {
          ...agentData.agentProfile,
          userId: user.id
        }
      });

      console.log(`✅ Created agent: ${user.name} (${agentData.agentProfile.status})`);
    }

    console.log('✅ Test agents created successfully!');

  } catch (error) {
    console.error('❌ Error creating test agents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAgents(); 