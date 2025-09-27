import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Mark lesson as completed
    const progress = await prisma.lessonProgress.upsert({
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
        watchPercentage: 100
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
