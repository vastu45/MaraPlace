import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all services for an agent
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const services = await prisma.service.findMany({
      where: { agentId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST - Create a new service for an agent
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { name, description, price, duration, isActive } = body;

    // Validate required fields
    if (!name || !price || price <= 0) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        agentId: id,
        name,
        description: description || '',
        price: parseFloat(price),
        duration: parseInt(duration) || 60,
        isActive: isActive !== false, // Default to true
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// PUT - Update multiple services for an agent
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { services } = body;

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: 'Services array is required' }, { status: 400 });
    }

    // Start a transaction to handle multiple service updates
    const result = await prisma.$transaction(async (tx) => {
      const updatedServices = [];

      for (const serviceData of services) {
        if (serviceData.id && serviceData.id.startsWith('temp-')) {
          // This is a new service (has temporary ID)
          const newService = await tx.service.create({
            data: {
              agentId: id,
              name: serviceData.name,
              description: serviceData.description || '',
              price: parseFloat(serviceData.price),
              duration: parseInt(serviceData.duration) || 60,
              isActive: serviceData.isActive !== false,
            },
          });
          updatedServices.push(newService);
        } else if (serviceData.id) {
          // This is an existing service
          const updatedService = await tx.service.update({
            where: { id: serviceData.id },
            data: {
              name: serviceData.name,
              description: serviceData.description || '',
              price: parseFloat(serviceData.price),
              duration: parseInt(serviceData.duration) || 60,
              isActive: serviceData.isActive !== false,
            },
          });
          updatedServices.push(updatedService);
        }
      }

      return updatedServices;
    });

    return NextResponse.json({ services: result });
  } catch (error) {
    console.error('Error updating services:', error);
    return NextResponse.json({ error: 'Failed to update services' }, { status: 500 });
  }
} 