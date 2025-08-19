import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    console.log('Session user:', session?.user);
    console.log('Session user email:', session?.user?.email);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    if (!session?.user?.email) {
      console.log('Authentication failed: No session or no user email');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Booking API request body:', body);
    const {
      agentId,
      serviceId,
      date,
      startTime,
      endTime,
      duration,
      notes,
      meetingType,
      totalAmount,
      name,
      email,
      phone,
    } = body;

    // Validate required fields
    if (!agentId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the client user
    const client = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log('Client from DB:', client);

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Check if the agent exists and is available
    const agent = await prisma.agentProfile.findUnique({
      where: { id: agentId },
      include: { user: true },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (!agent.isAvailable) {
      return NextResponse.json({ error: 'Agent is not available for bookings' }, { status: 400 });
    }

    // Check for booking conflicts
    console.log(`Checking for conflicts: agentId=${agentId}, date=${date}, startTime=${startTime}, endTime=${endTime}`);
    
    // Create start and end of day for proper date comparison
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        agentId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          }
        ]
      }
    });

    if (conflictingBooking) {
      console.log(`Conflict found: existing booking ${conflictingBooking.id} from ${conflictingBooking.startTime} to ${conflictingBooking.endTime}`);
      return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 });
    }
    
    console.log('No conflicts found, proceeding with booking');
    console.log(`Date range for conflict check: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    // Calculate commission (10% platform fee)
    const commission = totalAmount ? totalAmount * 0.1 : null;

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        agentId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        duration: typeof duration !== 'undefined' && duration !== null ? duration : null,
        notes,
        meetingType,
        totalAmount: typeof totalAmount !== 'undefined' && totalAmount !== null ? totalAmount : null as any,
        commission: typeof commission !== 'undefined' && commission !== null ? commission : null as any,
        // Store client contact information from form
        clientName: name || client.name,
        clientEmail: email || client.email,
        clientPhone: phone || client.phone,
        status: 'PENDING',
        seenByAgent: false, // Explicitly set to false for new bookings
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          }
        },
        agent: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        },
        service: true,
      }
    });

    // Create a payment record only if totalAmount is provided
    if (totalAmount) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          clientId: client.id,
          amount: totalAmount,
          status: 'PENDING',
          method: 'CREDIT_CARD', // Default, will be updated when payment is processed
        }
      });
    }

    // Send real-time notification to the agent
    try {
      const { sendNotificationToAgent } = await import('@/lib/notifications');
      sendNotificationToAgent(agent.userId, {
        type: 'new_booking',
        booking: {
          id: booking.id,
          clientName: booking.clientName || booking.client.name,
          date: booking.date,
          startTime: booking.startTime,
          serviceName: booking.service?.name || 'General Consultation',
        },
        message: `New booking from ${booking.clientName || booking.client.name}`,
      });
    } catch (error) {
      console.error('Failed to send real-time notification:', error);
    }

    return NextResponse.json({ 
      booking,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/bookings called');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    console.log('Session user:', session?.user);
    
    if (!session?.user?.email) {
      console.log('No session or user email');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log('User from DB:', user);

    if (!user) {
      console.log('User not found in DB');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let bookings;
    
    // If user is an agent, get their bookings
    if ((session.user as any)?.role === 'AGENT') {
      console.log('User is an agent, fetching agent bookings');
      const agentProfile = await prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      
      if (!agentProfile) {
        console.log('Agent profile not found');
        return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
      }

      bookings = await prisma.booking.findMany({
        where: { agentId: agentProfile.id },
        include: {
          client: {
            select: {
              name: true,
              email: true,
            }
          },
          agent: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          },
          service: true,
        },
        orderBy: { date: 'desc' },
      });
    } else {
      // If user is a client, get their bookings
      console.log('User is a client, fetching client bookings for clientId:', user.id);
      bookings = await prisma.booking.findMany({
        where: { clientId: user.id },
        include: {
          client: {
            select: {
              name: true,
              email: true,
            }
          },
          agent: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          },
          service: true,
        },
        orderBy: { date: 'desc' },
      });
    }

    console.log('Found bookings:', bookings);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Mark all bookings for the current agent as seen
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    // Only agents can mark as seen
    if ((session.user as any).role !== 'AGENT') {
      return NextResponse.json({ error: 'Only agents can mark bookings as seen' }, { status: 403 });
    }
    // Find agent profile
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const agentProfile = await prisma.agentProfile.findUnique({ where: { userId: user.id } });
    if (!agentProfile) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
    }
    // Mark all PENDING bookings as seen
    const result = await prisma.booking.updateMany({
      where: {
        agentId: agentProfile.id,
        seenByAgent: false,
      },
      data: {
        seenByAgent: true,
      },
    });
    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error('Error marking bookings as seen:', error);
    return NextResponse.json({ error: 'Failed to mark bookings as seen' }, { status: 500 });
  }
} 
