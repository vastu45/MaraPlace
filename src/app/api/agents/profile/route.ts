import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        agentProfile: {
          include: {
            documents: true,
            profileUpdates: {
              where: { status: 'PENDING' },
              orderBy: { createdAt: 'desc' }
            }
          },
        },
      },
    });

    if (!user || !user.agentProfile) {
      return NextResponse.json({ error: "Agent profile not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      agent: user.agentProfile,
      pendingUpdates: user.agentProfile.profileUpdates
    });
  } catch (error) {
    console.error("Error fetching agent profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Find the agent profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        agentProfile: true,
      },
    });

    if (!user || !user.agentProfile) {
      return NextResponse.json({ error: "Agent profile not found" }, { status: 404 });
    }

    // Prepare the update data
    const updateData: any = {};
    const fieldsToUpdate = [
      'businessName', 'businessAddress', 'businessCity', 'businessState', 
      'businessPostcode', 'businessCountry', 'businessPhone', 'businessEmail',
      'businessWebsite', 'bio', 'specializations', 'languages', 'hourlyRate',
      'consultationFee', 'experience', 'qualifications', 'certifications',
      'defaultMeetingDuration', 'abn'
    ];

    // Check which fields have changed
    const changedFields: any = {};
    fieldsToUpdate.forEach(field => {
      if (body[field] !== undefined && body[field] !== user.agentProfile[field as keyof typeof user.agentProfile]) {
        changedFields[field] = body[field];
        updateData[field] = body[field];
      }
    });

    // If no fields have changed, return success
    if (Object.keys(changedFields).length === 0) {
      return NextResponse.json({ 
        message: "No changes detected",
        success: true 
      });
    }

    // Create a pending profile update
    const profileUpdate = await prisma.profileUpdate.create({
      data: {
        agentId: user.agentProfile.id,
        updatedFields: changedFields,
        status: 'PENDING'
      }
    });

    // Update user basic info immediately (name, phone, email) - these don't need approval
    const userUpdateData: any = {};
    if (body.name && body.name !== user.name) userUpdateData.name = body.name;
    if (body.phone && body.phone !== user.phone) userUpdateData.phone = body.phone;
    if (body.email && body.email !== user.email) userUpdateData.email = body.email;

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: userUpdateData,
      });
    }

    return NextResponse.json({ 
      message: "Profile update submitted for admin approval",
      success: true,
      updateId: profileUpdate.id,
      pendingFields: Object.keys(changedFields)
    });

  } catch (error) {
    console.error("Error updating agent profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}




