import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      level,
      duration,
      price,
      instructor,
      imageUrl,
      requiredPlan,
      isPublished
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level,
        duration: duration || 0,
        price: price || 0,
        instructor,
        imageUrl,
        requiredPlan: requiredPlan || 'free',
        isPublished: isPublished || false,
      }
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
