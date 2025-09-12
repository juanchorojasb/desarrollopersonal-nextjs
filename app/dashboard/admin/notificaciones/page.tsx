import { PrismaClient } from '@prisma/client';
import NotificationCreator from './NotificationCreator';

const prisma = new PrismaClient();

async function getRecentActivity() {
  try {
    // Actividad reciente en la plataforma
    const [newUsers, newEnrollments, recentPosts] = await Promise.all([
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      prisma.enrollment.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: true,
          course: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      prisma.forumPost.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          author: true,
          category: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return { newUsers, newEnrollments, recentPosts };
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return { newUsers: [], newEnrollments: [], recentPosts: [] };
  }
}

export default async function NotificacionesPage() {
  const { newUsers, newEnrollments, recentPosts } = await getRecentActivity();
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Centro de Notificaciones</h1>
        <NotificationCreator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nuevos Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Nuevos Usuarios (7 días)
          </h3>
          <div className="space-y-3">
            {newUsers.length > 0 ? newUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div>
                  <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay nuevos usuarios</p>
            )}
          </div>
        </div>

        {/* Nuevas Inscripciones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            Nuevas Inscripciones (7 días)
          </h3>
          <div className="space-y-3">
            {newEnrollments.length > 0 ? newEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div>
                  <div className="font-medium text-sm">{enrollment.course.title}</div>
                  <div className="text-xs text-gray-500">{enrollment.user.firstName} {enrollment.user.lastName}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(enrollment.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay nuevas inscripciones</p>
            )}
          </div>
        </div>

        {/* Actividad en Foros */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">
            Actividad en Foros (7 días)
          </h3>
          <div className="space-y-3">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="p-2 bg-purple-50 rounded">
                <div className="font-medium text-sm truncate">{post.title}</div>
                <div className="text-xs text-gray-500">{post.author.firstName} en {post.category.name}</div>
                <div className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay actividad reciente</p>
            )}
          </div>
        </div>
      </div>

      {/* Alertas del Sistema */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Alertas del Sistema</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <div>
              <div className="font-medium text-green-800">Sistema funcionando correctamente</div>
              <div className="text-sm text-green-600">Todos los servicios están operativos</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <div>
              <div className="font-medium text-yellow-800">Recordatorio: Backup programado</div>
              <div className="text-sm text-yellow-600">Próximo backup automático: mañana a las 3:00 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
