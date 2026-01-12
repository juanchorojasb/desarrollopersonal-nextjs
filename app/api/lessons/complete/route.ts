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
    const { lessonId } = body;

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

    // Mark lesson as complete
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        watchPercentage: 100
      },
      create: {
        userId: userId,
        lessonId: lessonId,
        isCompleted: true,
        completedAt: new Date(),
        watchPercentage: 100,
        watchTime: 0
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return NextResponse.json(
      { error: 'Error al marcar lección como completada' },
      { status: 500 }
    );
  }
}
