"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  buttonText: string
  isPopular?: boolean
  isFree?: boolean
  redirectUrl?: string
  currency: string
}

function formatPrice(price: number, currency: string): string {
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
}

export default function PricingPage() {
  const [country, setCountry] = useState('CO')
  const [testCode, setTestCode] = useState('')
  const [showTestInput, setShowTestInput] = useState(false)
  const [isActivatingTrial, setIsActivatingTrial] = useState(false)
  const { user } = useUser()

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Plan Gratuito',
      price: 0,
      currency: 'COP',
      description: 'Regulación Emocional para Empresarios',
      features: [
        'Curso completo de neurociencia empresarial',
        'Técnicas de liderazgo bajo presión',
        'Gestión del estrés empresarial',
        'Herramientas de inteligencia emocional'
      ],
      buttonText: 'Acceder Gratis',
      isFree: true,
      redirectUrl: 'https://psicognitiva.thinkific.com/'
    },
    {
      id: 'basic',
      name: 'Plan Básico',
      price: country === 'CO' ? 25000 : 6,
      currency: country === 'CO' ? 'COP' : 'USD',
      description: 'Acceso completo a todos los cursos grabados',
      features: [
        'Acceso a todos los cursos en video',
        '7 cursos especializados',
        '39 sesiones de contenido premium',
        'Progreso personalizado',
        'Certificados de completación',
        'Acceso móvil y descarga offline'
      ],
      buttonText: 'Suscribirse Ahora',
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: country === 'CO' ? 80000 : 20,
      currency: country === 'CO' ? 'COP' : 'USD',
      description: 'Todo lo básico + talleres en vivo + comunidad',
      features: [
        'Todo del Plan Básico',
        'Talleres en vivo los sábados',
        'Acceso a foros de comunidad',
        'Q&A con expertos',
        'Sesiones grupales interactivas',
        'Comunidad exclusiva'
      ],
      buttonText: 'Suscribirse Ahora'
    },
    {
      id: 'personal',
      name: 'Plan Personal',
      price: country === 'CO' ? 140000 : 35,
      currency: country === 'CO' ? 'COP' : 'USD',
      description: 'Todo lo premium + sesión personal mensual',
      features: [
        'Todo del Plan Premium',
        'Sesión personal virtual 1h/mes',
        'Consultoría individual',
        'Soporte prioritario',
        'Plan personalizado',
        'Acceso directo al especialista'
      ],
      buttonText: 'Suscribirse Ahora'
    }
  ]

  const handleTestCodeActivation = async () => {
    if (testCode !== 'PRUEBA') {
      alert('Código de prueba inválido. Use "PRUEBA" para activar modo trial.')
      return
    }

    if (!user) {
      alert('Debe estar logueado para activar el modo trial.')
      return
    }

    setIsActivatingTrial(true)

    try {
      console.log('🎯 FRONTEND: Making test activation request')
      console.log('🎯 FRONTEND: User data:', {
        email: user.emailAddresses[0]?.emailAddress,
        userId: user.id,
        testCode: 'PRUEBA'
      })
      
      const response = await fetch('/api/test/activate-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.emailAddresses[0]?.emailAddress,
          planId: 'basic',
          testCode: 'PRUEBA',
          userId: user.id
        })
      })

      console.log('🎯 FRONTEND: Response status:', response.status)
      console.log('🎯 FRONTEND: Response ok:', response.ok)
      
      const result = await response.json()
      console.log('🎯 FRONTEND: Response data:', result)
      
      if (response.ok && result.success) {
        alert(`¡Trial activado exitosamente!\n\nPlan: ${result.subscription.planName}\nVálido hasta: ${new Date(result.subscription.currentPeriodEnd).toLocaleDateString('es-CO')}\n\nYa puedes acceder a todos los cursos en el dashboard.`)
        
        // Redirigir al dashboard
        window.location.href = '/dashboard/cursos'
      } else {
        // Manejar errores del servidor
        const errorMessage = result.error || result.details || 'Error desconocido'
        console.error('🎯 FRONTEND: Server error details:', {
          status: response.status,
          statusText: response.statusText,
          result
        })
        alert(`Error al activar trial (${response.status}): ${errorMessage}`)
      }
    } catch (error) {
      console.error('🎯 FRONTEND: Network/Parse error activating trial:', error)
      alert(`Error de conexión al activar el modo trial: ${error instanceof Error ? error.message : 'Error desconocido'}. Intenta nuevamente.`)
    } finally {
      setIsActivatingTrial(false)
    }
  }

  const handleSubscribe = async (plan: Plan) => {
    if (plan.isFree && plan.redirectUrl) {
      window.open(plan.redirectUrl, '_blank')
      return
    }

    if (!user) {
      window.location.href = '/sign-up'
      return
    }

    try {
      const response = await fetch('/api/payu/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          country: country,
          currency: plan.currency,
          billingCycle: 'monthly'
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        if (result.payment?.checkoutUrl) {
          window.location.href = result.payment.checkoutUrl
        } else {
          alert('Error: No se pudo generar URL de pago')
          console.error('Payment creation failed:', result)
        }
      } else {
        // Manejar errores del servidor
        const errorMessage = result.error || result.details || 'Error desconocido'
        alert(`Error: ${errorMessage}`)
        console.error('Server error:', result)
      }
    } catch (error) {
      console.error('Network/Parse error processing payment:', error)
      alert('Error de conexión al procesar el pago. Intenta nuevamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elige el Plan Perfecto para Ti
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transforma tu bienestar mental con nuestra metodología científica
          </p>

          {/* Test Code Section */}
          <div className="max-w-md mx-auto">
            <SignedIn>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm font-medium text-yellow-800">💡 Modo Desarrollo</span>
                </div>
                
                {!showTestInput ? (
                  <button
                    onClick={() => setShowTestInput(true)}
                    className="text-sm text-yellow-700 hover:text-yellow-900 underline"
                  >
                    ¿Tienes un código de prueba?
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Ingresa código de prueba"
                      value={testCode}
                      onChange={(e) => setTestCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center font-mono"
                      disabled={isActivatingTrial}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleTestCodeActivation}
                        disabled={isActivatingTrial || !testCode}
                        className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {isActivatingTrial ? 'Activando...' : 'Activar Trial'}
                      </button>
                      <button
                        onClick={() => {
                          setShowTestInput(false)
                          setTestCode('')
                        }}
                        className="px-4 py-2 text-yellow-700 hover:text-yellow-900 text-sm"
                        disabled={isActivatingTrial}
                      >
                        Cancelar
                      </button>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Ingresa "PRUEBA" para activar acceso inmediato por 30 días
                    </p>
                  </div>
                )}
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <Link href="/sign-up" className="font-medium hover:underline">
                    Registrarte gratis
                  </Link> para acceder a códigos de prueba
                </p>
              </div>
            </SignedOut>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.isPopular ? 'border-blue-500 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {plan.isFree ? 'Gratis' : formatPrice(plan.price, plan.currency)}
                  {!plan.isFree && <span className="text-lg text-gray-500">/mes</span>}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
