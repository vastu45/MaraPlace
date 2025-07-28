# Vercel Deployment Guide for MaraPlace

## Prerequisites
- Vercel CLI installed ✅
- Node.js and npm ✅
- Git repository ✅

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub/Google
3. Create a new project
4. Choose a project name (e.g., "maraplace")
5. Set a database password
6. Choose a region (Sydney for best performance)

### 1.2 Get Database Connection String
1. Go to Settings → Database
2. Copy the connection string
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.3 Run Database Migrations
```bash
# Update your .env.local with Supabase URL
DATABASE_URL="your_supabase_connection_string"

# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Seed the database
npm run db:seed
```

## Step 2: Environment Variables Setup

### 2.1 Local Environment (.env.local)
```env
# Database
DATABASE_URL="your_supabase_connection_string"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (if using)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2.2 Production Environment (Vercel)
You'll add these in Vercel dashboard after deployment.

## Step 3: Deploy to Vercel

### 3.1 Login to Vercel
```bash
vercel login
```

### 3.2 Deploy
```bash
vercel
```

### 3.3 Follow the prompts:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `maraplace` (or your preferred name)
- Directory: `./` (current directory)
- Override settings: `N`

### 3.4 Add Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```env
DATABASE_URL=your_supabase_connection_string
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-project.vercel.app
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Step 4: Update Domain Settings

### 4.1 Update vercel.json
Update the NEXTAUTH_URL in your vercel.json:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["syd1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "build": {
    "env": {
      "NEXTAUTH_URL": "https://your-project.vercel.app"
    }
  }
}
```

### 4.2 Redeploy
```bash
vercel --prod
```

## Step 5: Verify Deployment

### 5.1 Check Application
1. Visit your Vercel URL
2. Test the main functionality
3. Check if database connections work
4. Verify authentication

### 5.2 Monitor Logs
```bash
vercel logs
```

## Troubleshooting

### Common Issues:
1. **Database Connection Errors**: Check DATABASE_URL in Vercel environment variables
2. **Build Errors**: Check if all dependencies are in package.json
3. **Authentication Issues**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL
4. **API Route Errors**: Check function timeout settings in vercel.json

### Useful Commands:
```bash
# View deployment status
vercel ls

# View project info
vercel inspect

# Pull environment variables
vercel env pull .env.local

# View logs
vercel logs

# Redeploy
vercel --prod
```

## Cost Estimation
- **Vercel**: Free tier (100GB bandwidth, 100 function executions/day)
- **Supabase**: Free tier (500MB database, 50MB storage)
- **Total**: $0/month to start

## Next Steps
1. Set up custom domain (optional)
2. Configure Stripe webhooks
3. Set up monitoring and analytics
4. Configure backup strategies 