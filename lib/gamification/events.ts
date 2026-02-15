// Sistema de eventos de gamificación
import { prisma } from '@/lib/prisma';
import { awardPoints } from './achievements';
import { updateStreak } from './streak';
import { POINTS_CONFIG } from './points';
import { notifyCourseCompleted, notifyForumReply } from '@/lib/notifications/create';

export async function onLessonCompleted(userId: string, lessonId: string) {
  // Otorgar puntos
  const result = await awardPoints(
    userId,
    POINTS_CONFIG.COMPLETE_LESSON,
    'lesson_completed',
    { lessonId }
  );

  // Actualizar estadísticas
  await prisma.userStats.update({
    where: { userId },
    data: { lessonsCompleted: { increment: 1 } },
  });

  // Actualizar racha
  const streakResult = await updateStreak(userId);

  return {
    ...result,
    streak: streakResult,
  };
}

export async function onCourseCompleted(userId: string, courseId: string) {
  const result = await awardPoints(
    userId,
    POINTS_CONFIG.COMPLETE_COURSE,
    'course_completed',
    { courseId }
  );

  await prisma.userStats.update({
    where: { userId },
    data: { coursesCompleted: { increment: 1 } },
  });

  // Obtener información del curso y usuario
  const [course, user] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    })
  ]);

  if (course && user) {
    // Notificar curso completado
    await notifyCourseCompleted(userId, course.title);

    // Generar certificado automáticamente
    await prisma.certificate.create({
      data: {
        userId,
        courseId,
        courseName: course.title,
        userName: user.name || user.email,
      }
    });
  }

  return result;
}

export async function onPostCreated(userId: string, postId: string) {
  const result = await awardPoints(
    userId,
    POINTS_CONFIG.CREATE_POST,
    'post_created',
    { postId }
  );

  await prisma.userStats.update({
    where: { userId },
    data: { forumPosts: { increment: 1 } },
  });

  return result;
}

export async function onReplyCreated(userId: string, replyId: string) {
  const result = await awardPoints(
    userId,
    POINTS_CONFIG.CREATE_REPLY,
    'reply_created',
    { replyId }
  );

  await prisma.userStats.update({
    where: { userId },
    data: { forumReplies: { increment: 1 } },
  });

  return result;
}

export async function onDailyLogin(userId: string) {
  const streakResult = await updateStreak(userId);

  if (streakResult) {
    await awardPoints(
      userId,
      POINTS_CONFIG.DAILY_LOGIN + (streakResult.bonusPoints || 0),
      'daily_login',
      { streak: streakResult.currentStreak }
    );
  }

  return streakResult;
}

// Importar verificación de badges
import { checkAndUnlockBadges } from '@/lib/badges/check';

// Hook para verificar badges después de cualquier evento
export async function onAnyActivity(userId: string) {
  await checkAndUnlockBadges(userId);
}
