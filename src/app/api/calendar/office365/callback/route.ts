import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calendar/office365/callback - Handle Office 365 Calendar OAuth callback
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
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID!,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/calendar/office365/callback`,
        scope: 'https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Calendars.ReadWrite',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Office 365 token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get user's calendar list
    const calendarResponse = await fetch('https://graph.microsoft.com/v1.0/me/calendars', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!calendarResponse.ok) {
      console.error('Failed to fetch calendar list:', await calendarResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=calendar_list_failed`);
    }

    const calendarData = await calendarResponse.json();
    const primaryCalendar = calendarData.value.find((cal: any) => cal.isDefaultCalendar) || calendarData.value[0];

    if (!primaryCalendar) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=no_calendar_found`);
    }

    // Check if connection already exists
    const existingConnection = await prisma.calendarConnection.findUnique({
      where: {
        agentId_provider_calendarId: {
          agentId,
          provider: 'OFFICE365',
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
          provider: 'OFFICE365',
          name: primaryCalendar.name || 'Office 365 Calendar',
          calendarId: primaryCalendar.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          isActive: true,
          syncEnabled: true
        }
      });
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_success=office365_connected`);
  } catch (error) {
    console.error('Error handling Office 365 Calendar callback:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/agents/dashboard?calendar_error=callback_failed`);
  }
}
