import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonId, watchTime, watchPercentage } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId es requerido' },
        { status: 400 }
      );
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `user-${userId}@temp.local`,
        subscriptionStatus: "free"
      }
    });

    // Calculate completion
    const percentage = watchPercentage || 0;
    const isCompleted = percentage >= 80;

    // Check if progress already exists
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      }
    });

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      },
      update: {
        watchTime: watchTime || 0,
        watchPercentage: percentage,
        isCompleted: isCompleted,
        ...(isCompleted && !existingProgress?.completedAt ? { completedAt: new Date() } : {})
      },
      create: {
        userId: userId,
        lessonId: lessonId,
        watchTime: watchTime || 0,
        watchPercentage: percentage,
        isCompleted: isCompleted,
        ...(isCompleted ? { completedAt: new Date() } : {})
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { error: 'Error al actualizar progreso' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId es requerido' },
        { status: 400 }
      );
    }

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      }
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error getting lesson progress:', error);
    return NextResponse.json(
      { error: 'Error al obtener progreso' },
      { status: 500 }
    );
  }
}
