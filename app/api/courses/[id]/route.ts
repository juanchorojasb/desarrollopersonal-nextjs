import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // CORRECCIÓN CRÍTICA: auth() debe ser awaited en API routes
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const courseId = params.id; // Mantener como string
    
    if (!courseId || courseId.trim() === '') {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    // Obtener curso con módulos y lecciones
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId }
                }
              }
            }
          },
          orderBy: { id: 'asc' }
        },
        enrollments: {
          where: { userId }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    // Verificar si el usuario está inscrito
    const isEnrolled = course.enrollments.length > 0;
    
    if (!isEnrolled) {
      return NextResponse.json({ error: 'No estás inscrito en este curso' }, { status: 403 });
    }

    // Calcular progreso del curso
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].isCompleted).length, 0
    );
    
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Preparar respuesta
    const courseWithProgress = {
      ...course,
      progressPercentage,
      totalLessons,
      completedLessons,
      isEnrolled
    };

    return NextResponse.json(courseWithProgress);

  } catch (error) {
    console.error('Error getting course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
