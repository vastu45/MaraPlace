import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, parseISO, getDay, isToday } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("weekly") === "1") {
      // Return all weekly hours for the agent
      const weekly = await prisma.availability.findMany({
        where: { agentId: params.id },
        orderBy: { dayOfWeek: "asc" },
      });
      const weeklyHours = Array(7)
        .fill(null)
        .map((_, i) => {
          const day = weekly.filter((a) => a.dayOfWeek === i && a.isActive);
          if (day.length === 0) {
            return { day: i, unavailable: true, slots: [] };
          }
          return {
            day: i,
            unavailable: false,
            slots: day.map((a) => ({ start: a.startTime, end: a.endTime })),
          };
        });
      return NextResponse.json({ weeklyHours });
    }

    const dateParam = searchParams.get('date');
    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }
    const date = parseISO(dateParam);
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    
    console.log(`Requested date: ${dateParam}, parsed date: ${date.toISOString()}, day of week: ${dayOfWeek}`);
    // Get agent's availability for this day of the week and their default meeting duration
    const [availability, agentProfile] = await Promise.all([
      prisma.availability.findFirst({
        where: {
          agentId: params.id,
          dayOfWeek: dayOfWeek,
          isActive: true,
        },
      }),
      prisma.agentProfile.findUnique({
        where: { id: params.id },
        select: { defaultMeetingDuration: true },
      }),
    ]);
    if (!availability) {
      return NextResponse.json({ 
        timeSlots: [],
        message: 'Agent is not available on this day'
      });
    }
    // Get existing bookings for this date
    // Create start and end of day for proper date comparison
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingBookings = await prisma.booking.findMany({
      where: {
        agentId: params.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
      },
      select: {
        startTime: true,
        endTime: true,
        duration: true,
      },
    });
    
    console.log(`Found ${existingBookings.length} existing bookings for ${dateParam}:`, existingBookings);
    console.log(`Date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
    // Generate time slots based on agent's default meeting duration
    const timeSlots = [];
    const [startHour, startMinute] = availability.startTime.split(':').map(Number);
    const [endHour, endMinute] = availability.endTime.split(':').map(Number);
    
    // Use agent's default meeting duration, fallback to 30 minutes
    const slotDuration = agentProfile?.defaultMeetingDuration || 30;
    console.log(`Agent ${params.id} default meeting duration: ${slotDuration} minutes`);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if this time slot conflicts with existing bookings
      const isBooked = existingBookings.some(booking => {
        const bookingStart = booking.startTime;
        const bookingEnd = booking.endTime;
        
        // If the current time slot falls within any existing booking period, it's booked
        const conflicts = timeString >= bookingStart && timeString < bookingEnd;
        if (conflicts) {
          console.log(`Time slot ${timeString} conflicts with booking ${bookingStart}-${bookingEnd}`);
        }
        return conflicts;
      });
      
      // Check if this time slot is in the past (for today only)
      const isPastTime = isToday(date) && (() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        return timeString <= currentTime;
      })();
      
      if (isPastTime) {
        console.log(`Time slot ${timeString} is in the past for today`);
      }
      
      if (isBooked) {
        console.log(`Time slot ${timeString} is booked`);
      }
      
      timeSlots.push({
        time: timeString,
        available: !isBooked && !isPastTime,
      });
      
      if (isBooked) {
        console.log(`Time slot ${timeString} marked as booked`);
      } else if (isPastTime) {
        console.log(`Time slot ${timeString} marked as past time`);
      } else {
        console.log(`Time slot ${timeString} marked as available`);
      }
      
      // Move to next slot based on agent's default meeting duration
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (body.weeklyHours) {
      // Save weekly hours
      const weekly = body.weeklyHours;
      // Remove all existing weekly availabilities for this agent
      await prisma.availability.deleteMany({ where: { agentId: params.id } });
      // Add new ones
      for (const day of weekly) {
        if (!day.unavailable && day.slots.length > 0) {
          for (const slot of day.slots) {
            await prisma.availability.create({
              data: {
                agentId: params.id,
                dayOfWeek: day.day,
                startTime: slot.start,
                endTime: slot.end,
                isActive: true,
              },
            });
          }
        }
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error saving weekly hours:', error);
    return NextResponse.json({ error: 'Failed to save weekly hours' }, { status: 500 });
  }
} 