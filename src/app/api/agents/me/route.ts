import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";

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
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        agentProfile: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user basic info
    const name = formData.get("fullName") as string;
    const phone = formData.get("mobile") as string;
    const email = formData.get("email") as string;

    if (name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    if (phone) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    if (email && email !== user.email) {
      await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    }

    // Update or create agent profile
    const agentData: any = {};
    const fields = [
      "marnOrLpn",
      "abn",
      "businessName",
      "businessEmail",
      "languages",
      "specializations",
      "industries",
      "businessAddress",
      "bio",
    ];

    fields.forEach((field) => {
      const value = formData.get(field) as string;
      if (value) {
        if (field === "languages" || field === "specializations" || field === "industries") {
          agentData[field] = value.split(",").map((s) => s.trim());
        } else {
          agentData[field] = value;
        }
      }
    });

    // Handle file uploads
    const profilePicture = formData.get("profilePicture") as File;
    const businessLogo = formData.get("businessLogo") as File;

    if (profilePicture) {
      const bytes = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `profile_${user.id}_${Date.now()}.jpg`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // Save to database
      await prisma.document.upsert({
        where: {
          id: user.agentProfile?.documents?.find(d => d.type === "photo")?.id || "temp-id",
        },
        update: {
          url: `/uploads/${filename}`,
        },
        create: {
          agentId: user.agentProfile?.id || "",
          type: "photo",
          url: `/uploads/${filename}`,
          name: "Profile Photo",
        },
      });
    }

    if (businessLogo) {
      const bytes = await businessLogo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `logo_${user.id}_${Date.now()}.jpg`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // Save to database
      await prisma.document.upsert({
        where: {
          id: user.agentProfile?.documents?.find(d => d.type === "businessLogo")?.id || "temp-id-2",
        },
        update: {
          url: `/uploads/${filename}`,
        },
        create: {
          agentId: user.agentProfile?.id || "",
          type: "businessLogo",
          url: `/uploads/${filename}`,
          name: "Business Logo",
        },
      });
    }

    if (Object.keys(agentData).length > 0) {
      if (user.agentProfile) {
        await prisma.agentProfile.update({
          where: { id: user.agentProfile.id },
          data: agentData,
        });
      } else {
        await prisma.agentProfile.create({
          data: {
            ...agentData,
            userId: user.id,
          },
        });
      }
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        agentProfile: {
          include: {
            documents: true,
          },
        },
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 