import ThinkificCourse from '@/components/dashboard/ThinkificCourse'
import SpotifyPodcasts from '@/components/dashboard/SpotifyPodcasts'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mi Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Bienvenido a tu espacio de crecimiento personal</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Mis Cursos</h3>
            <p className="text-xs text-gray-600 hidden sm:block">Continúa aprendiendo</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Comunidad</h3>
            <p className="text-xs text-gray-600 hidden sm:block">Conecta con otros</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center col-span-2 sm:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Talleres</h3>
            <p className="text-xs text-gray-600 hidden sm:block">Próximos eventos</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <ThinkificCourse />
          <SpotifyPodcasts />
        </div>

        {/* Additional Content */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Mi Progreso</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span className="text-gray-600">Curso Thinkific</span>
                  <span className="text-gray-600">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span className="text-gray-600">Podcasts Escuchados</span>
                  <span className="text-gray-600">12/20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Workshop */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Próximo Taller</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-900 text-sm sm:text-base">Taller de Duelo</h4>
                <span className="text-xs sm:text-sm text-red-600">4 Oct, 9 AM</span>
              </div>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                Honrando el recuerdo - Para personas que han vivido una pérdida.
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm">
                Confirmar Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
