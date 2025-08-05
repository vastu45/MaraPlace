# Database Setup Guide

## To fetch real data from the database, follow these steps:

### 1. Set up Database Connection

Create a `.env.local` file in the root directory with your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/maraplace"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Options

**Option A: Local PostgreSQL**
- Install PostgreSQL locally
- Create a database named `maraplace`
- Update DATABASE_URL with your local credentials

**Option B: Supabase (Recommended)**
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Get your connection string from Settings > Database
- Update DATABASE_URL with your Supabase connection string

**Option C: Railway**
- Go to [railway.app](https://railway.app)
- Create a new project
- Add PostgreSQL service
- Copy the DATABASE_URL from the PostgreSQL service

### 3. Push Database Schema

```bash
npx prisma db push
```

### 4. Create Sample Data

```bash
node scripts/create-test-agents.js
```

### 5. Verify Data

```bash
node scripts/check-agents.js
```

## Current Status

The application is currently showing sample data because:
- No DATABASE_URL is configured
- Database connection is not established

Once you set up the database connection, the featured specialists will automatically fetch real data from the `agentProfile` and `User` tables.

## Database Tables Used

- **User**: Contains basic user information (name, email, phone, image)
- **AgentProfile**: Contains agent-specific data (business info, MARA number, ratings, etc.)

The API automatically joins these tables to provide complete agent information for the featured specialists section. 