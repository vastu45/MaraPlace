import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { updateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { updateId } = params;
    const body = await request.json();
    const { action, notes } = body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get the profile update
    const profileUpdate = await prisma.profileUpdate.findUnique({
      where: { id: updateId },
      include: {
        agent: true
      }
    });

    if (!profileUpdate) {
      return NextResponse.json({ error: "Profile update not found" }, { status: 404 });
    }

    if (profileUpdate.status !== 'PENDING') {
      return NextResponse.json({ error: "Profile update already processed" }, { status: 400 });
    }

    // Update the profile update status
    const updatedProfileUpdate = await prisma.profileUpdate.update({
      where: { id: updateId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        adminNotes: notes,
        reviewedBy: admin.id,
        reviewedAt: new Date()
      }
    });

    // If approved, apply the changes to the agent profile
    if (action === 'approve') {
      const updatedFields = profileUpdate.updatedFields as any;
      
      await prisma.agentProfile.update({
        where: { id: profileUpdate.agentId },
        data: updatedFields
      });
    }

    return NextResponse.json({ 
      message: `Profile update ${action}d successfully`,
      profileUpdate: updatedProfileUpdate
    });

  } catch (error) {
    console.error("Error processing profile update:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




