import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get current month for revenue calculation
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch all statistics
    const [
      totalUsers,
      totalAgents,
      totalClients,
      pendingAgents,
      suspendedUsers,
      totalRevenue,
      monthlyRevenue,
      pendingVerifications
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total agents
      prisma.user.count({
        where: { role: 'AGENT' }
      }),
      
      // Total clients
      prisma.user.count({
        where: { role: 'CLIENT' }
      }),
      
      // Pending agents
      prisma.agentProfile.count({
        where: { status: 'PENDING' }
      }),
      
      // Suspended users (you might need to add a status field to User model)
      prisma.user.count({
        where: { 
          OR: [
            { agentProfile: { status: 'SUSPENDED' } },
            { clientProfile: { /* add suspended status if needed */ } }
          ]
        }
      }),
      
      // Total revenue (from payments)
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      
      // Monthly revenue
      prisma.payment.aggregate({
        where: { 
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { amount: true }
      }),
      
      // Pending verifications (documents that need verification)
      prisma.document.count({
        where: { 
          isVerified: false,
          type: { in: ['maraCertificate', 'businessRegistration', 'photo'] }
        }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalAgents,
      totalClients,
      pendingAgents,
      suspendedUsers: suspendedUsers || 0, // Fallback if no suspended status
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      pendingVerifications
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 