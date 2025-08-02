// app/api/lessons/progress/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LessonWithModule {
  id: string;
  videoDuration?: number;
  type: string;
  minWatchTime: number;
  module: {
    courseId: string;
    course: {
      id: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {

const { userId } = await auth();    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId, watchTime, percentage } = await request.json();
    
    if (!lessonId || watchTime === undefined || percentage === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que la lección existe
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    }) as LessonWithModule | null;

    if (!lesson) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    // Verificar que el usuario está inscrito en el curso
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.module.courseId
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'No inscrito en este curso' }, { status: 403 });
    }

    // Actualizar o crear progreso de lección
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId
        }
      },
      update: {
        watchTime: Math.max(watchTime, 0),
        watchPercentage: Math.min(Math.max(percentage, 0), 100),
        lastWatchedAt: new Date(),
        isCompleted: percentage >= lesson.minWatchTime
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        watchTime: Math.max(watchTime, 0),
        watchPercentage: Math.min(Math.max(percentage, 0), 100),
        isCompleted: percentage >= lesson.minWatchTime,
        lastWatchedAt: new Date()
      }
    });

    // Si se marca como completada, otorgar XP
    if (lessonProgress.isCompleted && percentage >= lesson.minWatchTime) {
      const xpGained = calculateLessonXP(lesson);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalXP: {
            increment: xpGained
          },
          lastActivity: new Date()
        }
      });
    }

    // Recalcular progreso del curso
    await updateCourseProgress(user.id, lesson.module.courseId);

    return NextResponse.json({
      success: true,
      progress: lessonProgress
    });

  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { error: 'Error al actualizar progreso' },
      { status: 500 }
    );
  }
}

// Función auxiliar para calcular XP de lección
function calculateLessonXP(lesson: LessonWithModule): number {
  const baseXP = 10;
  const durationBonus = lesson.videoDuration ? Math.floor(lesson.videoDuration / 60) : 0;
  const typeMultiplier = lesson.type === 'quiz' ? 1.5 : 1;
  
  return Math.round((baseXP + durationBonus) * typeMultiplier);
}

// Función auxiliar para actualizar progreso del curso
async function updateCourseProgress(userId: string, courseId: string): Promise<number> {
  // Obtener todas las lecciones del curso
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
        }
      }
    }
  });

  if (!course) return 0;

  // Calcular progreso
  const totalLessons = course.modules.reduce((total, courseModule) => total + courseModule.lessons.length, 0);
  const completedLessons = course.modules.reduce((total, courseModule) => 
    total + courseModule.lessons.filter(lesson => 
      lesson.progress.some(p => p.isCompleted)
    ).length, 0
  );

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Actualizar inscripción
  await prisma.enrollment.updateMany({
    where: {
      userId,
      courseId
    },
    data: {
      progress: progressPercentage,
      lastAccessedAt: new Date()
    }
  });

  return progressPercentage;
}
