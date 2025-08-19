import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause based on user role
    const where: any = { id: params.bookingId };
    
    if (user.role === 'CLIENT') {
      where.clientId = user.id;
    } else if (user.role === 'AGENT') {
      const agentProfile = await prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (agentProfile) {
        where.agentId = agentProfile.id;
      }
    }
    // Admin can see all bookings

    const booking = await prisma.booking.findUnique({
      where,
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
        payments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, date, startTime, endTime } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has permission to update this booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        agent: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only the agent, client, or admin can update the booking
    const canUpdate = 
      user.role === 'ADMIN' ||
      booking.clientId === user.id ||
      booking.agent.userId === user.id;

    if (!canUpdate) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
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

    return NextResponse.json({ booking: updatedBooking });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if booking exists and user has permission to delete it
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        agent: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only the agent, client, or admin can delete the booking
    const canDelete = 
      user.role === 'ADMIN' ||
      booking.clientId === user.id ||
      booking.agent.userId === user.id;

    if (!canDelete) {
      return NextResponse.json({ error: 'Unauthorized to delete this booking' }, { status: 403 });
    }

    // Check if booking can be deleted (not completed or too close to start time)
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const timeUntilBooking = bookingDate.getTime() - now.getTime();
    const hoursUntilBooking = timeUntilBooking / (1000 * 60 * 60);

    if (booking.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Cannot delete completed bookings' }, { status: 400 });
    }

    if (hoursUntilBooking < 1) {
      return NextResponse.json({ error: 'Cannot delete bookings less than 1 hour before start time' }, { status: 400 });
    }

    // Delete related records first (payments, messages, etc.)
    await prisma.payment.deleteMany({
      where: { bookingId: params.bookingId }
    });

    await prisma.message.deleteMany({
      where: { bookingId: params.bookingId }
    });

    // Delete the booking
    await prisma.booking.delete({
      where: { id: params.bookingId }
    });

    return NextResponse.json({ 
      message: 'Booking deleted successfully',
      deletedBookingId: params.bookingId
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
} 