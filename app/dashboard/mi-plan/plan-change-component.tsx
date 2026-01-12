'use client'

import { useState } from 'react'
import { Plan, PLANS } from '@/lib/plans'
import { useRouter } from 'next/navigation'

interface PlanChangeComponentProps {
  currentPlan: Plan
}

export default function PlanChangeComponent({ currentPlan }: PlanChangeComponentProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(currentPlan)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handlePlanChange = async () => {
    if (selectedPlan === currentPlan) {
      setMessage('Ya tienes este plan seleccionado')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: selectedPlan }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        // Refresh the page to show updated plan
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Error al cambiar el plan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🧪</span>
        <h2 className="text-xl font-semibold text-gray-900">Cambio de Plan para Pruebas</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Esta funcionalidad es solo para pruebas. Permite cambiar temporalmente tu plan para verificar 
        el control de acceso a cursos y funcionalidades.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Object.entries(PLANS).map(([planKey, planConfig]) => (
          <label key={planKey} className="cursor-pointer">
            <input
              type="radio"
              name="plan"
              value={planKey}
              checked={selectedPlan === planKey}
              onChange={(e) => setSelectedPlan(e.target.value as Plan)}
              className="sr-only"
            />
            <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
              selectedPlan === planKey
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <div className="font-medium text-sm">{planConfig.displayName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {planKey === 'free' ? 'Gratis' :
                 planKey === 'basic' ? '15,000 COP' :
                 planKey === 'complete' ? '30,000 COP' :
                 '40,000 COP'}
              </div>
              {currentPlan === planKey && (
                <div className="text-xs text-green-600 font-medium mt-1">Actual</div>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePlanChange}
          disabled={isLoading || selectedPlan === currentPlan}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cambiando...' : 'Cambiar Plan'}
        </button>
        
        {message && (
          <div className="text-sm font-medium">{message}</div>
        )}
      </div>
    </div>
  )
}