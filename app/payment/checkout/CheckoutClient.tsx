'use client'

import { useState } from 'react'

interface CheckoutClientProps {
  userEmail: string
  userName: string | null
  planId: string
  planName: string
  planPrice: string
}

export default function CheckoutClient({
  userEmail,
  userName,
  planId,
  planName,
  planPrice
}: CheckoutClientProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Extraer el monto (sin comas ni COP)
      const amount = parseInt(planPrice.replace(/[^0-9]/g, ''))

      // Crear transacción
      const response = await fetch('/api/payment/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          amount,
          currency: 'COP'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear transacción')
      }

      // Redirigir al checkout de Wompi
      const wompiUrl = `https://checkout.wompi.co/p/?public-key=${data.publicKey}&currency=${data.currency}&amount-in-cents=${data.amountInCents}&reference=${data.reference}&signature:integrity=${data.signature}&redirect-url=${encodeURIComponent(data.redirectUrl)}`

      window.location.href = wompiUrl
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el pago. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Procesando...' : 'Proceder al Pago'}
    </button>
  )
}
