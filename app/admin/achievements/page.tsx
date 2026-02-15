import { prisma } from '@/lib/prisma';
import { Trophy, Users, Target } from 'lucide-react';

async function getAchievementsData() {
  const achievements = await prisma.achievement.findMany({
    include: {
      _count: {
        select: { unlockedBy: true }
      }
    },
    orderBy: [
      { category: 'asc' },
      { points: 'asc' }
    ]
  });

  const totalUnlocked = await prisma.userAchievement.count();

  return {
    achievements,
    totalUnlocked,
  };
}

export default async function AdminAchievementsPage() {
  const data = await getAchievementsData();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-200 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'courses': return 'bg-blue-100 text-blue-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'community': return 'bg-green-100 text-green-800';
      case 'level': return 'bg-purple-100 text-purple-800';
      case 'special': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Logros</h1>
        <p className="text-gray-600 mt-2">{data.achievements.length} logros disponibles</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logros</p>
              <p className="text-3xl font-bold text-gray-900">{data.achievements.length}</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Desbloqueados</p>
              <p className="text-3xl font-bold text-gray-900">{data.totalUnlocked}</p>
            </div>
            <Target className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio por Usuario</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.totalUnlocked > 0 ? (data.totalUnlocked / data.achievements.length).toFixed(1) : 0}
              </p>
            </div>
            <Users className="w-12 h-12 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Achievements Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desbloqueado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requisito
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.achievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(achievement.tier)}`}>
                      {achievement.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600">
                      +{achievement.points} pts
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {achievement._count.unlockedBy} usuarios
                    </div>
                    <div className="text-xs text-gray-500">
                      {((achievement._count.unlockedBy / Math.max(data.achievements.length, 1)) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 font-mono">
                      {JSON.stringify(achievement.requirement)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
