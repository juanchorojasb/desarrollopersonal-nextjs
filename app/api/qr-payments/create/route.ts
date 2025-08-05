// app/api/qr-payments/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { planId, billingCycle } = await request.json()

    if (!planId || !billingCycle) {
      return NextResponse.json(
        { error: 'Plan ID y ciclo de facturación son requeridos' },
        { status: 400 }
      )
    }

    // Obtener plan
    const plan = await prisma.plan.findUnique({
      where: { name: planId }
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    // Obtener usuario de Clerk
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar si el usuario existe en nuestra BD, si no, crearlo
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
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

    // Calcular monto según ciclo de facturación
    const amount = billingCycle === 'quarterly' 
      ? (plan.quarterlyPrice || plan.monthlyPrice) / 100
      : plan.monthlyPrice / 100

    // Generar referencia única
    const reference = `DP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Crear pago pendiente
    const payment = await prisma.qrPayment.create({
      data: {
        userId: dbUser.id,
        planId: plan.id,
        amount,
        currency: 'COP',
        billingCycle: billingCycle.toUpperCase(),
        reference,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      }
    })

    console.log(`🟡 NUEVO PAGO QR CREADO:
    ===========================
    Usuario: ${user.firstName} ${user.lastName} (${user.emailAddresses[0]?.emailAddress})
    Plan: ${plan.displayName}
    Referencia: ${reference}
    Monto: $${amount.toLocaleString()} COP
    Expira: ${payment.expiresAt.toLocaleString()}
    ===========================`)

    // Datos bancarios QR (aquí pondrías tus QR codes reales)
    const bankData = {
      bancolombia: {
        qrCode: process.env.BANCOLOMBIA_QR_CODE || 'https://desarrollopersonaluno.b-cdn.net/qr/bancolombia-qr.png',
        accountNumber: process.env.BANCOLOMBIA_ACCOUNT_NUMBER || '123-456-78901',
        accountType: 'Ahorros',
        ownerName: process.env.COMPANY_NAME || 'DESARROLLO PERSONAL UNO SAS'
      },
      davivienda: {
        qrCode: process.env.DAVIVIENDA_QR_CODE || 'https://desarrollopersonaluno.b-cdn.net/qr/davivienda-qr.png',
        accountNumber: process.env.DAVIVIENDA_ACCOUNT_NUMBER || '987-654-32101',
        accountType: 'Ahorros',
        ownerName: process.env.COMPANY_NAME || 'DESARROLLO PERSONAL UNO SAS'
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        reference,
        amount,
        currency: 'COP',
        planName: plan.displayName,
        billingCycle,
        expiresAt: payment.expiresAt
      },
      bankData,
      instructions: {
        step1: 'Abre tu app bancaria (Bancolombia o Davivienda)',
        step2: 'Escanea el código QR o usa los datos bancarios',
        step3: `Transfiere exactamente $${amount.toLocaleString()} COP`,
        step4: 'Toma captura del comprobante de pago',
        step5: 'Sube tu comprobante en la siguiente pantalla',
        step6: 'Te activaremos el acceso en máximo 1 hora'
      }
    })

  } catch (error) {
    console.error('❌ Error creating QR payment:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
