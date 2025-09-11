import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { plan } = await req.json()
    
    if (!plan || !['free', 'basic', 'complete', 'personal'].includes(plan)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
    }

    // Update user metadata with new plan
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan: plan
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Plan cambiado a ${plan} exitosamente` 
    })

  } catch (error) {
    console.error('Error changing plan:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}