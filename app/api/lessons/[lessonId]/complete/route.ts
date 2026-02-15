import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';
import { onLessonCompleted, onCourseCompleted } from '@/lib/gamification/events';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { lessonId } = await params;

    // Verificar si ya estaba completada
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
    });

    const wasAlreadyCompleted = existingProgress?.isCompleted || false;

    // Marcar lección como completada
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        watchPercentage: 100,
      },
      create: {
        userId: user.id,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
        watchPercentage: 100,
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    let gamification = null;
    let courseCompleted = false;

    // Solo otorgar puntos si no estaba completada antes
    if (!wasAlreadyCompleted) {
      // Otorgar puntos de gamificación
      gamification = await onLessonCompleted(user.id, lessonId);

      // Verificar si completó el curso
      const courseId = progress.lesson.module.courseId;
      const totalLessons = await prisma.lesson.count({
        where: {
          module: { courseId },
        },
      });

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: user.id,
          isCompleted: true,
          lesson: {
            module: { courseId },
          },
        },
      });

      if (completedLessons === totalLessons) {
        const courseGamification = await onCourseCompleted(user.id, courseId);
        courseCompleted = true;
        
        // Combinar gamificación
        if (gamification && courseGamification) {
          gamification = {
            ...gamification,
            courseCompleted: true,
            coursePoints: courseGamification.pointsAwarded,
            newAchievements: [
              ...gamification.newAchievements,
              ...courseGamification.newAchievements,
            ],
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      progress,
      gamification,
      courseCompleted,
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json({ 
      error: 'Error interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
