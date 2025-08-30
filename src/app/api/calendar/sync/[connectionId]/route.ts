import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/calendar/sync/[connectionId] - Sync calendar events
export async function POST(
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

    // Check if token is expired and refresh if needed
    if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
      if (!connection.refreshToken) {
        return NextResponse.json({ error: 'Token expired and no refresh token available' }, { status: 401 });
      }
      
      // Refresh the token (implementation depends on the provider)
      const refreshed = await refreshCalendarToken(connection);
      if (!refreshed) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
      }
    }

    // Fetch events from external calendar
    const events = await fetchCalendarEvents(connection);
    
    // Update last sync time
    await prisma.calendarConnection.update({
      where: { id: connectionId },
      data: { lastSyncAt: new Date() }
    });

    return NextResponse.json({ 
      events,
      message: `Synced ${events.length} events from ${connection.name}`,
      lastSyncAt: new Date()
    });
  } catch (error) {
    console.error('Error syncing calendar:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to refresh calendar tokens
async function refreshCalendarToken(connection: any) {
  try {
    switch (connection.provider) {
      case 'GOOGLE':
        return await refreshGoogleToken(connection);
      case 'APPLE':
        return await refreshAppleToken(connection);
      case 'OUTLOOK':
      case 'OFFICE365':
        return await refreshOutlookToken(connection);
      default:
        return false;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

// Helper function to fetch calendar events
async function fetchCalendarEvents(connection: any) {
  try {
    switch (connection.provider) {
      case 'GOOGLE':
        return await fetchGoogleCalendarEvents(connection);
      case 'APPLE':
        return await fetchAppleCalendarEvents(connection);
      case 'OUTLOOK':
      case 'OFFICE365':
        return await fetchOutlookCalendarEvents(connection);
      default:
        return [];
    }
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

// Google Calendar integration
async function refreshGoogleToken(connection: any) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: connection.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    
    await prisma.calendarConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: data.access_token,
        tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });

    return true;
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    return false;
  }
}

async function fetchGoogleCalendarEvents(connection: any) {
  try {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${connection.calendarId}/events?` +
      `timeMin=${now.toISOString()}&timeMax=${oneWeekFromNow.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    
    return data.items.map((event: any) => ({
      id: event.id,
      title: event.summary || 'No title',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description,
      location: event.location,
      provider: 'GOOGLE',
      calendarId: connection.calendarId
    }));
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
}

// Apple Calendar integration (simplified - would need proper CalDAV implementation)
async function refreshAppleToken(connection: any) {
  // Apple Calendar typically uses CalDAV, which doesn't use OAuth tokens
  // This is a placeholder for potential future implementation
  return true;
}

async function fetchAppleCalendarEvents(connection: any) {
  // This would require a proper CalDAV client implementation
  // For now, return mock data
  return [
    {
      id: 'apple-1',
      title: 'Apple Calendar Event',
      start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      description: 'Sample Apple Calendar event',
      location: 'Apple HQ',
      provider: 'APPLE',
      calendarId: connection.calendarId
    }
  ];
}

// Outlook/Office 365 integration
async function refreshOutlookToken(connection: any) {
  try {
    const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID!,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
        refresh_token: connection.refreshToken,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/Calendars.Read',
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    
    await prisma.calendarConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: data.access_token,
        tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });

    return true;
  } catch (error) {
    console.error('Error refreshing Outlook token:', error);
    return false;
  }
}

async function fetchOutlookCalendarEvents(connection: any) {
  try {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendars/${connection.calendarId}/events?` +
      `$filter=start/dateTime ge '${now.toISOString()}' and end/dateTime le '${oneWeekFromNow.toISOString()}'&$orderby=start/dateTime`,
      {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    
    return data.value.map((event: any) => ({
      id: event.id,
      title: event.subject || 'No title',
      start: event.start.dateTime,
      end: event.end.dateTime,
      description: event.body?.content,
      location: event.location?.displayName,
      provider: 'OUTLOOK',
      calendarId: connection.calendarId
    }));
  } catch (error) {
    console.error('Error fetching Outlook Calendar events:', error);
    return [];
  }
}
