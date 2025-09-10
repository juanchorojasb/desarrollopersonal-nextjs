import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const lessonId = params.lessonId;
    
    if (!lessonId || lessonId.trim() === '') {
      return NextResponse.json({ error: 'ID de lección inválido' }, { status: 400 });
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener lección con información completa
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { userId: user.id }
                }
              }
            }
          }
        },
        progress: {
          where: { userId: user.id }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    // Verificar que el usuario está inscrito en el curso
    const isEnrolled = lesson.module.course.enrollments.length > 0;
    if (!isEnrolled) {
      return NextResponse.json({ error: 'No estás inscrito en este curso' }, { status: 403 });
    }

    // Obtener navegación (lección anterior y siguiente)
    const navigation = await getLessonNavigation(lessonId, lesson.module.courseId);

    // Preparar respuesta
    const lessonData = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.videoDuration || 0,
      position: lesson.position,
      moduleId: lesson.moduleId,
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
        courseId: lesson.module.courseId,
        course: {
          id: lesson.module.course.id,
          title: lesson.module.course.title,
          studentsCount: lesson.module.course.studentsCount,
          rating: 4.5, // Default rating
        }
      },
      progress: lesson.progress
    };

    return NextResponse.json({
      lesson: lessonData,
      navigation
    });

  } catch (error) {
    console.error('Error getting lesson:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// Función auxiliar para obtener navegación de lecciones
async function getLessonNavigation(lessonId: string, courseId: string) {
  try {
    // Obtener todas las lecciones del curso ordenadas
    const courseLessons = await prisma.lesson.findMany({
      where: {
        module: {
          courseId: courseId
        }
      },
      include: {
        module: true
      },
      orderBy: [
        { module: { position: 'asc' } },
        { position: 'asc' }
      ]
    });

    // Encontrar la lección actual y determinar anterior/siguiente
    const currentIndex = courseLessons.findIndex(l => l.id === lessonId);
    
    if (currentIndex === -1) {
      return { previousLesson: null, nextLesson: null };
    }

    const previousLesson = currentIndex > 0 
      ? { id: courseLessons[currentIndex - 1].id, title: courseLessons[currentIndex - 1].title }
      : null;

    const nextLesson = currentIndex < courseLessons.length - 1 
      ? { id: courseLessons[currentIndex + 1].id, title: courseLessons[currentIndex + 1].title }
      : null;

    return { previousLesson, nextLesson };
  } catch (error) {
    console.error('Error getting lesson navigation:', error);
    return { previousLesson: null, nextLesson: null };
  }
}