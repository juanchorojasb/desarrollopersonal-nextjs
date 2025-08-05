"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

type PaymentStatus = 'approved' | 'declined' | 'pending' | 'error' | 'unknown'

interface PaymentResult {
  status: PaymentStatus
  referenceCode: string
  amount: string
  currency: string
  planName: string
  transactionId: string
  paymentMethod: string
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener parámetros de respuesta de PayU
    const state_pol = searchParams?.get('state_pol')
    const reference_sale = searchParams?.get('reference_sale')
    const value = searchParams?.get('value')
    const currency = searchParams?.get('currency')
    const transaction_id = searchParams?.get('transaction_id')
    const payment_method_name = searchParams?.get('payment_method_name')

    if (reference_sale && value) {
      // Mapear estados de PayU a nuestros estados
      const statusMap: Record<string, PaymentStatus> = {
        '4': 'approved',  // Transacción aprobada
        '6': 'declined',  // Transacción rechazada
        '7': 'pending',   // Transacción pendiente
        '104': 'error'    // Error en transacción
      }

      const status = statusMap[state_pol || ''] || 'unknown'

      setPaymentResult({
        status,
        referenceCode: reference_sale,
        amount: value,
        currency: currency || 'COP',
        planName: 'Plan de Suscripción', // Se puede mejorar obteniendo desde la BD
        transactionId: transaction_id || '',
        paymentMethod: payment_method_name || 'Desconocido'
      })
    }

    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando respuesta de pago...</p>
        </div>
      </div>
    )
  }

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: '¡Pago Exitoso!',
          description: 'Tu suscripción ha sido activada correctamente.',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          buttonText: 'Ir a Mi Dashboard',
          buttonHref: '/dashboard',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        }
      case 'declined':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Pago Rechazado',
          description: 'Tu pago no pudo ser procesado. Verifica tus datos e inténtalo de nuevo.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          buttonText: 'Intentar de Nuevo',
          buttonHref: '/pricing',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        }
      case 'pending':
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: 'Pago Pendiente',
          description: 'Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          buttonText: 'Ver Estado',
          buttonHref: '/dashboard',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        }
      default:
        return {
          icon: <AlertCircle className="h-16 w-16 text-gray-500" />,
          title: 'Estado Desconocido',
          description: 'No pudimos determinar el estado de tu pago. Contacta soporte si persiste.',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          buttonText: 'Contactar Soporte',
          buttonHref: '/pricing',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        }
    }
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error en la Respuesta
          </h1>
          <p className="text-gray-600 mb-6">
            No se recibieron datos de la transacción. Si realizaste un pago, contacta soporte.
          </p>
          <Link
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver a Planes
          </Link>
        </div>
      </div>
    )
  }

  const config = getStatusConfig(paymentResult.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className={`${config.bgColor} p-8 rounded-lg shadow-lg text-center max-w-lg w-full`}>
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">DesarrolloPersonal.uno</span>
          </Link>
        </div>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {config.icon}
        </div>

        {/* Status Message */}
        <h1 className={`text-3xl font-bold mb-4 ${config.textColor}`}>
          {config.title}
        </h1>
        
        <p className={`text-lg mb-6 ${config.textColor} opacity-90`}>
          {config.description}
        </p>

        {/* Payment Details */}
        <div className="bg-white rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Detalles de la Transacción</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Referencia:</span>
              <span className="font-mono">{paymentResult.referenceCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monto:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: paymentResult.currency,
                  minimumFractionDigits: 0
                }).format(parseFloat(paymentResult.amount))}
              </span>
            </div>
            {paymentResult.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">ID Transacción:</span>
                <span className="font-mono text-xs">{paymentResult.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Método de Pago:</span>
              <span>{paymentResult.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={config.buttonHref}
            className={`w-full ${config.buttonColor} text-white font-semibold py-3 px-6 rounded-lg transition-colors block`}
          >
            {config.buttonText}
          </Link>
          
          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors block"
          >
            Ir al Inicio
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Tienes problemas? {' '}
            <a href="mailto:soporte@desarrollopersonal.uno" className="text-blue-600 hover:underline">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando respuesta de pago...</p>
      </div>
    </div>
  )
}

export default function PaymentResponsePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentContent />
    </Suspense>
  )
}
