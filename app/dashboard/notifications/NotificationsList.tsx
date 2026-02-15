'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export default function NotificationsList({ 
  initialNotifications 
}: { 
  initialNotifications: Notification[] 
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' });
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'level_up': return '⭐';
      case 'course_complete': return '🎓';
      case 'reply': return '💬';
      case 'streak': return '🔥';
      case 'admin': return '📢';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Marcar todas como leídas
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleClick(notification)}
              className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer ${
                notification.isRead
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-indigo-300 bg-indigo-50 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600">{notification.message}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-3 h-3 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
