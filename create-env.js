const fs = require('fs');

const envContent = `DATABASE_URL="postgresql://postgres:maraplace123@localhost:5432/maraplace"
NEXTAUTH_SECRET="maraplace-secret-key-2024-development"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"`;

try {
  fs.writeFileSync('.env', envContent, 'utf8');
  console.log('✅ .env file created successfully!');
  console.log('Contents:');
  console.log(envContent);
} catch (error) {
  console.error('❌ Error creating .env file:', error);
}
