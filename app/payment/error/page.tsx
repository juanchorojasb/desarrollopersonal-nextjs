import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function PaymentErrorPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error en el Pago</h1>
          <p className="text-xl text-gray-600">
            Lo sentimos, no pudimos procesar tu pago
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">¿Qué ha ocurrido?</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="text-red-600 mr-3 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-900 font-medium mb-2">Pago Rechazado</h3>
                <p className="text-red-800 text-sm">
                  Tu tarjeta ha sido rechazada. Esto puede deberse a fondos insuficientes, 
                  información incorrecta de la tarjeta, o restricciones del banco.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Intento de Transacción:</span>
              <span className="font-medium text-gray-900">#TXN-2024-09-ERROR</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Plan Seleccionado:</span>
              <span className="font-medium text-gray-900">Premium Mensual</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Monto:</span>
              <span className="font-medium text-gray-900">€36.29</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Fecha y Hora:</span>
              <span className="font-medium text-gray-900">10 de septiembre, 2024 - 14:30</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-red-600">Fallido</span>
            </div>
          </div>
        </div>

        {/* Possible Solutions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Posibles Soluciones</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Verifica los datos de tu tarjeta</h3>
                  <p className="text-sm text-gray-600">
                    Asegúrate de que el número, fecha de expiración y CVC sean correctos
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Revisa el saldo disponible</h3>
                  <p className="text-sm text-gray-600">
                    Confirma que tienes fondos suficientes en tu cuenta
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Contacta con tu banco</h3>
                  <p className="text-sm text-gray-600">
                    Tu banco podría estar bloqueando la transacción por seguridad
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Usa otra tarjeta</h3>
                  <p className="text-sm text-gray-600">
                    Intenta con una tarjeta diferente si tienes otra disponible
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Método de pago alternativo</h3>
                  <p className="text-sm text-gray-600">
                    Considera usar PayPal u otro método de pago disponible
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 text-sm font-bold">6</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Espera e intenta más tarde</h3>
                  <p className="text-sm text-gray-600">
                    A veces los problemas temporales se resuelven solos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">¿Qué quieres hacer ahora?</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="/payment/checkout" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Intentar de Nuevo
            </a>
            <a 
              href="/pricing" 
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors text-center"
            >
              Ver Planes
            </a>
            <a 
              href="/dashboard/ayuda" 
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors text-center"
            >
              Contactar Soporte
            </a>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-yellow-50 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-3 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">¿Necesitas Ayuda?</h3>
              <p className="text-yellow-800 mb-4">
                Si sigues teniendo problemas con el pago, nuestro equipo de soporte está listo para ayudarte.
              </p>
              <div className="space-y-2 text-sm text-yellow-800">
                <p><strong>Email:</strong> soporte@desarrollopersonal.uno</p>
                <p><strong>Teléfono:</strong> +34 900 123 456</p>
                <p><strong>Chat en vivo:</strong> Disponible Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Métodos de Pago Alternativos</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
                <h3 className="font-medium text-gray-900">PayPal</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Paga de forma segura con tu cuenta PayPal o tarjeta a través de PayPal
              </p>
              <a 
                href="/payment/checkout?method=paypal" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Usar PayPal →
              </a>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">TB</span>
                </div>
                <h3 className="font-medium text-gray-900">Transferencia Bancaria</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Realiza el pago mediante transferencia bancaria directa
              </p>
              <a 
                href="/payment/checkout?method=bank" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver Datos Bancarios →
              </a>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <a 
            href="/dashboard" 
            className="inline-block px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}