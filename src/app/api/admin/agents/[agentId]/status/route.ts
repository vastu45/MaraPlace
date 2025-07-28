import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
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

    const { status, suspendReason } = await request.json();

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update agent status
    const updatedAgent = await prisma.agentProfile.update({
      where: { id: params.agentId },
      data: { 
        status,
        ...(status === 'SUSPENDED' && suspendReason ? { suspendReason } : {})
      },
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
      }
    });

    return NextResponse.json({
      message: 'Agent status updated successfully',
      agent: {
        id: updatedAgent.id,
        name: updatedAgent.user.name,
        email: updatedAgent.user.email,
        phone: updatedAgent.user.phone,
        businessName: updatedAgent.businessName,
        businessAddress: updatedAgent.businessAddress,
        abn: updatedAgent.abn,
        maraNumber: updatedAgent.maraNumber,
        status: updatedAgent.status,
        calendlyUrl: updatedAgent.calendlyUrl,
        documents: updatedAgent.documents,
        createdAt: updatedAgent.user.createdAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('Error updating agent status:', error);
    return NextResponse.json(
      { error: 'Failed to update agent status' },
      { status: 500 }
    );
  }
} 