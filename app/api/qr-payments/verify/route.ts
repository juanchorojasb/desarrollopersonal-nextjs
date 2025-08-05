// app/api/qr-payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const paymentId = formData.get('paymentId') as string
    const proofFile = formData.get('proof') as File
    const transferReference = formData.get('transferReference') as string

    if (!paymentId || !proofFile) {
      return NextResponse.json({ 
        error: 'Datos incompletos. Se requiere ID de pago y comprobante.' 
      }, { status: 400 })
    }

    // Obtener usuario de la BD
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que el pago existe y pertenece al usuario
    const payment = await prisma.qrPayment.findFirst({
      where: {
        id: paymentId,
        userId: dbUser.id,
        status: 'PENDING'
      },
      include: {
        plan: true,
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json({ 
        error: 'Pago no encontrado o ya fue procesado' 
      }, { status: 404 })
    }

    // Verificar que no haya expirado
    if (payment.expiresAt < new Date()) {
      await prisma.qrPayment.update({
        where: { id: paymentId },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json({ 
        error: 'El pago ha expirado. Por favor crea uno nuevo.' 
      }, { status: 400 })
    }

    // Subir comprobante (simulado por ahora)
    const proofUrl = await uploadProofToBunny(proofFile, payment.reference)

    // Actualizar pago con comprobante
    const updatedPayment = await prisma.qrPayment.update({
      where: { id: paymentId },
      data: {
        status: 'VERIFICATION_PENDING',
        proofUrl,
        transferReference,
        submittedAt: new Date()
      }
    })

    // Enviar notificación a admin (Juan David)
    await sendAdminNotification(payment, proofUrl)

    console.log(`🔔 COMPROBANTE RECIBIDO:
    ===========================
    Usuario: ${payment.user.firstName} ${payment.user.lastName}
    Email: ${payment.user.email}
    Referencia: ${payment.reference}
    Plan: ${payment.plan.displayName}
    Monto: $${payment.amount.toLocaleString()} COP
    Comprobante: ${proofUrl}
    Ref. Usuario: ${transferReference || 'No especificada'}
    ===========================
    ⏰ Pendiente de verificación admin`)

    return NextResponse.json({
      success: true,
      message: 'Comprobante recibido exitosamente. Verificaremos tu pago en máximo 1 hora.',
      payment: {
        id: updatedPayment.id,
        reference: updatedPayment.reference,
        status: updatedPayment.status,
        planName: payment.plan.displayName,
        amount: updatedPayment.amount
      },
      estimatedVerification: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    })

  } catch (error) {
    console.error('❌ Error verifying payment:', error)
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Función auxiliar para subir archivo a Bunny CDN
async function uploadProofToBunny(file: File, reference: string): Promise<string> {
  try {
    // Por ahora simulamos la subida - luego implementaremos Bunny CDN real
    const fileName = `proofs/${reference}-${Date.now()}.${file.name.split('.').pop()}`
    
    // Aquí iría la lógica real de Bunny CDN
    // const uploadUrl = await bunnyUpload(file, fileName)
    
    // Por ahora retornamos una URL simulada
    const simulatedUrl = `https://desarrollopersonaluno.b-cdn.net/${fileName}`
    
    console.log(`📁 Comprobante simulado subido: ${simulatedUrl}`)
    console.log(`📊 Archivo: ${file.name} (${file.size} bytes)`)
    
    return simulatedUrl

  } catch (error) {
    console.error('Error uploading proof:', error)
    // Fallback: usar una URL temporal
    return `https://desarrollopersonaluno.b-cdn.net/proofs/temp-${reference}.jpg`
  }
}

// Función auxiliar para notificar al admin (Juan David)
async function sendAdminNotification(payment: any, proofUrl: string) {
  try {
    console.log(`
🔔 NUEVO PAGO PARA VERIFICAR - JUAN DAVID
==========================================
👤 Usuario: ${payment.user.firstName} ${payment.user.lastName}
📧 Email: ${payment.user.email}
📝 Referencia: ${payment.reference}
💎 Plan: ${payment.plan.displayName}
💰 Monto: $${payment.amount.toLocaleString()} COP
🔄 Ciclo: ${payment.billingCycle}
📁 Comprobante: ${proofUrl}
📱 Ref. Usuario: ${payment.transferReference || 'No especificada'}
⏰ Enviado: ${new Date().toLocaleString()}
==========================================
🎯 Ve al panel admin: http://31.97.85.16:3003/admin/payments
`)

    // Aquí iría la lógica de email/WhatsApp/Slack
    // await sendEmail('juanchorojasb@gmail.com', 'Nuevo Pago QR Para Verificar', emailBody)
    // await sendWhatsApp('+57...', message)

  } catch (error) {
    console.error('Error sending admin notification:', error)
  }
}
