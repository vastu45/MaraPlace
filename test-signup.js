require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSignup() {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'CLIENT'
      }
    });
    
    console.log('✅ User created successfully:', testUser.id);
    
    // Clean up - delete the test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
