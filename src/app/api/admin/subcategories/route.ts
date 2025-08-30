import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Subcategory name and category ID are required" }, { status: 400 });
    }

    // Check if subcategory already exists in this category
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: name,
        categoryId: categoryId,
      },
    });

    if (existingSubcategory) {
      return NextResponse.json(
        { error: "Subcategory already exists in this category" },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        description,
        categoryId,
        isActive: true,
      },
    });

    return NextResponse.json({ subcategory });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 }
    );
  }
}
