import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'
import CheckoutClient from './CheckoutClient'

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
      'Todo lo del Plan Básico',
      'Acceso a comunidad premium',
      'Talleres en vivo mensuales',
      'Certificados avanzados',
      'Soporte prioritario',
      'Acceso anticipado a nuevos cursos'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium',
    price: '160,000 COP',
    priceUSD: '32 USD',
    features: [
      'Todo lo del Plan Completo',
      'Sesiones 1-a-1 con mentores',
      'Contenido exclusivo premium',
      'Coaching personalizado',
      'Acceso prioritario a eventos',
      'Red de networking exclusiva'
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
    const params = await searchParams
    const planId = params.plan || 'basic'
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent('/payment/checkout?plan=' + planId)}`)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Completa tu suscripción a {selectedPlan.name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Información de Contacto</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      defaultValue={user.name?.split(' ')[0] || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      defaultValue={user.name?.split(' ')[1] || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Método de Pago</h2>
              <div className="space-y-3">
                <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">💳 Wompi (Tarjeta/PSE/Nequi)</span>
                    <span className="text-blue-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Resumen de Compra</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>{selectedPlan.name}</span>
                  <span>{selectedPlan.price}</span>
                </div>

                {hasDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento promocional</span>
                    <span>-100%</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{hasDiscount ? '$0 COP' : selectedPlan.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Facturado mensualmente</p>
                </div>

                <CheckoutClient
                  userEmail={user.email}
                  userName={user.name}
                  planId={selectedPlan.id}
                  planName={selectedPlan.name}
                  planPrice={selectedPlan.price}
                />

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2">Incluye:</h3>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
