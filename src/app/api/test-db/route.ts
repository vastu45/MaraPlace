import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not found in environment variables',
        databaseUrl: 'NOT_SET'
      });
    }

    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const agentCount = await prisma.agentProfile.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      agentCount: agentCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      timestamp: new Date().toISOString()
    }, { status: 500 });

  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 