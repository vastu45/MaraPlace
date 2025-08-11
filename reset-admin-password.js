require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    console.log('Resetting admin password...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Update admin password
    const admin = await prisma.user.update({
      where: { email: 'admin@maraplace.com' },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password reset successfully!');
    console.log('Email: admin@maraplace.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
