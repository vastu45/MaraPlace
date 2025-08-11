require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetClientPassword() {
  try {
    console.log('Resetting client password...');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('client123', 10);

    // Update client password
    const client = await prisma.user.update({
      where: { email: 'utsav@gmail.com' },
      data: { password: hashedPassword }
    });

    console.log('✅ Client password reset successfully!');
    console.log('Email: utsav@gmail.com');
    console.log('Password: client123');

  } catch (error) {
    console.error('❌ Error resetting client password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetClientPassword();
