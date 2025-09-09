import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { lessonId, completed, watchTime } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId requerido' }, { status: 400 });
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
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
    }

    // Actualizar o crear progreso
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId
        }
      },
      update: {
        completed: completed || false,
        watchTime: watchTime || 0,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        completed: completed || false,
        watchTime: watchTime || 0,
        completedAt: completed ? new Date() : null,
        startedAt: new Date()
      }
    });

    // Calcular progreso del curso si se marcó como completada
    if (completed) {
      // Obtener todas las lecciones del curso
      const courseId = lesson.module.courseId;
      const allLessons = await prisma.lesson.findMany({
        where: {
          module: {
            courseId: courseId
          }
        }
      });

      // Obtener progreso del usuario en todas las lecciones del curso
      const userProgress = await prisma.lessonProgress.findMany({
        where: {
          userId: user.id,
          lessonId: {
            in: allLessons.map(l => l.id)
          },
          completed: true
        }
      });

      const completedPercentage = Math.round((userProgress.length / allLessons.length) * 100);

      // Actualizar o crear enrollment con progreso
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: clerkUserId,
            courseId: courseId
          }
        },
        update: {
          progress: completedPercentage,
          completedAt: completedPercentage === 100 ? new Date() : null,
          status: completedPercentage === 100 ? 'COMPLETED' : 'ACTIVE'
        },
        create: {
          userId: clerkUserId,
          courseId: courseId,
          progress: completedPercentage,
          status: 'ACTIVE',
          enrolledAt: new Date()
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      progress: progress
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const url = new URL(request.url);
    const lessonId = url.searchParams.get('lessonId');
    const courseId = url.searchParams.get('courseId');

    if (lessonId) {
      // Obtener progreso de una lección específica
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: lessonId
          }
        }
      });

      return NextResponse.json({ progress });
    } else if (courseId) {
      // Obtener progreso de todas las lecciones de un curso
      const progress = await prisma.lessonProgress.findMany({
        where: {
          userId: user.id,
          lesson: {
            module: {
              courseId: courseId
            }
          }
        },
        include: {
          lesson: true
        }
      });

      return NextResponse.json({ progress });
    } else {
      // Obtener todo el progreso del usuario
      const progress = await prisma.lessonProgress.findMany({
        where: {
          userId: user.id
        },
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: true
                }
              }
            }
          }
        }
      });

      return NextResponse.json({ progress });
    }

  } catch (error) {
    console.error('Error getting progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}