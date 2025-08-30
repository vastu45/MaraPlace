import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
export const dynamic = 'force-dynamic';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

// Helper to save files locally
async function saveFile(file: File | null, type: string, uploadsDir: string, savedFiles: { type: string; url: string; name: string }[]) {
  if (!file) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split('.').pop();
  const filename = `${type}-${randomUUID()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);
  await writeFile(filePath, buffer);
  savedFiles.push({ type, url: `/uploads/${filename}`, name: file.name });
  return `/uploads/${filename}`;
}

export async function GET(request: NextRequest) {
  try {
    // Check if database is connected
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found in environment variables');
      return NextResponse.json(
        { error: 'Database configuration not found' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const visaType = searchParams.get('visaType')
    const location = searchParams.get('location')
    const language = searchParams.get('language')
    const maraNumber = searchParams.get('maraNumber')
    const minRating = searchParams.get('minRating')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {
      status: status || 'APPROVED',
      isAvailable: true,
    }

    if (visaType) {
      where.specializations = {
        has: visaType
      }
    }

    if (location) {
      where.OR = [
        { businessCity: { contains: location, mode: 'insensitive' } },
        { businessState: { contains: location, mode: 'insensitive' } },
      ]
    }

    if (language) {
      where.languages = {
        has: language
      }
    }

    if (maraNumber) {
      where.maraNumber = {
        contains: maraNumber,
        mode: 'insensitive'
      }
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating)
      }
    }

    if (maxPrice) {
      where.OR = [
        { hourlyRate: { lte: parseFloat(maxPrice) } },
        { consultationFee: { lte: parseFloat(maxPrice) } }
      ]
    }

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (connectionError) {
      console.error('Database connection failed:', connectionError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Fetch agents with pagination
    const [agents, total] = await Promise.all([
      prisma.agentProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
            }
          },
          documents: true,
          services: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
            }
          },
          reviews: {
            where: { isPublic: true },
            select: {
              rating: true,
              comment: true,
              createdAt: true,
            }
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
            }
          }
        },
        orderBy: [
          { rating: 'desc' },
          { totalReviews: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.agentProfile.count({ where })
    ])

    // Calculate average ratings and format response
    const formattedAgents = agents.map((agent: any) => {
      const avgRating = agent.reviews.length > 0
        ? agent.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / agent.reviews.length
        : agent.rating || 0

      // Debug: Log image information for each agent
      const userImage = agent.user.image;
      const photoDoc = agent.documents.find((doc: any) => doc.type === 'photo');
      const finalImage = userImage || photoDoc?.url || null;
      
      console.log('Agent Image Debug:', {
        name: agent.user.name,
        userImage,
        photoDoc: photoDoc?.url,
        finalImage,
        documents: agent.documents.map((doc: any) => ({ type: doc.type, url: doc.url }))
      });

      return {
        id: agent.id,
        userId: agent.userId,
        name: agent.user.name,
        email: agent.user.email,
        phone: agent.user.phone,
        image: finalImage,
        maraNumber: agent.maraNumber,
        maraVerified: agent.maraVerified,
        businessName: agent.businessName,
        businessCity: agent.businessCity,
        businessState: agent.businessState,
        businessAddress: agent.businessAddress,
        abn: agent.abn,
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
        recentReviews: agent.reviews.slice(0, 3),
        documents: agent.documents,
        status: agent.status,
      }
    })

    return NextResponse.json({
      agents: formattedAgents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    })

  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const businessName = formData.get('businessName') as string;
    const abn = formData.get('abn') as string;
    const maraOrLawyerNumber = formData.get('maraOrLawyerNumber') as string;
    const businessAddress = formData.get('businessAddress') as string;
    const photo = formData.get('photo') as File | null;
    const businessRegistration = formData.get('businessRegistration') as File | null;
    const maraCertificate = formData.get('maraCertificate') as File | null;
    const calendlyUrl = formData.get('calendlyUrl') as string;
    const businessLogo = formData.get('businessLogo') as File | null;

    // Debug: Log received fields
    console.log('Received form data:', {
      name: !!name,
      email: !!email,
      password: !!password,
      phone: !!phone,
      businessName: !!businessName,
      abn: !!abn,
      maraOrLawyerNumber: !!maraOrLawyerNumber,
      businessAddress: !!businessAddress
    });

    // Basic validation
    if (!name || !email || !password || !phone || !businessName || !abn || !maraOrLawyerNumber || !businessAddress) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!phone) missingFields.push('phone');
      if (!businessName) missingFields.push('businessName');
      if (!abn) missingFields.push('abn');
      if (!maraOrLawyerNumber) missingFields.push('maraOrLawyerNumber');
      if (!businessAddress) missingFields.push('businessAddress');
      
      return NextResponse.json({ 
        error: 'Missing required fields',
        missingFields 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save files locally if present
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const savedFiles: { type: string; url: string; name: string }[] = [];
    const photoUrl = await saveFile(photo, 'photo', uploadsDir, savedFiles);
    const businessRegUrl = await saveFile(businessRegistration, 'businessReg', uploadsDir, savedFiles);
    const maraCertUrl = await saveFile(maraCertificate, 'maraCert', uploadsDir, savedFiles);
    const businessLogoUrl = await saveFile(businessLogo, 'businessLogo', uploadsDir, savedFiles);

    // Create User and AgentProfile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'AGENT',
        agentProfile: {
          create: {
            maraNumber: maraOrLawyerNumber,
            businessName,
            businessAddress,
            businessCity: formData.get('businessCity') as string || undefined,
            businessState: formData.get('businessState') as string || undefined,
            businessPostcode: formData.get('businessPostcode') as string || undefined,
            businessCountry: formData.get('businessCountry') as string || undefined,
            businessPhone: formData.get('businessPhone') as string || undefined,
            businessEmail: formData.get('businessEmail') as string || undefined,
            businessWebsite: formData.get('businessWebsite') as string || undefined,
            calendlyUrl,
            bio: formData.get('bio') as string || '',
            specializations: formData.get('specializations') ? (formData.get('specializations') as string).split(',').map(s => s.trim()) : [],
            languages: formData.get('languages') ? (formData.get('languages') as string).split(',').map(l => l.trim()) : [],
            hourlyRate: formData.get('hourlyRate') ? parseFloat(formData.get('hourlyRate') as string) : undefined,
            consultationFee: formData.get('consultationFee') ? parseFloat(formData.get('consultationFee') as string) : undefined,
            experience: formData.get('experience') ? parseInt(formData.get('experience') as string, 10) : undefined,
            qualifications: formData.get('qualifications') ? (formData.get('qualifications') as string).split(',').map(q => q.trim()) : [],
            certifications: formData.get('certifications') ? (formData.get('certifications') as string).split(',').map(c => c.trim()) : [],
            abn,
            status: 'PENDING',
            isAvailable: true,
            defaultMeetingDuration: formData.get('defaultMeetingDuration') ? parseInt(formData.get('defaultMeetingDuration') as string, 10) : undefined,
          },
        },
      },
    });
    // Save Document records for uploaded files
    const agentProfile = await prisma.agentProfile.findUnique({ where: { userId: user.id } });
    if (agentProfile) {
      for (const file of savedFiles) {
        await prisma.document.create({
          data: {
            agentId: agentProfile.id,
            type: file.type,
            url: file.url,
            name: file.name,
          },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering agent:', error);
    return NextResponse.json({ 
      error: 'Failed to register agent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
