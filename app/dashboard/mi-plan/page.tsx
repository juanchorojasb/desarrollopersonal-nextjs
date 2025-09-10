import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function MiPlanPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Plan</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu suscripción y plan actual
          </p>
        </div>

        {/* Plan Actual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Plan Actual</h2>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Activo
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Plan Premium</h3>
              <p className="text-gray-600 mb-4">Acceso completo a todos los cursos y talleres</p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Acceso ilimitado a cursos
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Talleres en vivo
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Soporte prioritario
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Certificados de finalización
                </li>
              </ul>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">€29.99</div>
                <div className="text-sm text-gray-600">por mes</div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Próxima facturación: 15 de octubre, 2024</p>
                  <p>Método de pago: •••• 4242</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uso del Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Uso del Plan</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Cursos Completados</div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">de 10 disponibles</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-2">Talleres Asistidos</div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">de 5 este mes</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-2">Horas de Contenido</div>
              <div className="text-2xl font-bold text-gray-900">24h</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '48%'}}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">de 50h disponibles</div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestionar Plan</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Actualizar Plan
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Cancelar Suscripción
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
              Cambiar Método de Pago
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
              Historial de Pagos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}