import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log('Admin agents API called');
    const session = await getServerSession(authOptions);
    
    console.log('Session:', session);
    
    if (!session?.user?.email) {
      console.log('No session or email');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    console.log('User found:', user);

    if (!user || user.role !== 'ADMIN') {
      console.log('User not admin:', user?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'All') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { maraNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch agents with pagination
    const [agents, total] = await Promise.all([
      prisma.agentProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              createdAt: true,
            }
          },
          documents: {
            select: {
              id: true,
              type: true,
              url: true,
              name: true,
              isVerified: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.agentProfile.count({ where })
    ]);

    // Format the response
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.user.name,
      email: agent.user.email,
      phone: agent.user.phone,
      businessName: agent.businessName,
      businessAddress: agent.businessAddress,
      abn: agent.abn,
      maraNumber: agent.maraNumber,
      status: agent.status,
      calendlyUrl: agent.calendlyUrl,
      documents: agent.documents,
      createdAt: agent.user.createdAt.toISOString(),
    }));

    console.log('Returning agents:', formattedAgents.length);
    return NextResponse.json({
      agents: formattedAgents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    });

  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
} 