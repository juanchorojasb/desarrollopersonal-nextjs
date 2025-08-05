import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { payuService } from '@/lib/payu'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, billingCycle } = body

    if (!planId || !billingCycle) {
      return NextResponse.json(
        { success: false, error: 'Plan ID y ciclo de facturación son requeridos' },
        { status: 400 }
      )
    }

    // Obtener información del plan
    const plan = await prisma.plan.findUnique({
      where: { name: planId }
    })

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    // Obtener información del usuario de Clerk
    const { currentUser } = await import('@clerk/nextjs/server')
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado en Clerk' },
        { status: 404 }
      )
    }

    // Verificar si el usuario existe en nuestra BD, si no, crearlo
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      // Crear usuario en nuestra BD
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || null
        }
      })
      console.log('✅ Usuario creado en BD:', dbUser.id)
    }

    // Calcular precio según ciclo de facturación
    let amount: number
    let description: string

    if (billingCycle === 'quarterly' && plan.quarterlyPrice) {
      amount = plan.quarterlyPrice / 100 // Convertir de centavos a pesos
      description = `${plan.displayName} - Pago Trimestral`
    } else {
      amount = plan.monthlyPrice / 100 // Convertir de centavos a pesos
      description = `${plan.displayName} - Pago Mensual`
    }

    // Preparar datos de pago para PayU
    const paymentData = {
      planId: plan.name,
      planName: plan.displayName,
      amount: amount,
      currency: 'COP',
      billingCycle: billingCycle as 'monthly' | 'quarterly',
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      userId: userId,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Usuario',
      description: description
    }

    // Crear URL de checkout con PayU
    const payuResponse = payuService.createCheckoutUrl(paymentData)

    if (!payuResponse.success) {
      return NextResponse.json(
        { success: false, error: payuResponse.error },
        { status: 500 }
      )
    }

    // Guardar intento de pago en base de datos (para tracking)
    const subscription = await prisma.subscription.create({
      data: {
        userId: dbUser.id, // Usar el ID de la BD, no de Clerk
        planId: plan.id,
        status: 'PENDING',
        billingCycle: billingCycle.toUpperCase() as 'MONTHLY' | 'QUARTERLY',
        priceAmount: billingCycle === 'quarterly' ? plan.quarterlyPrice || plan.monthlyPrice : plan.monthlyPrice,
        currency: 'COP'
      }
    })

    console.log('✅ Suscripción pendiente creada:', subscription.id)

    return NextResponse.json({
      success: true,
      checkoutUrl: payuResponse.checkoutUrl,
      referenceCode: payuResponse.referenceCode,
      subscriptionId: subscription.id,
      amount: amount,
      currency: 'COP',
      description: description,
      userCreated: !dbUser ? false : true // Indicar si se creó el usuario
    })

  } catch (error) {
    console.error('Error creating PayU checkout:', error)
    
    // Log más detallado del error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

