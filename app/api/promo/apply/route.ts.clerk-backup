import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { promoCode, selectedPlan } = await request.json()

    if (promoCode.toLowerCase() !== 'prueba') {
      return NextResponse.json({ error: 'Código promocional inválido' }, { status: 400 })
    }

    if (!['basic', 'complete', 'personal'].includes(selectedPlan)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
    }

    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1)

    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan: selectedPlan,
        planExpiresAt: expirationDate.toISOString(),
        promoUsed: 'prueba'
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `¡Bienvenido! Tu plan ${selectedPlan} está activo por 1 mes`,
      plan: selectedPlan,
      expiresAt: expirationDate.toISOString()
    })

  } catch (error) {
    console.error('Error aplicando código promocional:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}