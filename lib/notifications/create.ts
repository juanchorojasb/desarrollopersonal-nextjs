import { prisma } from '@/lib/prisma';

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Notificación de logro desbloqueado
export async function notifyAchievementUnlocked(
  userId: string,
  achievementTitle: string,
  points: number
) {
  await createNotification(
    userId,
    'achievement',
    '🏆 ¡Nuevo Logro Desbloqueado!',
    `Has desbloqueado "${achievementTitle}" (+${points} puntos)`,
    '/dashboard/achievements'
  );
}

// Notificación de subida de nivel
export async function notifyLevelUp(userId: string, newLevel: number) {
  await createNotification(
    userId,
    'level_up',
    '⭐ ¡Subiste de Nivel!',
    `¡Felicidades! Ahora eres nivel ${newLevel}`,
    '/dashboard/achievements'
  );
}

// Notificación de curso completado
export async function notifyCourseCompleted(
  userId: string,
  courseTitle: string
) {
  await createNotification(
    userId,
    'course_complete',
    '🎓 ¡Curso Completado!',
    `Has completado el curso "${courseTitle}"`,
    '/dashboard/cursos'
  );
}

// Notificación de nueva respuesta en el foro
export async function notifyForumReply(
  userId: string,
  postTitle: string,
  postId: string,
  categorySlug: string
) {
  await createNotification(
    userId,
    'reply',
    '💬 Nueva Respuesta',
    `Alguien respondió a tu post "${postTitle}"`,
    `/dashboard/community/${categorySlug}/${postId}`
  );
}

// Notificación de racha en riesgo
export async function notifyStreakAtRisk(userId: string, streakDays: number) {
  await createNotification(
    userId,
    'streak',
    '🔥 ¡Tu Racha está en Riesgo!',
    `No pierdas tu racha de ${streakDays} días. ¡Completa una lección hoy!`,
    '/dashboard/cursos'
  );
}

// Notificación administrativa
export async function notifyAdmin(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  await createNotification(userId, 'admin', title, message, link);
}
