import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update a specific service
export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const body = await request.json();
    
    const { name, description, price, duration, isActive } = body;

    // Validate required fields
    if (!name || !price || price <= 0) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        duration: parseInt(duration) || 60,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE - Delete a specific service
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const { serviceId } = params;

    // Check if service has any bookings
    const bookings = await prisma.booking.findMany({
      where: { serviceId },
    });

    if (bookings.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete service with existing bookings' 
      }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}




