import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Users, Calendar, Award, Settings } from 'lucide-react'
import GamificationWidget from '@/components/GamificationWidget'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user.name || 'Estudiante'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a tu espacio de desarrollo personal
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Accesos Rápidos */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/dashboard/cursos">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <BookOpen className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mis Cursos</h3>
                      <p className="text-sm text-gray-600">8 cursos disponibles</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/community">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                      <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Comunidad</h3>
                      <p className="text-sm text-gray-600">11 foros activos</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/talleres">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <Calendar className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Talleres</h3>
                      <p className="text-sm text-gray-600">Próximos eventos</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/achievements">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-600 transition-colors">
                      <Award className="w-6 h-6 text-yellow-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mis Logros</h3>
                      <p className="text-sm text-gray-600">Ver progreso</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Panel de Admin (solo para admins) */}
            {user.isAdmin && (
              <Link href="/admin">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Panel de Administración</h3>
                      <p className="text-indigo-100">Gestionar usuarios, cursos y contenido</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Sección de Cursos Recientes */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Continuar Aprendiendo</h2>
              <div className="space-y-3">
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Comienza explorando tus cursos disponibles</p>
                  <Link href="/dashboard/cursos">
                    <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Ver Cursos
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Gamificación */}
          <div className="space-y-6">
            <GamificationWidget />

            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="text-center py-4 text-gray-400">Sin actividad reciente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
