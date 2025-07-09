import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const agent = await prisma.agentProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true, phone: true } },
        documents: true,
        services: true,
        reviews: {
          where: { isPublic: true },
          select: { rating: true, comment: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        _count: { select: { reviews: true, bookings: true } },
      },
    });
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    const avgRating = agent.reviews.length > 0
      ? agent.reviews.reduce((sum, review) => sum + review.rating, 0) / agent.reviews.length
      : agent.rating || 0;
    return NextResponse.json({
      agent: {
        id: agent.id,
        userId: agent.userId,
        name: agent.user.name,
        email: agent.user.email,
        phone: agent.user.phone,
        image: agent.user.image,
        maraNumber: agent.maraNumber,
        maraVerified: agent.maraVerified,
        businessName: agent.businessName,
        businessCity: agent.businessCity,
        businessState: agent.businessState,
        businessAddress: agent.businessAddress,
        bio: agent.bio,
        calendlyUrl: agent.calendlyUrl,
        specializations: agent.specializations,
        languages: agent.languages,
        hourlyRate: agent.hourlyRate,
        consultationFee: agent.consultationFee,
        experience: agent.experience,
        rating: avgRating,
        totalReviews: agent._count.reviews,
        totalBookings: agent._count.bookings,
        services: agent.services,
        recentReviews: agent.reviews,
        documents: agent.documents,
        status: agent.status,
      }
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if this is a status update (original functionality)
    if (body.status || body.suspendReason !== undefined || body.calendlyUrl !== undefined) {
      const { status, suspendReason, calendlyUrl } = body;
      const data: any = {};
      
      if (status) {
        if (!['APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
          return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        data.status = status;
        if (status === 'SUSPENDED') {
          data.suspendReason = suspendReason || '';
        } else {
          data.suspendReason = null;
        }
      }
      
      if (typeof calendlyUrl !== 'undefined') {
        data.calendlyUrl = calendlyUrl;
      }
      
      const updated = await prisma.agentProfile.update({
        where: { id: params.id },
        data,
      });
      
      return NextResponse.json({ agent: updated });
    }
    
    // This is a full agent detail update (new functionality)
    const {
      name,
      email,
      phone,
      businessName,
      businessAddress,
      maraNumber,
      bio,
      calendlyUrl,
    } = body;

    // First, fetch the AgentProfile to get userId
    const agentProfile = await prisma.agentProfile.findUnique({ where: { id: params.id } });
    if (!agentProfile) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    // Update User record
    const updatedUser = await prisma.user.update({
      where: { id: agentProfile.userId },
      data: {
        name,
        email,
        phone,
      },
    });
    // Update AgentProfile record
    const updatedAgent = await prisma.agentProfile.update({
      where: { id: params.id },
      data: {
        businessName,
        businessAddress,
        maraNumber,
        bio,
        calendlyUrl,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      agent: updatedAgent,
    });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
} 