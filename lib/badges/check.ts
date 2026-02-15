import { prisma } from '@/lib/prisma';

export async function checkAndUnlockBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      stats: true,
      badges: {
        include: { badge: true }
      }
    }
  });

  if (!user || !user.stats) return;

  const allBadges = await prisma.badge.findMany();
  const unlockedBadgeIds = new Set(user.badges.map(ub => ub.badgeId));
  const newlyUnlocked: any[] = [];

  for (const badge of allBadges) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    const req = badge.requirement as any;
    let shouldUnlock = false;

    switch (req.type) {
      case 'lessons_completed':
        shouldUnlock = user.stats.lessonsCompleted >= req.count;
        break;
      case 'total_points':
        shouldUnlock = user.stats.totalPoints >= req.count;
        break;
      case 'level':
        shouldUnlock = user.stats.level >= req.count;
        break;
      case 'forum_posts':
        shouldUnlock = user.stats.forumPosts >= req.count;
        break;
      case 'forum_replies':
        shouldUnlock = user.stats.forumReplies >= req.count;
        break;
      case 'streak':
        shouldUnlock = user.stats.currentStreak >= req.count;
        break;
      case 'month_activity':
        const currentMonth = new Date().getMonth() + 1;
        if (currentMonth === req.month) {
          shouldUnlock = user.stats.lessonsCompleted >= 1;
        }
        break;
    }

    if (shouldUnlock) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        }
      });
      newlyUnlocked.push(badge);

      // Crear notificación
      await prisma.notification.create({
        data: {
          userId,
          type: 'badge',
          title: '🏅 ¡Nueva Insignia!',
          message: `Has desbloqueado "${badge.name}"`,
          link: '/dashboard/insignias'
        }
      });
    }
  }

  return newlyUnlocked;
}
