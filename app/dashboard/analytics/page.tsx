import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import AnalyticsClient from './AnalyticsClient';
import { TrendingUp, Clock, Target, Calendar } from 'lucide-react';

async function getAnalyticsData(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [userStats, dailyActivities, activityLogs] = await Promise.all([
    prisma.userStats.findUnique({
      where: { userId }
    }),
    prisma.dailyActivity.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { date: 'asc' }
    }),
    prisma.activityLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { timestamp: 'desc' }
    })
  ]);

  // Calcular tiempo total
  const totalTime = activityLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
  const totalMinutes = Math.floor(totalTime / 60);

  // Preparar datos para gráfica de progreso
  const progressData = {
    labels: dailyActivities.map(d => format(new Date(d.date), 'dd MMM', { locale: es })),
    points: dailyActivities.map(d => d.points)
  };

  // Actividad por día para heatmap
  const activityHeatmap = dailyActivities.map(d => ({
    date: format(new Date(d.date), 'yyyy-MM-dd'),
    count: (d.activities as any)?.length || 0
  }));

  // Distribución de tiempo
  const timeByType: Record<string, number> = {};
  activityLogs.forEach(log => {
    if (log.duration) {
      timeByType[log.activityType] = (timeByType[log.activityType] || 0) + log.duration;
    }
  });

  const timeDistribution = Object.entries(timeByType).map(([type, duration]) => ({
    label: type === 'lesson_view' ? 'Lecciones' : type === 'course_view' ? 'Cursos' : 'Foro',
    value: duration,
    color: type === 'lesson_view' ? '#6366f1' : type === 'course_view' ? '#8b5cf6' : '#ec4899'
  }));

  // Calcular siguiente nivel
  const currentPoints = userStats?.totalPoints || 0;
  const currentLevel = userStats?.level || 1;
  const nextLevel = currentLevel + 1;
  const pointsForNextLevel = Math.pow(nextLevel - 1, 2) * 100;
  const pointsNeeded = pointsForNextLevel - currentPoints;

  return {
    userStats,
    progressData,
    activityHeatmap,
    timeDistribution,
    totalMinutes,
    nextLevelInfo: {
      currentLevel,
      nextLevel,
      currentPoints,
      pointsNeeded,
      progress: (currentPoints / pointsForNextLevel) * 100
    }
  };
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  const data = await getAnalyticsData(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            Analytics y Progreso
          </h1>
          <p className="text-gray-600 mt-2">
            Visualiza tu progreso y actividad en la plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-indigo-600" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.userStats?.totalPoints || 0}</p>
            <p className="text-sm text-gray-600">Puntos</p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">⭐</div>
              <span className="text-xs text-gray-500">Nivel</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.userStats?.level || 1}</p>
            <p className="text-sm text-gray-600">
              {data.nextLevelInfo.pointsNeeded} pts para nivel {data.nextLevelInfo.nextLevel}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">🔥</div>
              <span className="text-xs text-gray-500">Racha</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.userStats?.currentStreak || 0}</p>
            <p className="text-sm text-gray-600">días consecutivos</p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-green-600" />
              <span className="text-xs text-gray-500">Tiempo</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.totalMinutes}</p>
            <p className="text-sm text-gray-600">minutos totales</p>
          </div>
        </div>

        {/* Próximo Nivel */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Próximo Nivel: {data.nextLevelInfo.nextLevel}</h3>
              <p className="text-indigo-100">Te faltan {data.nextLevelInfo.pointsNeeded} puntos</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{Math.round(data.nextLevelInfo.progress)}%</p>
              <p className="text-indigo-100 text-sm">Completado</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${data.nextLevelInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Gráficas */}
        <AnalyticsClient 
          progressData={data.progressData}
          activityHeatmap={data.activityHeatmap}
          timeDistribution={data.timeDistribution}
        />
      </div>
    </div>
  );
}
