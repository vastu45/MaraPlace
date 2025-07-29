# MaraPlace Runway Deployment Guide

## Prerequisites

1. **Runway CLI**: Install the Runway CLI
   ```bash
   npm install -g @runway/cli
   ```

2. **Database**: Set up a PostgreSQL database (you can use Runway's managed database or external providers like:
   - Neon (recommended)
   - Supabase
   - Railway
   - PlanetScale

3. **Environment Variables**: Prepare your environment variables

## Step 1: Install Runway CLI

```bash
npm install -g @runway/cli
```

## Step 2: Login to Runway

```bash
runway login
```

## Step 3: Initialize Runway Project

```bash
runway init
```

## Step 4: Set Environment Variables

You'll need to set these environment variables in Runway:

### Required Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-app.runway.app"
NEXTAUTH_SECRET="your-secret-key"

# Email (if using email notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Stripe (if using payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Upload (if using file uploads)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"
```

## Step 5: Deploy to Runway

```bash
runway deploy
```

## Step 6: Run Database Migrations

After deployment, run your database migrations:

```bash
runway run npm run db:push
```

## Step 7: Seed Database (Optional)

If you want to seed your database with initial data:

```bash
runway run npm run db:seed
```

## Environment Variables Setup in Runway Dashboard

1. Go to your Runway dashboard
2. Navigate to your project
3. Go to Settings > Environment Variables
4. Add all the required environment variables listed above

## Database Setup Options

### Option 1: Runway Managed Database
- Create a new database in Runway dashboard
- Use the provided connection string

### Option 2: External Database (Recommended)
- **Neon**: Free tier available, great for PostgreSQL
- **Supabase**: Free tier available, includes auth
- **Railway**: Good for small projects
- **PlanetScale**: MySQL alternative

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Ensure Node.js version compatibility

2. **Database Connection Issues**:
   - Verify DATABASE_URL is correct
   - Check if database is accessible from Runway

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names

### Useful Commands:

```bash
# View logs
runway logs

# SSH into the deployment
runway ssh

# Check deployment status
runway status

# Rollback to previous deployment
runway rollback
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Application accessible via URL
- [ ] Database connection working
- [ ] Authentication working
- [ ] File uploads working (if applicable)
- [ ] Payment processing working (if applicable)

## Monitoring and Maintenance

- Monitor your application logs in Runway dashboard
- Set up alerts for errors
- Regularly update dependencies
- Monitor database performance
- Set up automated backups for your database

## Cost Optimization

- Use Runway's free tier for development
- Consider external database providers for better pricing
- Monitor resource usage in Runway dashboard
- Set up auto-scaling if needed 