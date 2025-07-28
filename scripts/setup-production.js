const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupProduction() {
  try {
    console.log('🚀 Setting up production database...');
    
    // Generate Prisma client
    const { execSync } = require('child_process');
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    console.log('🗄️ Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Database schema deployed successfully!');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@maraplace.com' }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await prisma.user.create({
        data: {
          name: 'MaraPlace Admin',
          email: 'admin@maraplace.com',
          password: hashedPassword,
          role: 'ADMIN',
          phone: '+61400000000'
        }
      });
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create sample agents
    console.log('👥 Creating sample agents...');
    const sampleAgents = [
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
          status: 'APPROVED'
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
      }
    ];

    for (const agentData of sampleAgents) {
      const existingUser = await prisma.user.findUnique({
        where: { email: agentData.user.email }
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: agentData.user
        });

        await prisma.agentProfile.create({
          data: {
            ...agentData.agentProfile,
            userId: user.id
          }
        });

        console.log(`✅ Created agent: ${user.name}`);
      }
    }

    // Create sample client
    console.log('👤 Creating sample client...');
    const existingClient = await prisma.user.findUnique({
      where: { email: 'client@example.com' }
    });

    if (!existingClient) {
      const clientUser = await prisma.user.create({
        data: {
          name: 'John Smith',
          email: 'client@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'CLIENT',
          phone: '+61434567890'
        }
      });

      await prisma.clientProfile.create({
        data: {
          userId: clientUser.id,
          city: 'Melbourne',
          country: 'Australia'
        }
      });

      console.log('✅ Sample client created:', clientUser.email);
    }

    console.log('🎉 Production setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@maraplace.com / admin123');
    console.log('Agent: sarah.johnson@example.com / password123');
    console.log('Client: client@example.com / password123');

  } catch (error) {
    console.error('❌ Error setting up production:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProduction(); 