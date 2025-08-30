import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH /api/calendar/connections/[connectionId] - Update a calendar connection
export async function PATCH(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { connectionId } = params;
    const body = await request.json();
    const { syncEnabled, isActive, accessToken, refreshToken, tokenExpiresAt } = body;

    // Get the connection to verify ownership
    const connection = await prisma.calendarConnection.findUnique({
      where: { id: connectionId },
      include: { agent: true }
    });

    if (!connection) {
      return NextResponse.json({ error: 'Calendar connection not found' }, { status: 404 });
    }

    // Verify the user is the agent or an admin
    if (session.user.role !== 'ADMIN' && session.user.agentProfile?.id !== connection.agentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};
    if (syncEnabled !== undefined) updateData.syncEnabled = syncEnabled;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (accessToken) updateData.accessToken = accessToken;
    if (refreshToken) updateData.refreshToken = refreshToken;
    if (tokenExpiresAt) updateData.tokenExpiresAt = new Date(tokenExpiresAt);

    const updatedConnection = await prisma.calendarConnection.update({
      where: { id: connectionId },
      data: updateData,
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

    return NextResponse.json({ connection: updatedConnection });
  } catch (error) {
    console.error('Error updating calendar connection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/calendar/connections/[connectionId] - Delete a calendar connection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { connectionId } = params;

    // Get the connection to verify ownership
    const connection = await prisma.calendarConnection.findUnique({
      where: { id: connectionId },
      include: { agent: true }
    });

    if (!connection) {
      return NextResponse.json({ error: 'Calendar connection not found' }, { status: 404 });
    }

    // Verify the user is the agent or an admin
    if (session.user.role !== 'ADMIN' && session.user.agentProfile?.id !== connection.agentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.calendarConnection.delete({
      where: { id: connectionId }
    });

    return NextResponse.json({ message: 'Calendar connection deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar connection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
