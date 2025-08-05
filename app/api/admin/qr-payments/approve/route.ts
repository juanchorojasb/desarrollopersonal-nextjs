// app/api/admin/qr-payments/approve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener pagos pendientes de verificación (Para Juan David como admin)
export async function GET() {
  try {
    const { userId } = await auth()
    
    // Verificar si es Juan David (admin)
    const adminUsers = process.env.ADMIN_USER_IDS?.split(',') || []
    if (!adminUsers.includes(userId || '')) {
      console.log(`❌ Acceso denegado - User ID: ${userId}`)
      console.log(`✅ Admins autorizados: ${adminUsers.join(', ')}`)
      return NextResponse.json({ error: 'No autorizado - Solo admins pueden acceder' }, { status: 403 })
    }

    console.log(`✅ Admin autenticado: Juan David (${userId})`)

    const pendingPayments = await prisma.qrPayment.findMany({
      where: {
        status: {
          in: ['VERIFICATION_PENDING', 'APPROVED', 'REJECTED'] // Mostrar todos para el historial
        }
      },
      include: {
        plan: true,
        user: true
      },
      orderBy: {
        submittedAt: 'desc'
      },
      take: 50 // Últimos 50 pagos
    })

    // Formatear datos para el frontend
    const formattedPayments = pendingPayments.map(payment => ({
      id: payment.id,
      reference: payment.reference,
      amount: payment.amount,
      currency: payment.currency,
      billingCycle: payment.billingCycle,
      status: payment.status,
      proofUrl: payment.proofUrl,
      transferReference: payment.transferReference,
      submittedAt: payment.submittedAt,
      expiresAt: payment.expiresAt,
      approvedAt: payment.approvedAt,
      rejectedAt: payment.rejectedAt,
      plan: {
        id: payment.plan.id,
        displayName: payment.plan.displayName,
        monthlyPrice: payment.plan.monthlyPrice
      },
      user: {
        id: payment.user.id,
        email: payment.user.email,
        firstName: payment.user.firstName,
        lastName: payment.user.lastName
      }
    }))

    const stats = {
      totalPending: formattedPayments.filter(p => p.status === 'VERIFICATION_PENDING').length,
      totalApproved: formattedPayments.filter(p => p.status === 'APPROVED').length,
      totalRejected: formattedPayments.filter(p => p.status === 'REJECTED').length,
      totalAmount: formattedPayments
        .filter(p => p.status === 'VERIFICATION_PENDING')
        .reduce((sum, p) => sum + p.amount, 0)
    }

    console.log(`📊 ESTADÍSTICAS ADMIN:
    =====================
    Por verificar: ${stats.totalPending}
    Aprobados: ${stats.totalApproved}
    Rechazados: ${stats.totalRejected}
    Valor pendiente: $${stats.totalAmount.toLocaleString()} COP
    =====================`)

    return NextResponse.json({
      success: true,
      payments: formattedPayments,
      stats
    })

  } catch (error) {
    console.error('❌ Error fetching pending payments:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Aprobar o rechazar pago (Solo Juan David)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    // Verificar si es Juan David (admin)
    const adminUsers = process.env.ADMIN_USER_IDS?.split(',') || []
    if (!adminUsers.includes(userId || '')) {
      return NextResponse.json({ error: 'No autorizado - Solo Juan David puede aprobar pagos' }, { status: 403 })
    }

    const { paymentId, approved, rejectionReason } = await request.json()

    if (!paymentId || typeof approved !== 'boolean') {
      return NextResponse.json({ 
        error: 'Datos incompletos. Se requiere paymentId y approved (boolean)' 
      }, { status: 400 })
    }

    const payment = await prisma.qrPayment.findUnique({
      where: { id: paymentId },
      include: { 
        plan: true,
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    if (payment.status !== 'VERIFICATION_PENDING') {
      return NextResponse.json({ 
        error: 'El pago ya fue procesado anteriormente' 
      }, { status: 400 })
    }

    if (approved) {
      // ✅ APROBAR PAGO - Crear suscripción activa
      const startDate = new Date()
      const endDate = new Date()
      
      if (payment.billingCycle === 'QUARTERLY') {
        endDate.setMonth(endDate.getMonth() + 3)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // Crear suscripción
      const subscription = await prisma.subscription.create({
        data: {
          userId: payment.user.id,
          planId: payment.planId,
          status: 'ACTIVE',
          billingCycle: payment.billingCycle as 'MONTHLY' | 'QUARTERLY',
          priceAmount: Math.round(payment.amount * 100), // convertir a centavos
          currency: payment.currency,
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate
        }
      })

      // Marcar pago como aprobado
      await prisma.qrPayment.update({
        where: { id: paymentId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: userId,
          subscriptionId: subscription.id
        }
      })

      // Log de confirmación
      console.log(`✅ PAGO APROBADO POR JUAN DAVID:
      ===================================
      👤 Usuario: ${payment.user.firstName} ${payment.user.lastName}
      📧 Email: ${payment.user.email}
      💎 Plan: ${payment.plan.displayName}
      💰 Monto: $${payment.amount.toLocaleString()} COP
      🔄 Ciclo: ${payment.billingCycle}
      📅 Válido hasta: ${endDate.toLocaleDateString()}
      🆔 Suscripción: ${subscription.id}
      ⏰ Aprobado: ${new Date().toLocaleString()}
      ===================================`)

      // Enviar confirmación al usuario
      await sendUserConfirmation(payment.user, subscription, payment.plan)

      return NextResponse.json({
        success: true,
        message: `✅ Pago aprobado y suscripción activada para ${payment.user.firstName}`,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          planName: payment.plan.displayName,
          startDate: subscription.currentPeriodStart,
          endDate: subscription.currentPeriodEnd,
          userEmail: payment.user.email
        }
      })

    } else {
      // ❌ RECHAZAR PAGO
      await prisma.qrPayment.update({
        where: { id: paymentId },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectedBy: userId
        }
      })

      console.log(`❌ PAGO RECHAZADO POR JUAN DAVID:
      ===================================
      👤 Usuario: ${payment.user.firstName} ${payment.user.lastName}
      📧 Email: ${payment.user.email}
      💎 Plan: ${payment.plan.displayName}
      💰 Monto: $${payment.amount.toLocaleString()} COP
      📝 Razón: ${rejectionReason || 'No especificada'}
      ⏰ Rechazado: ${new Date().toLocaleString()}
      ===================================`)

      // Enviar notificación de rechazo
      await sendUserRejection(payment.user, payment, rejectionReason)

      return NextResponse.json({
        success: true,
        message: `❌ Pago rechazado. Se ha notificado a ${payment.user.firstName}.`,
        rejectionReason: rejectionReason || 'Comprobante no válido'
      })
    }

  } catch (error) {
    console.error('❌ Error processing payment approval:', error)
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Función auxiliar para confirmar al usuario
async function sendUserConfirmation(user: any, subscription: any, plan: any) {
  try {
    console.log(`
📧 CONFIRMACIÓN ENVIADA A: ${user.email}
========================================
🎉 ¡Tu suscripción está activa!

Hola ${user.firstName},

Tu pago ha sido verificado exitosamente y tu suscripción ya está activa.

📋 Detalles:
• Plan: ${plan.displayName}
• Válida hasta: ${subscription.currentPeriodEnd.toLocaleDateString()}
• Ciclo: ${subscription.billingCycle}

🚀 Accede ahora a todos tus cursos:
https://desarrollopersonal.uno/dashboard

Gracias por confiar en DesarrolloPersonal.uno

Equipo DesarrolloPersonal.uno
========================================`)

    // Aquí iría el email real
    // await sendEmail(user.email, '🎉 Suscripción Activada - DesarrolloPersonal.uno', emailBody)

  } catch (error) {
    console.error('Error sending user confirmation:', error)
  }
}

// Función auxiliar para notificar rechazo
async function sendUserRejection(user: any, payment: any, reason?: string) {
  try {
    console.log(`
📧 NOTIFICACIÓN DE RECHAZO A: ${user.email}
============================================
❌ Pago no verificado

Hola ${user.firstName},

Lamentamos informarte que no pudimos verificar tu pago.

📋 Detalles:
• Referencia: ${payment.reference}
• Plan: ${payment.plan.displayName}
• Razón: ${reason || 'Comprobante no válido o ilegible'}

🔄 ¿Qué puedes hacer?
1. Verifica que el comprobante sea claro y legible
2. Asegúrate de que el monto sea exacto
3. Intenta nuevamente: https://desarrollopersonal.uno/pricing

Si tienes dudas, responde este email.

Equipo DesarrolloPersonal.uno
============================================`)

    // Aquí iría el email real
    // await sendEmail(user.email, '❌ Pago No Verificado - DesarrolloPersonal.uno', emailBody)

  } catch (error) {
    console.error('Error sending rejection notification:', error)
  }
}
