import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getAdvancedStats() {
  try {
    const [
      usersByPlan,
      recentUsers,
      topCourses,
      monthlyGrowth
    ] = await Promise.all([
      // Usuarios por plan
      prisma.user.groupBy({
        by: ['subscriptionStatus'],
        _count: { id: true }
      }),
      
      // Usuarios recientes (últimos 30 días)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Cursos más populares
      prisma.course.findMany({
        include: {
          enrollments: true,
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: {
          enrollments: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // Crecimiento mensual
      prisma.user.count()
    ]);

    return {
      usersByPlan,
      recentUsers,
      topCourses,
      monthlyGrowth
    };
  } catch (error) {
    console.error('Error getting advanced stats:', error);
    return {
      usersByPlan: [],
      recentUsers: 0,
      topCourses: [],
      monthlyGrowth: 0
    };
  }
}

export default async function EstadisticasPage() {
  const stats = await getAdvancedStats();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Estadísticas Avanzadas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Distribución por planes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribución por Planes</h3>
          <div className="space-y-3">
            {stats.usersByPlan.map((plan) => (
              <div key={plan.subscriptionStatus} className="flex justify-between items-center">
                <span className="capitalize">{plan.subscriptionStatus}</span>
                <span className="font-semibold">{plan._count.id}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Crecimiento reciente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Crecimiento</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Usuarios nuevos (30 días)</span>
              <span className="font-semibold text-green-600">{stats.recentUsers}</span>
            </div>
            <div className="flex justify-between">
              <span>Total usuarios</span>
              <span className="font-semibold">{stats.monthlyGrowth}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cursos más populares */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Cursos Más Populares</h3>
        <div className="space-y-3">
          {stats.topCourses.map((course) => (
            <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-gray-500">{course.description?.substring(0, 100)}...</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{course._count.enrollments}</div>
                <div className="text-sm text-gray-500">inscripciones</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
