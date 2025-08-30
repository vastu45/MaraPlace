import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calendar/outlook/auth - Initiate Outlook Calendar OAuth flow
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Outlook auth - Session:', session);
    
    if (!session?.user) {
      console.log('Outlook auth - No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    console.log('Outlook auth - Agent ID from URL:', agentId);
    
    // Get user role from session
    const userRole = (session.user as any).role;
    console.log('Outlook auth - User role:', userRole);

    if (!agentId) {
      console.log('Outlook auth - No agent ID provided');
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // If user is admin, allow access
    if (userRole === 'ADMIN') {
      console.log('Outlook auth - Admin access granted');
    } else {
      // For non-admin users, verify they own the agent profile
      const userId = (session.user as any).id;
      console.log('Outlook auth - User ID:', userId);
      
      const agentProfile = await prisma.agentProfile.findFirst({
        where: {
          id: agentId,
          userId: userId
        }
      });
      
      console.log('Outlook auth - Agent profile:', agentProfile);
      
      if (!agentProfile) {
        console.log('Outlook auth - Authorization failed: Agent profile not found or not owned by user');
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    console.log('Outlook auth - Authorization successful');

    const outlookClientId = process.env.OUTLOOK_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/outlook/callback`;

    if (!outlookClientId) {
      console.log('Outlook auth - No Outlook client ID configured');
      return NextResponse.json({ error: 'Outlook Calendar integration not configured' }, { status: 500 });
    }

    const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    authUrl.searchParams.set('client_id', outlookClientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Calendars.ReadWrite');
    authUrl.searchParams.set('response_mode', 'query');
    authUrl.searchParams.set('state', agentId); // Pass agentId in state parameter

    console.log('Outlook auth - Redirecting to:', authUrl.toString());
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating Outlook Calendar OAuth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
