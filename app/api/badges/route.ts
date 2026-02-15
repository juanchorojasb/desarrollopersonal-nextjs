import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const [badges, userBadges] = await Promise.all([
      prisma.badge.findMany({
        orderBy: [
          { category: 'asc' },
          { rarity: 'desc' }
        ]
      }),
      prisma.userBadge.findMany({
        where: { userId: user.id },
        include: {
          badge: true
        }
      })
    ]);

    const unlockedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

    const badgesWithStatus = badges.map(badge => ({
      ...badge,
      unlocked: unlockedBadgeIds.has(badge.id),
      unlockedAt: userBadges.find(ub => ub.badgeId === badge.id)?.unlockedAt || null,
      isFavorite: userBadges.find(ub => ub.badgeId === badge.id)?.isFavorite || false
    }));

    const stats = {
      total: badges.length,
      unlocked: userBadges.length,
      progress: Math.round((userBadges.length / badges.length) * 100)
    };

    return NextResponse.json({
      badges: badgesWithStatus,
      stats
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
