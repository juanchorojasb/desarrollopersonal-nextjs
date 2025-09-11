import { redirect } from 'next/navigation';
import { isAdmin, getAdminStats } from '@/lib/admin';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  TrendingUp,
  UserPlus,
  GraduationCap,
  Shield,
  Settings,
  FileText,
  BarChart3
} from 'lucide-react';

export default async function AdminDashboard() {
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    redirect('/dashboard');
  }

  const stats = await getAdminStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Panel de Administración
              </h1>
              <p className="mt-2 text-gray-600">
                Gestión completa de la plataforma DesarrolloPersonal.uno
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Administrador
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-blue-600">+{stats.recentGrowth.users} últimos 30 días</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
                <p className="text-sm text-green-600">{stats.totalEnrollments} inscripciones</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats.forumPosts}</p>
                <p className="text-sm text-purple-600">Comunidad activa</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600">+${stats.recentGrowth.revenue.toLocaleString()} últimos 30 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen de Actividad</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Usuarios Activos</p>
                  <p className="text-xs text-blue-700">Últimos 30 días</p>
                </div>
                <span className="text-lg font-semibold text-blue-900">{stats.activeUsers}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Cursos Completados</p>
                  <p className="text-xs text-green-700">Total histórico</p>
                </div>
                <span className="text-lg font-semibold text-green-900">{stats.courseCompletions}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Nuevas Inscripciones</p>
                  <p className="text-xs text-purple-700">Últimos 30 días</p>
                </div>
                <span className="text-lg font-semibold text-purple-900">{stats.recentGrowth.enrollments}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="/dashboard/admin/usuarios"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Users className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">Gestionar Usuarios</h3>
                <p className="text-sm text-gray-600">Ver y editar usuarios</p>
              </a>
              
              <a 
                href="/dashboard/admin/contenido"
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <BookOpen className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">Contenido</h3>
                <p className="text-sm text-gray-600">Cursos y comunidad</p>
              </a>
              
              <a 
                href="/dashboard/admin/estadisticas"
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <BarChart3 className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">Estadísticas</h3>
                <p className="text-sm text-gray-600">Reportes y métricas</p>
              </a>
              
              <a 
                href="/dashboard/admin/configuracion"
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group"
              >
                <Settings className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">Configuración</h3>
                <p className="text-sm text-gray-600">Sistema y ajustes</p>
              </a>
              
              <a 
                href="/dashboard/admin/logs"
                className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <FileText className="w-8 h-8 text-red-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">Logs</h3>
                <p className="text-sm text-gray-600">Actividad de admin</p>
              </a>
              
              <a 
                href="/dashboard/admin/promociones"
                className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group"
              >
                <GraduationCap className="w-8 h-8 text-yellow-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">Promociones</h3>
                <p className="text-sm text-gray-600">Códigos y descuentos</p>
              </a>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado del Sistema</h2>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">Base de Datos</h3>
                <p className="text-sm text-green-700">Funcionando correctamente</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">Autenticación</h3>
                <p className="text-sm text-green-700">Clerk operativo</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-medium text-green-900">Videos</h3>
                <p className="text-sm text-green-700">MediaDelivery activo</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}