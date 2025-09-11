import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { requireAdmin, getDashboardStats } from '@/lib/admin';
import { PrismaClient } from '@prisma/client';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  MessageSquare,
  Calendar,
  Download,
  Eye,
  Clock,
  Target
} from 'lucide-react';

const prisma = new PrismaClient();

export default async function AdminStatsPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  try {
    requireAdmin(user);
  } catch {
    redirect('/dashboard');
  }

  const [stats, monthlyData, courseStats, engagementData] = await Promise.all([
    getDashboardStats(),
    
    // Monthly user registration data (last 6 months)
    Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return prisma.user.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }).then(count => ({
          month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
          users: count
        }));
      })
    ),
    
    // Course completion stats
    prisma.course.findMany({
      where: { status: 'published' },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        },
        enrollments: {
          where: { status: 'completed' },
          select: { id: true }
        }
      }
    }),
    
    // User engagement data
    Promise.all([
      // Daily active users last 7 days
      Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
          
          return prisma.user.count({
            where: {
              lastActivity: {
                gte: startOfDay,
                lt: endOfDay
              }
            }
          }).then(count => ({
            date: date.toLocaleDateString('es-ES', { weekday: 'short' }),
            activeUsers: count
          }));
        })
      ),
      
      // Course completion rates
      prisma.enrollment.groupBy({
        by: ['status'],
        _count: true
      }),
      
      // Forum activity by category
      prisma.forumCategory.findMany({
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      })
    ])
  ]);

  const [dailyActiveUsers, completionRates, forumActivity] = engagementData;

  // Reverse monthly data to show chronologically
  const reversedMonthlyData = monthlyData.reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Estadísticas y Reportes
              </h1>
              <p className="mt-2 text-gray-600">
                Análisis detallado de la plataforma
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                <Download className="w-4 h-4" />
                Exportar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-blue-600">+{stats.newUsersThisMonth} este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inscripciones Activas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeEnrollments}</p>
                <p className="text-sm text-green-600">
                  {Math.round((stats.activeEnrollments / stats.totalUsers) * 100)}% engagement
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Posts del Foro</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.forumStats.totalPosts}</p>
                <p className="text-sm text-purple-600">+{stats.forumStats.postsThisWeek} esta semana</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalUsers > 0 ? Math.round(((stats.totalUsers - (stats.usersByPlan.free || 0)) / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="text-sm text-orange-600">Free a Premium</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Registrations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Registros Mensuales</h2>
            
            <div className="space-y-4">
              {reversedMonthlyData.map((month, index) => {
                const maxUsers = Math.max(...reversedMonthlyData.map(m => m.users));
                const percentage = maxUsers > 0 ? (month.users / maxUsers) * 100 : 0;
                
                return (
                  <div key={month.month} className="flex items-center">
                    <div className="w-16 text-sm text-gray-600">{month.month}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900">{month.users}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Active Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usuarios Activos (7 días)</h2>
            
            <div className="space-y-4">
              {dailyActiveUsers.reverse().map((day, index) => {
                const maxActive = Math.max(...dailyActiveUsers.map(d => d.activeUsers));
                const percentage = maxActive > 0 ? (day.activeUsers / maxActive) * 100 : 0;
                
                return (
                  <div key={day.date} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">{day.date}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900">{day.activeUsers}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Rendimiento de Cursos</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscripciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasa de Finalización
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courseStats.slice(0, 10).map((course) => {
                  const completionRate = course._count.enrollments > 0 
                    ? (course.enrollments.length / course._count.enrollments) * 100 
                    : 0;
                  
                  return (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course._count.enrollments}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.enrollments.length}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{completionRate.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {course._count.enrollments > 50 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">Alta</span>
                            </>
                          ) : course._count.enrollments > 20 ? (
                            <>
                              <Target className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-yellow-600">Media</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-600">Baja</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Distribution & Forum Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Plan Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Distribución por Plan</h2>
            
            <div className="space-y-4">
              {Object.entries(stats.usersByPlan).map(([plan, count]) => {
                const percentage = (count / stats.totalUsers) * 100;
                const planNames: Record<string, string> = {
                  free: 'Gratuito',
                  basic: 'Básico',
                  complete: 'Completo',
                  personal: 'Personal'
                };
                const colors: Record<string, string> = {
                  free: 'bg-gray-500',
                  basic: 'bg-blue-500',
                  complete: 'bg-green-500',
                  personal: 'bg-purple-500'
                };
                
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {planNames[plan] || plan}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[plan] || 'bg-gray-400'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forum Activity by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad del Foro</h2>
            
            <div className="space-y-4">
              {forumActivity.map((category) => {
                const maxPosts = Math.max(...forumActivity.map(c => c._count.posts));
                const percentage = maxPosts > 0 ? (category._count.posts / maxPosts) * 100 : 0;
                
                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{category._count.posts}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% del total</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}