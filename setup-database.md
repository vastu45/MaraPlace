# Quick Database Setup Guide

## Option 1: Free Supabase Database (Recommended)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project

### Step 2: Get Database Connection String
1. In your Supabase project, go to Settings > Database
2. Copy the "Connection string" (URI format)
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

### Step 3: Create .env.local File
Create a file named `.env.local` in your project root with:

```env
DATABASE_URL="your-supabase-connection-string-here"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3004"
```

### Step 4: Push Database Schema
```bash
npx prisma db push
```

### Step 5: Create Sample Data
```bash
node scripts/create-test-agents.js
```

## Option 2: Local PostgreSQL

If you have PostgreSQL installed locally:

1. Create a database named `maraplace`
2. Update DATABASE_URL in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/maraplace"
   ```

## Option 3: Railway (Alternative Cloud)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Copy DATABASE_URL from the service

## After Setup

Once you have the database connected:

1. Run: `npx prisma db push`
2. Run: `node scripts/create-test-agents.js`
3. Restart your development server: `npm run dev`

The featured specialists will then show real data from your database! 