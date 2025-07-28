const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAgents() {
  try {
    console.log('Checking agents in database...');
    
    // Check all users
    const users = await prisma.user.findMany({
      include: {
        agentProfile: true
      }
    });

    console.log(`\nTotal users: ${users.length}`);
    
    users.forEach(user => {
      console.log(`\nUser: ${user.name} (${user.email})`);
      console.log(`Role: ${user.role}`);
      if (user.agentProfile) {
        console.log(`Agent Profile: ${user.agentProfile.businessName}`);
        console.log(`Status: ${user.agentProfile.status}`);
        console.log(`MARA: ${user.agentProfile.maraNumber}`);
      } else {
        console.log('No agent profile');
      }
    });

    // Check agent profiles directly
    const agentProfiles = await prisma.agentProfile.findMany({
      include: {
        user: true
      }
    });

    console.log(`\n\nTotal agent profiles: ${agentProfiles.length}`);
    
    agentProfiles.forEach(profile => {
      console.log(`\nAgent Profile ID: ${profile.id}`);
      console.log(`User: ${profile.user.name}`);
      console.log(`Business: ${profile.businessName}`);
      console.log(`Status: ${profile.status}`);
    });

  } catch (error) {
    console.error('❌ Error checking agents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAgents(); 