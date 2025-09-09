import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { payuService } from '@/lib/payu'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 PayU Webhook recibido')
    
    // Obtener datos del webhook
    const formData = await request.formData()
    const webhookData = Object.fromEntries(formData.entries())
    
    console.log('📦 Datos del webhook:', {
      reference_sale: webhookData.reference_sale,
      state_pol: webhookData.state_pol,
      value: webhookData.value,
      currency: webhookData.currency,
      extra1: webhookData.extra1, // userId
      extra2: webhookData.extra2, // planId
      extra3: webhookData.extra3, // billingCycle
      extra4: webhookData.extra4  // country
    })

    // Procesar respuesta del webhook
    const webhookResponse = payuService.processWebhookResponse(webhookData)
    
    if (!webhookResponse.isValid) {
      console.error('❌ Firma del webhook inválida')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
    }

    console.log('✅ Webhook válido:', {
      referenceCode: webhookResponse.referenceCode,
      status: webhookResponse.status,
      amount: webhookResponse.amount,
      currency: webhookResponse.currency
    })

    // Buscar transacción por referenceCode
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { referenceCode: webhookResponse.referenceCode },
      include: {
        subscription: {
          include: { plan: true }
        },
        user: true
      }
    })

    if (!transaction) {
      console.error('❌ Transacción no encontrada:', webhookResponse.referenceCode)
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    console.log('📄 Transacción encontrada:', {
      id: transaction.id,
      status: transaction.status,
      subscriptionId: transaction.subscriptionId
    })

    // Actualizar transacción con datos de PayU
    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: webhookResponse.status.toUpperCase(),
        paymentMethod: webhookResponse.paymentMethod,
        payuTransactionId: webhookResponse.transactionId,
        responseCode: webhookData.response_code_pol as string,
        responseMessage: webhookData.response_message_pol as string,
        processedAt: new Date(),
        confirmedAt: webhookResponse.status === 'approved' ? new Date() : null
      }
    })

    console.log('📝 Transacción actualizada:', {
      id: updatedTransaction.id,
      status: updatedTransaction.status,
      paymentMethod: updatedTransaction.paymentMethod
    })

    // Procesar según el estado del pago
    if (webhookResponse.status === 'approved' && transaction.subscription) {
      // Pago aprobado - activar suscripción
      const now = new Date()
      const billingCycle = webhookResponse.billingCycle || 'monthly'
      const endDate = billingCycle === 'quarterly' 
        ? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // 3 meses
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)  // 1 mes

      const activatedSubscription = await prisma.subscription.update({
        where: { id: transaction.subscription.id },
        data: {
          status: 'ACTIVE',
          isActive: true,
          currentPeriodStart: now,
          currentPeriodEnd: endDate
        }
      })

      console.log('✅ Suscripción activada:', {
        subscriptionId: activatedSubscription.id,
        userId: transaction.user.clerkId,
        plan: transaction.subscription.plan.name,
        endDate: endDate,
        amount: webhookResponse.amount,
        currency: webhookResponse.currency
      })

      // TODO: Enviar email de confirmación
      // TODO: Crear entrada en historial de facturación
      
    } else if (webhookResponse.status === 'declined' || webhookResponse.status === 'error') {
      // Pago rechazado - marcar suscripción como cancelada si existe
      if (transaction.subscription) {
        await prisma.subscription.update({
          where: { id: transaction.subscription.id },
          data: {
            status: 'CANCELLED',
            isActive: false,
            cancelledAt: new Date()
          }
        })

        console.log('❌ Suscripción cancelada por pago rechazado:', {
          subscriptionId: transaction.subscription.id,
          status: webhookResponse.status,
          responseMessage: webhookData.response_message_pol
        })
      }

      // TODO: Enviar email de fallo en el pago
    } else {
      // Pago pendiente - mantener estado
      console.log('⏳ Pago pendiente, manteniendo estado actual')
    }

    // Responder OK a PayU
    return NextResponse.json({ 
      status: 'OK',
      message: 'Webhook procesado correctamente' 
    })

  } catch (error) {
    console.error('Error procesando webhook PayU:', error)
    
    // Log detallado del error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    // Aún así responder OK para evitar reenvíos innecesarios
    return NextResponse.json({ 
      status: 'OK',
      message: 'Webhook recibido con errores' 
    })
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
