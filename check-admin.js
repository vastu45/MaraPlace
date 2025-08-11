const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    console.log('Checking for admin users...');
    
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    console.log('Admin users found:', adminUsers.length);
    adminUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
    });
    
    // Also check all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    
    console.log('\nAll users:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();
