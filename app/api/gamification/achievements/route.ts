import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const allAchievements = await prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { points: 'asc' }],
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: { achievement: true },
    });

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    const achievements = allAchievements.map((ach) => ({
      ...ach,
      unlocked: unlockedIds.has(ach.id),
      unlockedAt: userAchievements.find((ua) => ua.achievementId === ach.id)?.unlockedAt || null,
    }));

    const stats = {
      total: allAchievements.length,
      unlocked: userAchievements.length,
      progress: Math.round((userAchievements.length / allAchievements.length) * 100),
    };

    return NextResponse.json({ achievements, stats });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
