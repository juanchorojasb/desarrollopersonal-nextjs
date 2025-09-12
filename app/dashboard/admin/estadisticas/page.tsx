import { requireAdminAccess } from '@/lib/admin-access';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getStats() {
  try {
    const [
      usersByPlan,
      totalUsers,
      recentUsers,
      forumStats
    ] = await Promise.all([
      // Usuarios por plan (usando el campo correcto 'plan')
      prisma.user.groupBy({
        by: ['plan'],
        _count: { id: true }
      }),

      // Total de usuarios
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 días
          }
        }
      }),

      // Usuarios recientes
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          plan: true,
          createdAt: true
        }
      }),

      // Estadísticas del foro
      {
        totalPosts: await prisma.forumPost.count(),
        totalReplies: await prisma.forumReply.count(),
        totalReactions: await prisma.forumReaction.count()
      }
    ]);

    return {
      usersByPlan,
      totalUsers,
      recentUsers,
      forumStats
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      usersByPlan: [],
      totalUsers: 0,
      recentUsers: [],
      forumStats: { totalPosts: 0, totalReplies: 0, totalReactions: 0 }
    };
  }
}

export default async function EstadisticasPage() {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para ver las estadísticas.</p>
        </div>
      </div>
    );
  }

  const stats = await getStats();

  const planNames = {
    free: 'Gratuito',
    basico: 'Básico',
    completo: 'Completo',
    personal: 'Personal'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-gray-600">Análisis detallado de la plataforma</p>
      </div>

      {/* Estadísticas de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Usuarios</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          <p className="text-sm text-gray-400">Últimos 30 días</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Posts del Foro</h3>
          <p className="text-3xl font-bold text-green-600">{stats.forumStats.totalPosts}</p>
          <p className="text-sm text-gray-400">Total publicaciones</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Respuestas</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.forumStats.totalReplies}</p>
          <p className="text-sm text-gray-400">En el foro</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Reacciones</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.forumStats.totalReactions}</p>
          <p className="text-sm text-gray-400">Total interacciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios por plan */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribución por Plan</h3>
          <div className="space-y-3">
            {stats.usersByPlan.map((planData) => (
              <div key={planData.plan} className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {planNames[planData.plan as keyof typeof planNames] || planData.plan}
                </span>
                <span className="text-sm text-gray-600">{planData._count.id} usuarios</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usuarios recientes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Usuarios Recientes</h3>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {planNames[user.plan as keyof typeof planNames] || user.plan}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
