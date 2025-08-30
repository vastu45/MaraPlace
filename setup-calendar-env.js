const fs = require('fs');
const path = require('path');

// Create .env.local file with calendar integration variables
const envContent = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/maraplace"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"

# Google Calendar Integration
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Outlook/Office 365 Calendar Integration
# Get these from: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
OUTLOOK_CLIENT_ID="your-outlook-client-id-here"
OUTLOOK_CLIENT_SECRET="your-outlook-client-secret-here"

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY="your-stripe-secret-key-here"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key-here"
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully with calendar integration variables!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Update DATABASE_URL with your actual database connection string');
  console.log('2. Get Google Calendar credentials from: https://console.cloud.google.com/apis/credentials');
  console.log('3. Get Outlook credentials from: https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade');
  console.log('4. Update the client IDs and secrets in .env.local');
  console.log('5. Run: npx prisma db push');
  console.log('6. Restart your development server');
  console.log('');
  console.log('🔗 Quick Links:');
  console.log('- Google Cloud Console: https://console.cloud.google.com/');
  console.log('- Azure Portal: https://portal.azure.com/');
  console.log('- Supabase (free database): https://supabase.com');
  console.log('');
  console.log('📚 Setup Guides:');
  console.log('- Google Calendar: See CALENDAR_SYNC_README.md');
  console.log('- Outlook Calendar: See CALENDAR_SYNC_README.md');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
}
