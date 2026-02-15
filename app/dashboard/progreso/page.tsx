import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

export default async function ProgresoPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Progreso</h1>
          <p className="text-gray-600">Visualiza estadísticas detalladas de tu progreso de aprendizaje.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard de Progreso</h2>
          <p className="text-gray-600">Próximamente tendrás acceso a estadísticas detalladas, gráficos de progreso y métricas de aprendizaje.</p>
        </div>
      </div>
    </div>
  )
}