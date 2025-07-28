const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deployDatabase() {
  try {
    console.log('🚀 Deploying database schema...');
    
    // Generate Prisma client
    const { execSync } = require('child_process');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Database schema deployed successfully!');
    
    // Seed the database
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    
    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error deploying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deployDatabase(); 