import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calendar/office365/auth - Initiate Office 365 Calendar OAuth flow
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

    // Get user role from session
    const userRole = (session.user as any).role;

    // If user is admin, allow access
    if (userRole === 'ADMIN') {
      // Admin access granted
    } else {
      // For non-admin users, verify they own the agent profile
      const userId = (session.user as any).id;
      
      const agentProfile = await prisma.agentProfile.findFirst({
        where: {
          id: agentId,
          userId: userId
        }
      });
      
      if (!agentProfile) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const outlookClientId = process.env.OUTLOOK_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/office365/callback`;

    if (!outlookClientId) {
      return NextResponse.json({ error: 'Office 365 Calendar integration not configured' }, { status: 500 });
    }

    const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    authUrl.searchParams.set('client_id', outlookClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Calendars.ReadWrite');
    authUrl.searchParams.set('response_mode', 'query');
    authUrl.searchParams.set('state', agentId); // Pass agentId in state parameter

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating Office 365 Calendar OAuth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
