import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        },
        enrollments: {
          where: { userId }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular progreso para cada curso
    const coursesWithProgress = courses.map(course => {
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const isEnrolled = course.enrollments.length > 0;
      
      return {
        ...course,
        totalLessons,
        isEnrolled,
        progressPercentage: 0 // Se calculará con el progreso real del usuario
      };
    });

    return NextResponse.json(coursesWithProgress);

  } catch (error) {
    console.error('Error getting courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
