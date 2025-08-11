require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@maraplace.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@maraplace.com');
      console.log('Password: admin123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'MaraPlace Admin',
        email: 'admin@maraplace.com',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '+61400000000'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@maraplace.com');
    console.log('Password: admin123');
    console.log('User ID:', admin.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 