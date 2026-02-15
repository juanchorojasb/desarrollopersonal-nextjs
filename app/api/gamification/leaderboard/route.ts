import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all-time';
    const limit = parseInt(searchParams.get('limit') || '10');

    let dateFilter = {};
    
    if (period === 'monthly') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateFilter = { updatedAt: { gte: startOfMonth } };
    } else if (period === 'weekly') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { updatedAt: { gte: startOfWeek } };
    }

    const topUsers = await prisma.userStats.findMany({
      where: dateFilter,
      orderBy: { totalPoints: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    const leaderboard = topUsers.map((stat, index) => ({
      rank: index + 1,
      userId: stat.userId,
      name: stat.user.name || stat.user.email.split('@')[0],
      image: stat.user.image,
      totalPoints: stat.totalPoints,
      level: stat.level,
      coursesCompleted: stat.coursesCompleted,
      currentStreak: stat.currentStreak,
    }));

    return NextResponse.json({ leaderboard, period });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
