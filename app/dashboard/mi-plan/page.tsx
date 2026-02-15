import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'
import { getUserPlan, PLANS } from '@/lib/plans'
import Link from 'next/link'
import { Crown, TrendingUp, Clock, Award, ArrowRight, CheckCircle } from 'lucide-react'

export default async function MiPlanPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const currentPlan = getUserPlan(user.subscriptionStatus)
  const planConfig = PLANS[currentPlan]

  // Planes disponibles para comparar
  const allPlans = Object.entries(PLANS).filter(([key]) => key !== 'free')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-8 h-8 text-purple-600" />
            Mi Plan
          </h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu suscripción y descubre nuevas funcionalidades
          </p>
        </div>

        {/* Plan Actual - Destacado */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Plan Activo
              </div>
              <h2 className="text-3xl font-bold">{planConfig.displayName}</h2>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{planConfig.price}</div>
              {currentPlan !== 'free' && (
                <div className="text-purple-100">{planConfig.priceUSD} mensuales</div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-purple-100">Incluye:</h3>
              <ul className="space-y-2">
                {planConfig.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {currentPlan !== 'free' && (
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-sm text-purple-100 mb-1">Próxima facturación</div>
                  <div className="text-lg font-semibold">15 de marzo, 2026</div>
                  <div className="text-sm text-purple-100 mt-2">Método: Wompi •••• 4242</div>
                </div>
              )}

              {currentPlan === 'free' && (
                <Link href="/pricing">
                  <button className="w-full bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    Mejorar Plan
                    <TrendingUp className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Uso del Plan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Uso del Plan
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Cursos Completados</div>
                  <div className="text-3xl font-bold text-indigo-600">8</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{width: '80%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">de 10 disponibles</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Talleres Asistidos</div>
                  <div className="text-3xl font-bold text-green-600">3</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-green-500 h-2 rounded-full transition-all" style={{width: '60%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">de 5 este mes</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Horas de Contenido</div>
                  <div className="text-3xl font-bold text-purple-600">24h</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-purple-500 h-2 rounded-full transition-all" style={{width: '48%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">de 50h disponibles</div>
                </div>
              </div>
            </div>

            {/* Comparar Planes */}
            {currentPlan !== 'personal' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Mejora tu Plan
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  {allPlans.map(([key, plan]) => (
                    <div
                      key={key}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        key === currentPlan
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-center mb-3">
                        <h3 className="font-semibold text-gray-900">{plan.displayName}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</div>
                        <div className="text-sm text-gray-600">{plan.priceUSD}</div>
                      </div>

                      {key === currentPlan ? (
                        <div className="bg-indigo-100 text-indigo-700 text-center py-2 rounded-lg text-sm font-medium">
                          Plan Actual
                        </div>
                      ) : PLANS[key as keyof typeof PLANS].level > PLANS[currentPlan].level ? (
                        <Link href="/pricing">
                          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            Actualizar
                          </button>
                        </Link>
                      ) : (
                        <div className="bg-gray-100 text-gray-500 text-center py-2 rounded-lg text-sm">
                          Plan Inferior
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acciones Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <Link href="/pricing">
                  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    Ver Todos los Planes
                  </button>
                </Link>
                {currentPlan !== 'free' && (
                  <>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors text-sm">
                      Actualizar Pago
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors text-sm">
                      Historial
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Beneficios Premium */}
            {currentPlan === 'free' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🌟 Beneficios Premium</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Acceso ilimitado a todos los cursos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Talleres en vivo mensuales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Comunidad privada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Certificados oficiales</span>
                  </li>
                </ul>
                <Link href="/pricing">
                  <button className="w-full mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    Mejorar Ahora
                  </button>
                </Link>
              </div>
            )}

            {/* Soporte */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💬 ¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nuestro equipo está aquí para ayudarte con cualquier pregunta sobre tu plan.
              </p>
              <Link href="/dashboard/community/soporte">
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Contactar Soporte
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
