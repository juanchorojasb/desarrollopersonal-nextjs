import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const stats = await prisma.userStats.findUnique({
      where: { userId: user.id },
    });

    if (!stats) {
      return NextResponse.json({ error: 'Estadísticas no encontradas' }, { status: 404 });
    }

    // Calcular progreso de nivel manualmente
    const currentLevel = Math.floor(Math.sqrt(stats.totalPoints / 100)) + 1;
    const nextLevel = currentLevel + 1;
    const pointsForCurrent = Math.pow(currentLevel - 1, 2) * 100;
    const pointsForNext = Math.pow(currentLevel, 2) * 100;
    const currentLevelPoints = stats.totalPoints - pointsForCurrent;
    const pointsNeeded = pointsForNext - pointsForCurrent;
    const progress = Math.min(100, (currentLevelPoints / pointsNeeded) * 100);

    return NextResponse.json({
      totalPoints: stats.totalPoints,
      level: stats.level,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      coursesCompleted: stats.coursesCompleted,
      lessonsCompleted: stats.lessonsCompleted,
      forumPosts: stats.forumPosts,
      forumReplies: stats.forumReplies,
      levelProgress: {
        currentLevel,
        nextLevel,
        pointsForNext: pointsForNext - stats.totalPoints,
        currentLevelPoints,
        progress,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ 
      error: 'Error interno', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
