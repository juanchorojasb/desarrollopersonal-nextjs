import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EnrollRequest {
  courseId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth(); // CORREGIDO: agregado await

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: EnrollRequest = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID es requerido' }, { status: 400 });
    }

    // Get or create user
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: 'user@example.com', // This should come from Clerk
      }
    });

    // Verificar si el curso existe
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    // Verificar si ya está inscrito
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Ya estás inscrito en este curso' }, { status: 400 });
    }

    // Crear inscripción
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        enrolledAt: new Date()
      },
      include: {
        course: true
      }
    });

    return NextResponse.json({
      message: 'Inscripción exitosa',
      enrollment
    });

  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
