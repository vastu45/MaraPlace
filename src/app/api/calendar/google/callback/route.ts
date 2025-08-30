import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calendar/google/callback - Handle Google Calendar OAuth callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This contains the agentId
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=${error}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=missing_params`);
    }

    const agentId = state;

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/calendar/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Google token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get user's calendar list to find the primary calendar
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!calendarResponse.ok) {
      console.error('Failed to fetch calendar list:', await calendarResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=calendar_list_failed`);
    }

    const calendarData = await calendarResponse.json();
    const primaryCalendar = calendarData.items.find((cal: any) => cal.primary) || calendarData.items[0];

    if (!primaryCalendar) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=no_calendar_found`);
    }

    // Check if connection already exists
    const existingConnection = await prisma.calendarConnection.findUnique({
      where: {
        agentId_provider_calendarId: {
          agentId,
          provider: 'GOOGLE',
          calendarId: primaryCalendar.id
        }
      }
    });

    if (existingConnection) {
      // Update existing connection with new tokens
      await prisma.calendarConnection.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || existingConnection.refreshToken,
          tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          lastSyncAt: new Date()
        }
      });
    } else {
      // Create new connection
      await prisma.calendarConnection.create({
        data: {
          agentId,
          provider: 'GOOGLE',
          name: primaryCalendar.summary || 'Google Calendar',
          calendarId: primaryCalendar.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          isActive: true,
          syncEnabled: true
        }
      });
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_success=google_connected`);
  } catch (error) {
    console.error('Error handling Google Calendar callback:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=callback_failed`);
  }
}
