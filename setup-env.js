const fs = require('fs');
const path = require('path');

// Create .env.local file with proper formatting
const envContent = `DATABASE_URL="postgresql://username:password@localhost:5432/maraplace"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3004"
NODE_ENV="development"
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Update DATABASE_URL in .env.local with your actual database connection string');
  console.log('2. Run: npx prisma db push');
  console.log('3. Run: node scripts/create-test-agents.js');
  console.log('4. Restart your development server');
  console.log('');
  console.log('💡 For a free database, use Supabase: https://supabase.com');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
} 