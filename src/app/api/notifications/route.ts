import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addConnection, removeConnection } from "@/lib/notifications";
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents can subscribe to notifications
    if ((session.user as any).role !== 'AGENT') {
      return NextResponse.json({ error: 'Only agents can subscribe to notifications' }, { status: 403 });
    }

    const stream = new ReadableStream({
      start(controller) {
        // Store the connection
        addConnection((session.user as any).id, controller);
        
        // Send initial connection message
        const data = `data: ${JSON.stringify({ type: 'connected', message: 'Connected to notifications' })}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
        
        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          removeConnection((session.user as any).id);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('Error in notifications SSE:', error);
    return NextResponse.json({ error: 'Failed to establish notification connection' }, { status: 500 });
  }
} 
