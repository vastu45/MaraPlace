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
        clientProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response to match what the frontend expects
    const profile = {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.clientProfile?.dateOfBirth ? user.clientProfile.dateOfBirth.toISOString().split('T')[0] : "",
      nationality: user.clientProfile?.nationality || "",
      address: user.clientProfile?.address || "",
      city: user.clientProfile?.city || "",
      state: user.clientProfile?.state || "",
      postcode: user.clientProfile?.postcode || "",
      country: user.clientProfile?.country || "",
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching user:", error);
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        clientProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle password change if provided
    if (body.currentPassword && body.newPassword) {
      // Verify current password
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(body.currentPassword, user.password || '');
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(body.newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    // Update user basic info
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.email && body.email !== user.email) updateData.email = body.email;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    // Update client profile
    const clientData: any = {};
    const fields = [
      "address",
      "nationality",
      "city",
      "state",
      "postcode",
      "country"
    ];

    fields.forEach((field) => {
      if (body[field]) {
        clientData[field] = body[field];
      }
    });

    // Handle dateOfBirth separately to convert string to Date
    if (body.dateOfBirth) {
      clientData.dateOfBirth = new Date(body.dateOfBirth);
    }

    if (Object.keys(clientData).length > 0) {
      if (user.clientProfile) {
        await prisma.clientProfile.update({
          where: { id: user.clientProfile.id },
          data: clientData,
        });
      } else {
        await prisma.clientProfile.create({
          data: {
            ...clientData,
            userId: user.id,
          },
        });
      }
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        clientProfile: true,
      },
    });

    // Format the response to match what the frontend expects
    const profile = {
      name: updatedUser?.name || "",
      email: updatedUser?.email || "",
      phone: updatedUser?.phone || "",
      dateOfBirth: updatedUser?.clientProfile?.dateOfBirth ? updatedUser.clientProfile.dateOfBirth.toISOString().split('T')[0] : "",
      nationality: updatedUser?.clientProfile?.nationality || "",
      address: updatedUser?.clientProfile?.address || "",
      city: updatedUser?.clientProfile?.city || "",
      state: updatedUser?.clientProfile?.state || "",
      postcode: updatedUser?.clientProfile?.postcode || "",
      country: updatedUser?.clientProfile?.country || "",
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
