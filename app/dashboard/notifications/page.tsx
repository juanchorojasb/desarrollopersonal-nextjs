import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import NotificationsList from './NotificationsList';

async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  const notifications = await getNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 
              ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
              : 'No tienes notificaciones sin leer'
            }
          </p>
        </div>

        <NotificationsList initialNotifications={notifications} />
      </div>
    </div>
  );
}
