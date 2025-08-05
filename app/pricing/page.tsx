"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'

interface Plan {
  id: string
  name: string
  price: number
  quarterlyPrice: number | null
  quarterlyDiscount: number | null
  description: string
  features: string[]
  hasQuarterlyOption: boolean
  buttonText: string
  isPopular?: boolean
  maxCourses: number
  hasLiveWorkshops: boolean
  hasSupport: boolean
  hasCertificates: boolean
  hasCoaching: boolean
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

function PlanCard({ plan }: { plan: Plan }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly')
  const { user } = useUser()
  
  const currentPrice = billingCycle === 'quarterly' && plan.quarterlyPrice ? plan.quarterlyPrice : plan.price
  const isQuarterly = billingCycle === 'quarterly'
  
  const handleSubscribe = async () => {
    if (!user) {
      // Si no está logueado, redirigir a sign-up
      window.location.href = '/sign-up'
      return
    }

    try {
      // Mostrar loading
      const button = document.activeElement as HTMLButtonElement
      const originalText = button.textContent
      button.textContent = 'Procesando...'
      button.disabled = true

      // Llamar a API para crear checkout de PayU
      const response = await fetch('/api/payu/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle: billingCycle
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirigir a PayU checkout
        window.location.href = data.checkoutUrl
      } else {
        alert(`Error: ${data.error}`)
        // Restaurar botón
        button.textContent = originalText
        button.disabled = false
      }

    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Error al procesar el pago. Inténtalo de nuevo.')
      
      // Restaurar botón
      const button = document.activeElement as HTMLButtonElement
      button.disabled = false
      button.textContent = 'Suscribirse Ahora'
    }
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${plan.isPopular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
      {plan.isPopular && (
        <div className="text-center mb-4">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Más Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        {/* Toggle de facturación */}
        {plan.hasQuarterlyOption && (
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('quarterly')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'quarterly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trimestral
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="text-4xl font-bold text-gray-900">
            {formatPrice(currentPrice)}
            <span className="text-lg text-gray-500">
              {isQuarterly ? '/3 meses' : '/mes'}
            </span>
          </div>
          
          {/* Mostrar descuento trimestral */}
          {isQuarterly && plan.quarterlyDiscount && (
            <div className="text-sm text-green-600 font-medium">
              ¡Ahorra {formatPrice(plan.quarterlyDiscount)}!
            </div>
          )}
          
          {/* Precio original tachado para trimestral */}
          {isQuarterly && plan.quarterlyPrice && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(plan.price * 3)} / 3 meses
            </div>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <SignedOut>
        <Link
          href="/sign-up"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all text-center block"
        >
          {plan.buttonText}
        </Link>
      </SignedOut>

      <SignedIn>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          onClick={handleSubscribe}
        >
          Suscribirse Ahora
        </button>
      </SignedIn>
    </div>
  )
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans')
        const data = await response.json()
        
        if (data.success) {
          setPlans(data.plans)
        } else {
          setError(data.error || 'Error al cargar los planes')
        }
      } catch (err) {
        setError('Error de conexión al cargar los planes')
        console.error('Error fetching plans:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando planes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header simple */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">DesarrolloPersonal.uno</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Elige tu Plan de
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {" "}Crecimiento
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Comienza tu transformación personal hoy mismo
        </p>
        
        {/* Destacar talleres en vivo */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-3">
            <span className="text-2xl mr-2">🎓</span>
            <h3 className="text-lg font-semibold text-gray-900">Talleres en Vivo</h3>
          </div>
          <p className="text-gray-700">
            <strong>Planes Premium y VIP:</strong> Acceso a 2 talleres en vivo al mes
            <br />
            <span className="text-blue-600 font-medium">Primer y tercer sábado de cada mes • 2-3 horas de sesiones interactivas</span>
          </p>
        </div>
        
        <p className="text-gray-500 mb-8">
          Cancela cuando quieras • Sin compromisos • Descuentos por pago trimestral
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Cuándo son los talleres en vivo?</h3>
              <p className="text-gray-600">Los talleres se realizan el primer y tercer sábado de cada mes, 2 sesiones de 2-3 horas cada una, disponibles en planes Premium y VIP.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Puedo ver las grabaciones?</h3>
              <p className="text-gray-600">Sí, todas las sesiones en vivo quedan grabadas y disponibles para verlas cuando quieras.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Hay descuentos por pago trimestral?</h3>
              <p className="text-gray-600">Sí, planes Básico y Premium tienen descuentos especiales al pagar 3 meses adelantados.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Puedo cancelar cuando quiera?</h3>
              <p className="text-gray-600">Sí, puedes cancelar tu suscripción en cualquier momento desde tu dashboard sin penalizaciones.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué incluye el coaching 1:1?</h3>
              <p className="text-gray-600">El plan VIP incluye una sesión mensual personalizada de 1 hora con una psicóloga experta.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">¿Los certificados tienen validez?</h3>
              <p className="text-gray-600">Sí, nuestros certificados están avalados por psicólogas profesionales colegiadas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar tu vida?
          </h2>
          <p className="text-xl text-blue-100 mb-4">
            Únete a miles de personas que ya están creciendo con nosotros
          </p>
          <p className="text-blue-200 mb-8">
            ✨ Talleres en vivo 2 veces al mes • 💰 Descuentos trimestrales • 🎓 Certificados oficiales
          </p>
          <SignedOut>
            <Link
              href="/sign-up"
              className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-block text-lg mr-4"
            >
              Comenzar Gratis
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors inline-block text-lg"
            >
              Ver Planes
            </Link>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
