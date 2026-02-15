import { prisma } from '@/lib/prisma';
import { Users, BookOpen, MessageCircle, TrendingUp, DollarSign, Award } from 'lucide-react';

async function getAdminStats() {
  const [
    totalUsers,
    totalCourses,
    totalPosts,
    totalAchievements,
    recentUsers,
    topUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.forumPost.count(),
    prisma.achievement.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionStatus: true,
      }
    }),
    prisma.userStats.findMany({
      take: 5,
      orderBy: { totalPoints: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    }),
  ]);

  const activeUsers = await prisma.user.count({
    where: {
      stats: {
        lastActiveDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // últimos 7 días
        }
      }
    }
  });

  const paidUsers = await prisma.user.count({
    where: {
      subscriptionStatus: {
        in: ['basic', 'complete', 'personal']
      }
    }
  });

  return {
    totalUsers,
    totalCourses,
    totalPosts,
    totalAchievements,
    activeUsers,
    paidUsers,
    recentUsers,
    topUsers,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      name: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Usuarios Activos (7d)',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Usuarios de Pago',
      value: stats.paidUsers,
      icon: DollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Total Cursos',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Posts en Foro',
      value: stats.totalPosts,
      icon: MessageCircle,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      name: 'Logros Disponibles',
      value: stats.totalAchievements,
      icon: Award,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Vista general de la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Usuarios Recientes</h2>
          <div className="space-y-4">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{user.name || user.email}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.subscriptionStatus === 'free' 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {user.subscriptionStatus}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users by Points */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Usuarios (Puntos)</h2>
          <div className="space-y-4">
            {stats.topUsers.map((userStat, index) => (
              <div key={userStat.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {userStat.user.name || userStat.user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">Nivel {userStat.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">{userStat.totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">puntos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
