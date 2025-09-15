export const dynamic = "force-dynamic";
import { requireAdminAccess } from '@/lib/admin-access';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getNotifications() {
  try {
    const [
      recentUsers,
      recentPosts
    ] = await Promise.all([
      // Usuarios recientes (últimos 7 días)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          plan: true,
          createdAt: true
        }
      }),

      // Posts recientes del foro
      prisma.forumPost.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          category: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    return {
      recentUsers,
      recentPosts
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      recentUsers: [],
      recentPosts: []
    };
  }
}

export default async function NotificacionesPage() {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para ver las notificaciones.</p>
        </div>
      </div>
    );
  }

  const data = await getNotifications();

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notificaciones y Actividad</h1>
        <p className="text-gray-600">Actividad reciente en la plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nuevos usuarios */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Nuevos Usuarios (últimos 7 días)
            </h2>
          </div>
          <div className="p-6">
            {data.recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay nuevos usuarios en los últimos 7 días
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName || 'Usuario'} {user.lastName || 'Nuevo'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {user.plan}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actividad del foro */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Actividad del Foro (últimos 7 días)
            </h2>
          </div>
          <div className="p-6">
            {data.recentPosts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay nuevas publicaciones en los últimos 7 días
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2">
                        {post.category.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Por {post.author.firstName} {post.author.lastName}
                      </span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de actividad */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.recentUsers.length}</p>
            <p className="text-sm text-blue-600">Nuevos usuarios</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.recentPosts.length}</p>
            <p className="text-sm text-green-600">Nuevas publicaciones</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {((data.recentUsers.length + data.recentPosts.length) / 7).toFixed(1)}
            </p>
            <p className="text-sm text-purple-600">Actividad promedio/día</p>
          </div>
        </div>
      </div>
    </div>
  );
}
