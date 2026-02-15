import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server-auth'
import crypto from 'crypto'

const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { planId, amount, currency = 'COP' } = await req.json()

    // Generar reference única
    const reference = `DP-${Date.now()}-${user.id.substring(0, 8)}`
    const amountInCents = amount * 100

    // Calcular signature de integridad
    const signatureString = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`
    const signature = crypto.createHash('sha256').update(signatureString).digest('hex')

    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?ref=${reference}`

    return NextResponse.json({
      publicKey: WOMPI_PUBLIC_KEY,
      reference,
      signature,
      amountInCents,
      currency,
      customerEmail: user.email,
      redirectUrl,
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Error al crear transacción' },
      { status: 500 }
    )
  }
}
