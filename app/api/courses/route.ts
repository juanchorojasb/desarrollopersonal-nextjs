import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            isActive: true
          },
          include: {
            plan: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        lessonProgress: true
      }
    });

    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    const hasActiveSubscription = user && user.subscriptions.length > 0;
    const subscription = hasActiveSubscription ? user.subscriptions[0] : null;

    const coursesWithAccess = courses.map(course => {
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      
      let hasAccess = false;
      if (course.isFree) {
        hasAccess = true;
      } else if (hasActiveSubscription) {
        const now = new Date();
        const isNotExpired = !subscription.currentPeriodEnd || subscription.currentPeriodEnd > now;
        hasAccess = isNotExpired;
      }

      let progressPercentage = 0;
      if (user && totalLessons > 0) {
        const lessonIds = course.modules.flatMap(module => module.lessons.map(lesson => lesson.id));
        const completedLessons = user.lessonProgress.filter(
          progress => lessonIds.includes(progress.lessonId) && progress.completed
        ).length;
        progressPercentage = Math.round((completedLessons / totalLessons) * 100);
      }
      
      return {
        ...course,
        totalLessons,
        hasAccess,
        progressPercentage,
        requiresSubscription: !course.isFree && !hasActiveSubscription
      };
    });

    return NextResponse.json({
      courses: coursesWithAccess,
      subscription: subscription ? {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd
      } : null
    });

  } catch (error) {
    console.error('Error getting courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
