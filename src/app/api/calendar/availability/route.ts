import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/calendar/availability - Check external calendar availability
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { agentId, startTime, endTime, date } = body;

    if (!agentId || !startTime || !endTime || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the user is the agent or an admin
    if (session.user.role !== 'ADMIN' && session.user.agentProfile?.id !== agentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all active calendar connections for the agent
    const connections = await prisma.calendarConnection.findMany({
      where: {
        agentId: agentId,
        isActive: true,
        syncEnabled: true
      }
    });

    if (connections.length === 0) {
      return NextResponse.json({ 
        available: true, 
        message: 'No external calendars connected' 
      });
    }

    const conflicts = [];
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Check each connected calendar for conflicts
    for (const connection of connections) {
      try {
        // Check if token is expired and refresh if needed
        if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
          if (!connection.refreshToken) {
            continue; // Skip this connection if no refresh token
          }
          
          const refreshed = await refreshCalendarToken(connection);
          if (!refreshed) {
            continue; // Skip this connection if refresh failed
          }
        }

        // Fetch events from external calendar for the specified time range
        const events = await fetchCalendarEvents(connection, startDateTime, endDateTime);
        
        // Check for conflicts
        for (const event of events) {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          
          // Check if there's any overlap
          if (eventStart < endDateTime && eventEnd > startDateTime) {
            conflicts.push({
              calendar: connection.name,
              provider: connection.provider,
              event: {
                title: event.title,
                start: event.start,
                end: event.end,
                description: event.description,
                location: event.location
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error checking calendar ${connection.name}:`, error);
        // Continue checking other calendars even if one fails
      }
    }

    const isAvailable = conflicts.length === 0;

    return NextResponse.json({
      available: isAvailable,
      conflicts: conflicts,
      message: isAvailable 
        ? 'Time slot is available in all connected calendars' 
        : `Found ${conflicts.length} conflict(s) in external calendars`
    });
  } catch (error) {
    console.error('Error checking calendar availability:', error);
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
async function fetchCalendarEvents(connection: any, startTime: Date, endTime: Date) {
  try {
    switch (connection.provider) {
      case 'GOOGLE':
        return await fetchGoogleCalendarEvents(connection, startTime, endTime);
      case 'APPLE':
        return await fetchAppleCalendarEvents(connection, startTime, endTime);
      case 'OUTLOOK':
      case 'OFFICE365':
        return await fetchOutlookCalendarEvents(connection, startTime, endTime);
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

async function fetchGoogleCalendarEvents(connection: any, startTime: Date, endTime: Date) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${connection.calendarId}/events?` +
      `timeMin=${startTime.toISOString()}&timeMax=${endTime.toISOString()}&singleEvents=true&orderBy=startTime`,
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

// Apple Calendar integration (simplified)
async function refreshAppleToken(connection: any) {
  // Apple Calendar typically uses CalDAV, which doesn't use OAuth tokens
  return true;
}

async function fetchAppleCalendarEvents(connection: any, startTime: Date, endTime: Date) {
  // This would require a proper CalDAV client implementation
  // For now, return empty array
  return [];
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
        scope: 'https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Calendars.ReadWrite',
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

async function fetchOutlookCalendarEvents(connection: any, startTime: Date, endTime: Date) {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendars/${connection.calendarId}/events?` +
      `$filter=start/dateTime ge '${startTime.toISOString()}' and end/dateTime le '${endTime.toISOString()}'&$orderby=start/dateTime`,
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
