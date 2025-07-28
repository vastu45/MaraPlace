import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { status } = await request.json();

    // Validate status
    if (!['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Prevent admin from suspending themselves
    if (params.userId === adminUser.id && status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Cannot suspend your own account' }, { status: 400 });
    }

    // Get the user to check if they have an agent profile
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: { agentProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update status based on user type
    if (user.role === 'AGENT' && user.agentProfile) {
      // Update agent profile status
      await prisma.agentProfile.update({
        where: { id: user.agentProfile.id },
        data: { status }
      });
    } else {
      // For clients, we might need to add a status field to User model
      // For now, we'll only handle agent status updates
      return NextResponse.json({ error: 'Status updates only available for agents' }, { status: 400 });
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        agentProfile: {
          select: {
            businessName: true,
            maraNumber: true,
            status: true,
          }
        },
        clientProfile: {
          select: {
            city: true,
            country: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'User status updated successfully',
      user: {
        id: updatedUser!.id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        phone: updatedUser!.phone,
        role: updatedUser!.role,
        createdAt: updatedUser!.createdAt.toISOString(),
        status: updatedUser!.agentProfile?.status || 'ACTIVE',
        agentProfile: updatedUser!.agentProfile,
        clientProfile: updatedUser!.clientProfile,
      }
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
} 