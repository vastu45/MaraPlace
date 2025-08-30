import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calendar/connections - Get all calendar connections for an agent
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // Verify the user is the agent or an admin
    if (session.user.role !== 'ADMIN' && session.user.agentProfile?.id !== agentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const connections = await prisma.calendarConnection.findMany({
      where: {
        agentId: agentId,
        isActive: true
      },
      select: {
        id: true,
        provider: true,
        name: true,
        calendarId: true,
        isActive: true,
        syncEnabled: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Error fetching calendar connections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/calendar/connections - Create a new calendar connection
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { agentId, provider, name, calendarId, accessToken, refreshToken, tokenExpiresAt } = body;

    if (!agentId || !provider || !name || !calendarId || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the user is the agent or an admin
    if (session.user.role !== 'ADMIN' && session.user.agentProfile?.id !== agentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if connection already exists
    const existingConnection = await prisma.calendarConnection.findUnique({
      where: {
        agentId_provider_calendarId: {
          agentId,
          provider,
          calendarId
        }
      }
    });

    if (existingConnection) {
      return NextResponse.json({ error: 'Calendar connection already exists' }, { status: 409 });
    }

    const connection = await prisma.calendarConnection.create({
      data: {
        agentId,
        provider,
        name,
        calendarId,
        accessToken,
        refreshToken,
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
        isActive: true,
        syncEnabled: true
      }
    });

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    console.error('Error creating calendar connection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
