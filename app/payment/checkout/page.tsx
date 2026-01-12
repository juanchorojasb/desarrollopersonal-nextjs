import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

interface Plan {
  id: string
  name: string
  price: string
  priceUSD: string
  features: string[]
}

const plans: Record<string, Plan> = {
  basic: {
    id: 'basic',
    name: 'Plan Básico',
    price: '25,000 COP',
    priceUSD: '5 USD',
    features: [
      'Acceso completo a todos los cursos',
      'Progreso y estadísticas detalladas',
      'Certificados básicos',
      'Soporte por email',
      'Descarga de materiales'
    ]
  },
  complete: {
    id: 'complete',
    name: 'Plan Completo',
    price: '50,000 COP',
    priceUSD: '10 USD',
    features: [
      'Todo del Plan Básico',
      'Talleres en vivo',
      'Comunidad premium',
      'Certificados avanzados',
      'Soporte prioritario',
      'Acceso temprano a contenido'
    ]
  },
  personal: {
    id: 'personal',
    name: 'Plan Personal',
    price: '40,000 COP',
    priceUSD: '8 USD',
    features: [
      'Todo del Plan Completo',
      'Acompañamiento personalizado',
      'Sesiones 1-a-1',
      'Contenido exclusivo',
      'Coaching personalizado',
      'Acceso a mentores expertos'
    ]
  }
}

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string; promo?: string }>
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const params = await searchParams
  const planId = params.plan || 'basic'
  const promoCode = params.promo
  const selectedPlan = plans[planId] || plans.basic
  
  const isPromoValid = promoCode?.toLowerCase() === 'prueba'
  const hasDiscount = isPromoValid

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">
            Finaliza tu suscripción y comienza tu viaje de desarrollo personal
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de Pago */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de Pago</h2>
            
            <form className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input 
                      type="text" 
                      defaultValue={user.name?.split(' ')[0] || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input 
                      type="text" 
                      defaultValue={user.name?.split(' ')[1] || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input 
                      type="email" 
                      defaultValue={user.email || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Facturación */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dirección de Facturación</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Calle, número, piso"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <select 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar país</option>
                      <option value="ES">España</option>
                      <option value="MX">México</option>
                      <option value="AR">Argentina</option>
                      <option value="CO">Colombia</option>
                      <option value="US">Estados Unidos</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información de Tarjeta */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Tarjeta</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tarjeta *
                    </label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Expiración *
                      </label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC *
                      </label>
                      <input 
                        type="text" 
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre en la Tarjeta *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Como aparece en la tarjeta"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-start">
                <input type="checkbox" required className="w-4 h-4 text-blue-600 mt-1 mr-3" />
                <label className="text-sm text-gray-600">
                  Acepto los{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    política de privacidad
                  </a>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {hasDiscount ? 'Activar Plan - Gratis' : `Completar Pago - ${selectedPlan.priceUSD}`}
              </button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>
            
            {/* Plan Seleccionado */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{selectedPlan.name}</h3>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">{selectedPlan.price}</span>
                  <div className="text-sm text-gray-600">{selectedPlan.priceUSD}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Facturación mensual</p>
              
              <ul className="space-y-2 text-sm">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Desglose de Precios */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <div className="text-right">
                  <span className="text-gray-900">{selectedPlan.price}</span>
                  <div className="text-sm text-gray-600">{selectedPlan.priceUSD}</div>
                </div>
              </div>
              {hasDiscount && (
                <div className="flex items-center justify-between text-green-600">
                  <span className="font-medium">Descuento (1 mes gratis)</span>
                  <div className="text-right font-medium">
                    <span>-{selectedPlan.price}</span>
                    <div className="text-sm">-{selectedPlan.priceUSD}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">IVA (19%)</span>
                <div className="text-right">
                  <span className="text-gray-900">Incluido</span>
                  <div className="text-sm text-gray-600">Incluido</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-gray-900">{hasDiscount ? 'Gratis' : selectedPlan.price}</span>
                    <div className="text-sm text-gray-600">{hasDiscount ? 'Free' : selectedPlan.priceUSD}</div>
                  </div>
                </div>
              </div>
              {hasDiscount && (
                <div className="bg-green-50 rounded-lg p-3 mt-3">
                  <div className="text-green-800 text-sm font-medium text-center">
                    ✓ Código promocional aplicado: Primer mes gratis
                  </div>
                </div>
              )}
            </div>

            {/* Información Adicional */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">📅 Información de Facturación</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Facturación automática cada mes</li>
                <li>• Cancela en cualquier momento</li>
                <li>• Sin compromiso de permanencia</li>
                <li>• Acceso inmediato tras el pago</li>
              </ul>
            </div>

            {/* Métodos de Pago Aceptados */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Métodos de Pago Aceptados</h4>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AMEX</span>
                </div>
                <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Garantía */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Garantía de 30 días</h3>
              <p className="text-sm text-green-800">
                Si no estás completamente satisfecho, te devolvemos el dinero sin preguntas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}