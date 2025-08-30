import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/calendar/events - Add booking event to external calendars
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      agentId, 
      bookingId, 
      title, 
      description, 
      startTime, 
      endTime, 
      date, 
      location,
      clientName,
      clientEmail 
    } = body;

    if (!agentId || !bookingId || !title || !startTime || !endTime || !date) {
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
        success: true, 
        message: 'No external calendars connected' 
      });
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    
    // Prepare event data
    const eventData = {
      summary: title,
      description: description || `Booking with ${clientName || 'client'}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Australia/Sydney'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Australia/Sydney'
      },
      location: location || 'Online',
      attendees: clientEmail ? [{ email: clientEmail }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    const results = [];

    // Add event to each connected calendar
    for (const connection of connections) {
      try {
        // Check if token is expired and refresh if needed
        if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
          if (!connection.refreshToken) {
            results.push({
              calendar: connection.name,
              provider: connection.provider,
              success: false,
              error: 'Token expired and no refresh token available'
            });
            continue;
          }
          
          const refreshed = await refreshCalendarToken(connection);
          if (!refreshed) {
            results.push({
              calendar: connection.name,
              provider: connection.provider,
              success: false,
              error: 'Failed to refresh token'
            });
            continue;
          }
        }

        // Add event to external calendar
        const eventId = await addEventToCalendar(connection, eventData);
        
        if (eventId) {
          results.push({
            calendar: connection.name,
            provider: connection.provider,
            success: true,
            eventId: eventId
          });
        } else {
          results.push({
            calendar: connection.name,
            provider: connection.provider,
            success: false,
            error: 'Failed to create event'
          });
        }
      } catch (error) {
        console.error(`Error adding event to calendar ${connection.name}:`, error);
        results.push({
          calendar: connection.name,
          provider: connection.provider,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successfulAdds = results.filter(r => r.success).length;
    const totalCalendars = connections.length;

    return NextResponse.json({
      success: successfulAdds > 0,
      results: results,
      message: `Event added to ${successfulAdds} out of ${totalCalendars} calendars`
    });
  } catch (error) {
    console.error('Error adding event to calendars:', error);
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

// Helper function to add event to calendar
async function addEventToCalendar(connection: any, eventData: any) {
  try {
    switch (connection.provider) {
      case 'GOOGLE':
        return await addEventToGoogleCalendar(connection, eventData);
      case 'APPLE':
        return await addEventToAppleCalendar(connection, eventData);
      case 'OUTLOOK':
      case 'OFFICE365':
        return await addEventToOutlookCalendar(connection, eventData);
      default:
        return null;
    }
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    return null;
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

async function addEventToGoogleCalendar(connection: any, eventData: any) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${connection.calendarId}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      console.error('Google Calendar API error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    return null;
  }
}

// Apple Calendar integration (simplified)
async function refreshAppleToken(connection: any) {
  // Apple Calendar typically uses CalDAV, which doesn't use OAuth tokens
  return true;
}

async function addEventToAppleCalendar(connection: any, eventData: any) {
  // This would require a proper CalDAV client implementation
  // For now, return null
  return null;
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

async function addEventToOutlookCalendar(connection: any, eventData: any) {
  try {
    // Convert Google Calendar format to Outlook format
    const outlookEventData = {
      subject: eventData.summary,
      body: {
        contentType: 'HTML',
        content: eventData.description
      },
      start: {
        dateTime: eventData.start.dateTime,
        timeZone: eventData.start.timeZone
      },
      end: {
        dateTime: eventData.end.dateTime,
        timeZone: eventData.end.timeZone
      },
      location: {
        displayName: eventData.location
      },
      attendees: eventData.attendees,
      reminderMinutesBeforeStart: 30
    };

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendars/${connection.calendarId}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outlookEventData),
      }
    );

    if (!response.ok) {
      console.error('Outlook Calendar API error:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding event to Outlook Calendar:', error);
    return null;
  }
}
