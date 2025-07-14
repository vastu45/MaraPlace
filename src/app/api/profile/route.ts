import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, currentPassword, newPassword } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true, email: true, password: true } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password required to set a new password.' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password || '');
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = { name, email };
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });
    return NextResponse.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 