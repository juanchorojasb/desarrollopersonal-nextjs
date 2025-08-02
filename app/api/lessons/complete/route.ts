// app/api/lessons/complete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LessonWithModule {
  id: string;
  videoDuration?: number;
  type: string;
  module: {
    courseId: string;
    course: {
      id: string;
    };
  };
}

interface CourseWithDetails {
  id: string;
  title: string;
  level: string;
}

export async function POST(request: NextRequest) {
  try {

const { userId } = await auth();    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId } = await request.json();
    
    if (!lessonId) {
      return NextResponse.json({ error: 'ID de lección requerido' }, { status: 400 });
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener lección con información del curso
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

    // Marcar como completada
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        watchPercentage: 100
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: true,
        completedAt: new Date(),
        watchPercentage: 100,
        watchTime: lesson.videoDuration || 0
      }
    });

    // Otorgar XP
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

    // Actualizar progreso del curso
    const courseProgress = await updateCourseProgress(user.id, lesson.module.courseId);

    // Verificar si se completó el curso
    if (courseProgress >= 100) {
      await handleCourseCompletion(user.id, lesson.module.courseId);
    }

    return NextResponse.json({
      success: true,
      progress: lessonProgress,
      xpGained
    });

  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Error al completar lección' },
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

// Función auxiliar para manejar la finalización del curso
async function handleCourseCompletion(userId: string, courseId: string) {
  try {
    // Marcar inscripción como completada
    await prisma.enrollment.updateMany({
      where: {
        userId,
        courseId
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
        progress: 100
      }
    });

    // Obtener información del curso
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    }) as CourseWithDetails | null;

    if (!course) return;

    // Otorgar XP adicional por completar el curso
    const courseXP = calculateCourseXP(course);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP: {
          increment: courseXP
        }
      }
    });

    // Generar certificado
    const certificateNumber = generateCertificateNumber(courseId, userId);
    
    await prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        title: `Certificado de Finalización - ${course.title}`,
        description: `Has completado exitosamente el curso "${course.title}"`
      }
    });

    console.log(`Usuario ${userId} completó el curso ${courseId}`);

  } catch (error) {
    console.error('Error handling course completion:', error);
  }
}

// Función auxiliar para calcular XP del curso
function calculateCourseXP(course: CourseWithDetails): number {
  const baseXP = 100;
  const levelMultiplier = course.level === 'advanced' ? 2 : course.level === 'intermediate' ? 1.5 : 1;
  return Math.round(baseXP * levelMultiplier);
}

// Función auxiliar para generar número de certificado
function generateCertificateNumber(courseId: string, userId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const courseCode = courseId.slice(-4).toUpperCase();
  const userCode = userId.slice(-4).toUpperCase();
  
  return `CERT-${courseCode}-${userCode}-${timestamp}`;
}
