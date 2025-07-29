# MaraPlace Railway Deployment Guide

## Current Status: ✅ GitHub Connected

You've successfully connected your GitHub repository to Railway. Here are the next steps:

## Step 1: Set Up Environment Variables

1. **Go to your Railway project dashboard**
2. **Navigate to the "Variables" tab**
3. **Add the following environment variables:**

### Required Environment Variables:

```bash
# Database (Railway will provide this automatically)
DATABASE_URL="postgresql://..."

# NextAuth Configuration
NEXTAUTH_URL="https://your-app-name.railway.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Configuration (if using email notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Stripe Configuration (if using payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Upload (if using file uploads)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"
```

## Step 2: Add PostgreSQL Database

1. **In your Railway project dashboard**
2. **Click "New" → "Database" → "Add PostgreSQL"**
3. **Railway will automatically create the DATABASE_URL variable**

## Step 3: Configure Build Settings

1. **Go to "Settings" tab in your Railway project**
2. **Set the following:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/`

## Step 4: Deploy Your Application

1. **Railway will automatically deploy when you push to your main branch**
2. **Or manually trigger deployment from the dashboard**

## Step 5: Run Database Migrations

After your first deployment, you need to run database migrations:

1. **Go to your deployment in Railway dashboard**
2. **Click on the deployment**
3. **Go to "Logs" tab**
4. **Click "Open Shell"**
5. **Run the following commands:**

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database (optional)
npm run db:seed
```

## Step 6: Verify Deployment

1. **Check your application URL** (provided by Railway)
2. **Test the following:**
   - Homepage loads
   - User registration/login
   - Database connections
   - File uploads (if applicable)

## Railway-Specific Configuration

### Update your package.json scripts (if needed):

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### Railway.toml (optional but recommended):

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 300

[env]
NODE_ENV = "production"
```

## Troubleshooting Common Issues

### 1. Build Failures
- Check Railway logs for specific error messages
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### 2. Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check if database is accessible from your app
- Ensure Prisma schema is correct

### 3. Environment Variables
- Double-check all variable names
- Ensure no extra spaces or quotes
- Verify NEXTAUTH_URL matches your Railway domain

### 4. NextAuth Issues
- Ensure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Check if all providers are configured correctly

## Useful Railway Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy manually
railway up

# View logs
railway logs

# Open shell
railway shell
```

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and connected
- [ ] Application deployed successfully
- [ ] Database migrations completed
- [ ] Application accessible via Railway URL
- [ ] Authentication working
- [ ] Database operations working
- [ ] File uploads working (if applicable)
- [ ] Payment processing working (if applicable)

## Monitoring and Maintenance

- Monitor your application in Railway dashboard
- Set up alerts for errors
- Monitor database usage
- Set up automated backups
- Keep dependencies updated

## Cost Optimization

- Railway has a generous free tier
- Monitor resource usage in dashboard
- Set up auto-scaling if needed
- Consider upgrading only when necessary 