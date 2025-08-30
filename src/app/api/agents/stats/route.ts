import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current agent
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        agentProfile: {
          include: {
            bookings: {
              where: {
                status: {
                  in: ['COMPLETED', 'CONFIRMED']
                }
              }
            },
            reviews: true,
            _count: {
              select: {
                bookings: true,
                reviews: true
              }
            }
          }
        }
      }
    });

    if (!user || !user.agentProfile) {
      return NextResponse.json({ error: "Agent profile not found" }, { status: 404 });
    }

    const agent = user.agentProfile;

    // Calculate total earnings from completed bookings
    const totalEarnings = await prisma.booking.aggregate({
      where: {
        agentId: agent.id,
        status: 'COMPLETED'
      },
      _sum: {
        totalAmount: true
      }
    });

    // Get unique clients count
    const uniqueClients = await prisma.booking.groupBy({
      by: ['clientId'],
      where: {
        agentId: agent.id
      }
    });

    // Get recent bookings for charts
    const recentBookings = await prisma.booking.findMany({
      where: {
        agentId: agent.id,
        status: {
          in: ['COMPLETED', 'CONFIRMED']
        }
      },
      select: {
        date: true,
        totalAmount: true,
        status: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 100 // Last 100 bookings for chart data
    });

    // Calculate monthly data for charts
    const monthlyData = [];
    const currentDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const monthBookings = recentBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= month && bookingDate < nextMonth;
      });

      const monthRevenue = monthBookings.reduce((sum, booking) => {
        return sum + (booking.totalAmount || 0);
      }, 0);

      monthlyData.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        consultations: monthBookings.length,
        revenue: monthRevenue
      });
    }

    const stats = {
      totalEarnings: totalEarnings._sum.totalAmount || 0,
      totalBookings: agent._count.bookings,
      totalReviews: agent._count.reviews,
      totalCases: agent._count.bookings, // Using totalBookings as cases
      totalClients: uniqueClients.length,
      rating: agent.rating || 0,
      monthlyData
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching agent stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
