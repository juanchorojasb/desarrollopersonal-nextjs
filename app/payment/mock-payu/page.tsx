"use client"
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'

function MockPayUContent() {
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(false)
  
  // Extraer parámetros de la URL
  const merchantId = searchParams?.get('merchantId')
  const amount = searchParams?.get('amount')
  const description = searchParams?.get('description')
  const referenceCode = searchParams?.get('referenceCode')
  const responseUrl = searchParams?.get('responseUrl')

  const handleApprovePayment = async () => {
    setProcessing(true)
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirigir a página de respuesta con parámetros de éxito
    const params = new URLSearchParams({
      state_pol: '4', // Approved
      reference_sale: referenceCode || 'TEST_REF',
      value: amount || '80000',
      currency: 'COP',
      transaction_id: `TXN_${Date.now()}`,
      payment_method_name: 'VISA'
    })
    
    window.location.href = `${responseUrl}?${params.toString()}`
  }

  const handleDeclinePayment = async () => {
    setProcessing(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirigir con parámetros de rechazo
    const params = new URLSearchParams({
      state_pol: '6', // Declined
      reference_sale: referenceCode || 'TEST_REF',
      value: amount || '80000',
      currency: 'COP',
      transaction_id: `TXN_${Date.now()}`,
      payment_method_name: 'VISA'
    })
    
    window.location.href = `${responseUrl}?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header PayU */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              PayU Latam - MODO PRUEBA
            </div>
          </div>
          
          <div className="text-center text-gray-600 mb-6">
            🧪 <strong>Simulador de PayU</strong> - Para testing del sistema de suscripciones
          </div>
        </div>

        {/* Detalles del pago */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Confirmar Pago
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Comercio:</span>
              <span className="font-semibold">DesarrolloPersonal.uno</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Descripción:</span>
              <span className="font-semibold">{description || 'Plan de Suscripción'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-bold text-2xl text-green-600">
                {amount ? new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(parseInt(amount)) : '$80.000'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Referencia:</span>
              <span className="font-mono text-sm">{referenceCode || 'TEST_REF'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant ID:</span>
              <span className="font-mono">{merchantId || '508029'}</span>
            </div>
          </div>
        </div>

        {/* Simulación de tarjeta */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💳 Datos de Tarjeta (Simulado)
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Tarjeta</label>
              <input 
                type="text" 
                value="4037 9976 2327 1984" 
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input 
                  type="text" 
                  value="12/25" 
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input 
                  type="text" 
                  value="123" 
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <button
              onClick={handleApprovePayment}
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              {processing ? '⏳ Procesando...' : '✅ Simular Pago Exitoso'}
            </button>
            
            <button
              onClick={handleDeclinePayment}
              disabled={processing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              {processing ? '⏳ Procesando...' : '❌ Simular Pago Rechazado'}
            </button>
            
            <Link
              href="/pricing"
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors text-center block"
            >
              ← Cancelar y Volver
            </Link>
          </div>
        </div>

        {/* Info de testing */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Modo Testing</h4>
          <p className="text-blue-800 text-sm">
            Este es un simulador para probar el flujo de suscripciones. 
            Los pagos no son reales. El webhook y confirmación funcionan igual que PayU real.
          </p>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando simulador PayU...</p>
      </div>
    </div>
  )
}

export default function MockPayUPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MockPayUContent />
    </Suspense>
  )
}
