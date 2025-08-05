import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { payuService } from '@/lib/payu'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // PayU envía datos como form-urlencoded
    const formData = await request.formData()
    
    // Convertir FormData a objeto
    const webhookData: Record<string, string> = {}
    formData.forEach((value, key) => {
      webhookData[key] = value.toString()
    })

    console.log('PayU Webhook received:', webhookData)

    // Procesar respuesta con el servicio PayU
    const paymentResult = payuService.processWebhookResponse(webhookData)

    if (!paymentResult.isValid) {
      console.error('Invalid signature from PayU webhook')
      return NextResponse.json(
        { success: false, error: 'Firma inválida' },
        { status: 400 }
      )
    }

    // Buscar la suscripción en base de datos
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: paymentResult.userId,
        planId: {
          // Buscar por nombre del plan
          in: await prisma.plan.findMany({
            where: { name: paymentResult.planId },
            select: { id: true }
          }).then(plans => plans.map(p => p.id))
        },
        status: 'PENDING'
      },
      include: {
        plan: true
      }
    })

    if (!subscription) {
      console.error('Subscription not found for webhook:', paymentResult)
      return NextResponse.json(
        { success: false, error: 'Suscripción no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar suscripción según el resultado del pago
    let subscriptionStatus: 'ACTIVE' | 'CANCELED' | 'PENDING'
    let startDate: Date | null = null
    let endDate: Date | null = null

    if (paymentResult.status === 'approved') {
      subscriptionStatus = 'ACTIVE'
      startDate = new Date()
      
      // Calcular fecha de fin según el ciclo de facturación
      if (paymentResult.billingCycle === 'quarterly') {
        endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 3)
      } else {
        endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)
      }
    } else if (paymentResult.status === 'declined') {
      subscriptionStatus = 'CANCELED'
    } else {
      subscriptionStatus = 'PENDING'
    }

    // Actualizar suscripción
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: subscriptionStatus,
        startDate: startDate,
        endDate: endDate,
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate
      }
    })

    // Registrar el pago
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: Math.round(paymentResult.amount * 100), // Convertir a centavos
        currency: paymentResult.currency,
        status: paymentResult.status === 'approved' ? 'SUCCEEDED' : 
                paymentResult.status === 'declined' ? 'FAILED' : 'PENDING',
        description: `Pago ${subscription.plan.displayName} - ${paymentResult.paymentMethod}`,
        paidAt: paymentResult.status === 'approved' ? new Date() : null
      }
    })

    // Si el pago fue aprobado, actualizar el usuario
    if (paymentResult.status === 'approved') {
      // Actualizar estado de suscripción del usuario
      await prisma.user.updateMany({
        where: { clerkId: paymentResult.userId },
        data: {
          subscriptionStatus: subscription.plan.name, // basic, premium, vip
          subscriptionExpiry: endDate
        }
      })

      console.log(`✅ Payment approved for user ${paymentResult.userId}, plan ${paymentResult.planId}`)
    } else {
      console.log(`⚠️ Payment ${paymentResult.status} for user ${paymentResult.userId}, plan ${paymentResult.planId}`)
    }

    // PayU espera una respuesta específica
    return new NextResponse('OK', { status: 200 })

  } catch (error) {
    console.error('Error processing PayU webhook:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando webhook',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PayU también puede enviar GET requests para confirmación
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Extraer parámetros de la URL
  const webhookData: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    webhookData[key] = value
  })

  console.log('PayU Webhook GET received:', webhookData)

  // Reutilizar la misma lógica del POST
  try {
    const paymentResult = payuService.processWebhookResponse(webhookData)
    
    if (paymentResult.isValid) {
      return new NextResponse('OK', { status: 200 })
    } else {
      return new NextResponse('Invalid signature', { status: 400 })
    }
  } catch (error) {
    console.error('Error processing PayU GET webhook:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
