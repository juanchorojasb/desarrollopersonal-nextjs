import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function SuscripcionPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Suscripción</h1>
          <p className="mt-2 text-gray-600">
            Estado y detalles de tu suscripción actual
          </p>
        </div>

        {/* Estado de Suscripción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Suscripción Premium</h2>
              <p className="text-gray-600">Inicio: 15 de septiembre, 2024</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Activa
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 font-medium text-sm">PRECIO MENSUAL</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">€29.99</div>
              <div className="text-sm text-gray-600 mt-1">Facturación mensual</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 font-medium text-sm">PRÓXIMA FACTURACIÓN</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">15 Oct</div>
              <div className="text-sm text-gray-600 mt-1">2024</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 font-medium text-sm">MÉTODO DE PAGO</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">•••• 4242</div>
              <div className="text-sm text-gray-600 mt-1">Visa</div>
            </div>
          </div>
        </div>

        {/* Beneficios Incluidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Beneficios Incluidos</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Acceso ilimitado a todos los cursos</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Talleres en vivo semanales</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Comunidad privada de miembros</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Certificados de finalización</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Soporte prioritario 24/7</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Descarga de materiales</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Sesiones 1:1 mensuales</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-gray-700">Acceso temprano a nuevos contenidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Pagos Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pagos Recientes</h2>
            <a href="/dashboard/facturas" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todos
            </a>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">Suscripción Premium</div>
                <div className="text-sm text-gray-600">15 Sep 2024</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">€29.99</div>
                <div className="text-sm text-green-600">Pagado</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">Suscripción Premium</div>
                <div className="text-sm text-gray-600">15 Ago 2024</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">€29.99</div>
                <div className="text-sm text-green-600">Pagado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de Gestión */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestionar Suscripción</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Cambiar Plan
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
              Actualizar Pago
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Pausar Suscripción
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Puedes cancelar tu suscripción en cualquier momento. 
              Mantendrás acceso hasta el final del período de facturación actual.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}