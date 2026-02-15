// Sistema de rachas diarias

import { prisma } from '@/lib/prisma';
import { POINTS_CONFIG } from './points';

export async function updateStreak(userId: string) {
  const stats = await prisma.userStats.findUnique({
    where: { userId },
  });

  if (!stats) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null;
  
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  let newStreak = stats.currentStreak;
  let bonusPoints = 0;

  if (!lastActive) {
    // Primera vez
    newStreak = 1;
  } else {
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Mismo día, no cambia
      return null;
    } else if (daysDiff === 1) {
      // Día consecutivo
      newStreak = stats.currentStreak + 1;

      // Bonus por hitos
      if (newStreak === 3) bonusPoints = POINTS_CONFIG.STREAK_BONUS_3;
      if (newStreak === 7) bonusPoints = POINTS_CONFIG.STREAK_BONUS_7;
      if (newStreak === 30) bonusPoints = POINTS_CONFIG.STREAK_BONUS_30;
    } else {
      // Perdió la racha
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(stats.longestStreak, newStreak);

  await prisma.userStats.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActiveDate: new Date(),
      totalPoints: bonusPoints > 0 ? { increment: bonusPoints } : undefined,
    },
  });

  return {
    currentStreak: newStreak,
    longestStreak,
    bonusPoints,
    isNewRecord: newStreak > stats.longestStreak,
  };
}
