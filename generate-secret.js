const crypto = require('crypto');

// Generate a secure random secret
const secret = crypto.randomBytes(32).toString('hex');

console.log('🔐 Generated NEXTAUTH_SECRET:');
console.log(secret);
console.log('\n📝 Add this to your .env file:');
console.log(`NEXTAUTH_SECRET="${secret}"`);
