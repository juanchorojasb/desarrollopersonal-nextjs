// Sistema de verificación y desbloqueo de logros

import { prisma } from '@/lib/prisma';

export async function checkAndUnlockAchievements(userId: string) {
  const stats = await prisma.userStats.findUnique({
    where: { userId },
  });

  if (!stats) return [];

  const allAchievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
  const newlyUnlocked = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const req = achievement.requirement as any;
    let shouldUnlock = false;

    switch (req.type) {
      case 'complete_lessons':
        shouldUnlock = stats.lessonsCompleted >= req.count;
        break;
      case 'complete_courses':
        shouldUnlock = stats.coursesCompleted >= req.count;
        break;
      case 'streak':
        shouldUnlock = stats.currentStreak >= req.count;
        break;
      case 'create_posts':
        shouldUnlock = stats.forumPosts >= req.count;
        break;
      case 'create_replies':
        shouldUnlock = stats.forumReplies >= req.count;
        break;
      case 'community_engagement':
        shouldUnlock = stats.forumPosts >= req.posts && stats.forumReplies >= req.replies;
        break;
      case 'reach_level':
        shouldUnlock = stats.level >= req.level;
        break;
    }

    if (shouldUnlock) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

export async function awardPoints(
  userId: string,
  points: number,
  activityType: string,
  metadata?: any
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Actualizar estadísticas del usuario
  const stats = await prisma.userStats.upsert({
    where: { userId },
    update: {
      totalPoints: { increment: points },
      updatedAt: new Date(),
    },
    create: {
      userId,
      totalPoints: points,
      level: 1,
    },
  });

  // Calcular nuevo nivel
  const newLevel = Math.floor(Math.sqrt(stats.totalPoints / 100)) + 1;
  if (newLevel > stats.level) {
    await prisma.userStats.update({
      where: { userId },
      data: { level: newLevel },
    });
  }

  // Registrar actividad diaria
  await prisma.dailyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      points: { increment: points },
      activities: {
        push: [{ type: activityType, points, timestamp: new Date(), ...metadata }],
      } as any,
    },
    create: {
      userId,
      date: today,
      points,
      activities: [{ type: activityType, points, timestamp: new Date(), ...metadata }],
    },
  });

  // Verificar logros
  const newAchievements = await checkAndUnlockAchievements(userId);

  return {
    pointsAwarded: points,
    newLevel: newLevel > stats.level ? newLevel : null,
    newAchievements,
  };
}

// Verificar badges al otorgar puntos
export async function checkBadgesAfterPoints(userId: string) {
  const { checkAndUnlockBadges } = await import('@/lib/badges/check');
  await checkAndUnlockBadges(userId);
}
