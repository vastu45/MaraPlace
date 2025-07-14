import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { mkdir } from 'fs/promises';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Helper to save files locally
async function saveFile(file: File | null, type: string, uploadsDir: string) {
  if (!file) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split('.').pop();
  const filename = `${type}-${randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        agentProfile: {
          include: {
            documents: true,
          },
        },
      },
    });
    if (!user || !user.agentProfile) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    // Extract fields
    const name = formData.get('fullName') as string;
    const phone = formData.get('mobile') as string;
    const email = formData.get('email') as string;
    const abn = formData.get('abn') as string;
    const businessName = formData.get('businessName') as string;
    const businessEmail = formData.get('businessEmail') as string;
    const languages = formData.get('languages') as string;
    const areasOfPractice = formData.get('areasOfPractice') as string;
    const industries = formData.get('industries') as string;
    const officeAddress = formData.get('officeAddress') as string;
    const aboutCompany = formData.get('aboutCompany') as string;
    const marnOrLpn = formData.get('marnOrLpn') as string;
    const profilePicture = formData.get('profilePicture') as File | null;
    const businessLogo = formData.get('businessLogo') as File | null;

    // Save files if present
    const uploadsDir = process.cwd() + '/public/uploads';
    await mkdir(uploadsDir, { recursive: true });
    let photoUrl = null;
    let logoUrl = null;
    if (profilePicture) {
      photoUrl = await saveFile(profilePicture, 'photo', uploadsDir);
    }
    if (businessLogo) {
      logoUrl = await saveFile(businessLogo, 'businessLogo', uploadsDir);
    }

    // Update user
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        email,
      },
      select: { id: true },
    });

    // Update agent profile
    const agentProfile = await prisma.agentProfile.update({
      where: { userId: user.id },
      data: {
        businessName,
        businessEmail,
        businessAddress: officeAddress,
        maraNumber: marnOrLpn,
        bio: aboutCompany,
        languages: languages ? languages.split(',').map(l => l.trim()) : [],
        specializations: areasOfPractice ? areasOfPractice.split(',').map(a => a.trim()) : [],
        // industries removed (not in schema)
      },
    });

    // Save/replace documents if new files uploaded
    if (photoUrl) {
      await prisma.document.deleteMany({ where: { agentId: agentProfile.id, type: 'photo' } });
      await prisma.document.create({
        data: { agentId: agentProfile.id, type: 'photo', url: photoUrl, name: profilePicture?.name || '' },
      });
    }
    if (logoUrl) {
      await prisma.document.deleteMany({ where: { agentId: agentProfile.id, type: 'businessLogo' } });
      await prisma.document.create({
        data: { agentId: agentProfile.id, type: 'businessLogo', url: logoUrl, name: businessLogo?.name || '' },
      });
    }

    // Return updated profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        agentProfile: {
          include: { documents: true },
        },
      },
    });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
} 