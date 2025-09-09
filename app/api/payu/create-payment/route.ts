import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { payuService } from '@/lib/payu'
import { geolocationService } from '@/lib/geolocation'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 PayU Create Payment - Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      PAYU_USE_MOCK: process.env.PAYU_USE_MOCK,
      PAYU_API_KEY: process.env.PAYU_API_KEY ? '***exists***' : 'missing',
      PAYU_MERCHANT_ID: process.env.PAYU_MERCHANT_ID ? '***exists***' : 'missing'
    })

    // En modo MOCK, permitir bypass completo de autenticación
    let userId: string | null = null
    let mockMode = false
    
    if (process.env.PAYU_USE_MOCK === 'true') {
      console.log('🧪 MOCK MODE ACTIVE - Checking for test parameters')
      const testUserId = request.headers.get('X-Test-User-ID')
      const testEmail = request.headers.get('X-Test-Email')
      
      if (testUserId || testEmail) {
        userId = testUserId || `mock_${Date.now()}`
        mockMode = true
        console.log('✅ MOCK MODE - Using test user:', { userId, testEmail })
      }
    }

    // Verificar autenticación normal si no está en modo mock
    if (!mockMode) {
      const authResult = await auth()
      userId = authResult.userId
      console.log('🔍 Auth check result:', { userId: userId || 'null', hasAuth: !!userId })
      
      if (!userId) {
        console.log('❌ Authentication failed - no userId from Clerk auth()')
        return NextResponse.json(
          { success: false, error: 'Usuario no autenticado' },
          { status: 401 }
        )
      }
    }

    const body = await request.json()
    console.log('📦 Request body received:', { planId: body.planId, billingCycle: body.billingCycle, country: body.country })
    
    const { planId, billingCycle, country: manualCountry } = body

    if (!planId || !billingCycle) {
      console.log('❌ Missing required parameters:', { planId, billingCycle })
      return NextResponse.json(
        { success: false, error: 'Plan ID y ciclo de facturación son requeridos' },
        { status: 400 }
      )
    }

    // Detectar país del usuario (manual override o automático)
    let userCountry = manualCountry
    if (!userCountry) {
      try {
        userCountry = await geolocationService.getCountryFromIP()
      } catch (error) {
        console.warn('Error detecting user country, falling back to CO:', error)
        userCountry = 'CO' // Fallback a Colombia
      }
    }

    // Validar que el país esté soportado
    if (!geolocationService.isCountrySupported(userCountry)) {
      return NextResponse.json(
        { success: false, error: `País ${userCountry} no soportado actualmente` },
        { status: 400 }
      )
    }

    // Obtener información del plan desde la base de datos o usar configuración predeterminada
    let plan = await prisma.plan.findFirst({
      where: { 
        name: planId,
        isActive: true 
      }
    })

    // Si no existe el plan en BD, crear uno temporal con la estructura correcta
    if (!plan) {
      console.log(`Plan ${planId} no encontrado en BD, usando configuración predeterminada`)
      const planMapping = {
        free: { name: 'free', description: 'Plan Gratuito', price: 0 },
        basic: { name: 'basic', description: 'Plan Básico', price: 2500000 }, // 25.000 COP en centavos
        premium: { name: 'premium', description: 'Plan Premium', price: 4000000 }, // 40.000 COP en centavos
        premiumPlus: { name: 'premiumPlus', description: 'Plan Premium Plus', price: 5000000 } // 50.000 COP en centavos
      }
      
      const planConfig = planMapping[planId as keyof typeof planMapping]
      if (!planConfig) {
        return NextResponse.json(
          { success: false, error: 'Plan no soportado' },
          { status: 404 }
        )
      }

      // Crear el plan en la base de datos
      try {
        plan = await prisma.plan.create({
          data: {
            name: planConfig.name,
            description: planConfig.description,
            price: planConfig.price,
            currency: 'COP',
            billingCycle: 'MONTHLY',
            isActive: true,
            features: planId === 'free' ? ['Curso externo en Thinkific'] : 
                     planId === 'basic' ? ['7 cursos en MediaDelivery', 'Acceso completo', 'Sin límites'] :
                     planId === 'premium' ? ['7 cursos en MediaDelivery', 'Talleres sabatinos', 'Foros'] :
                     ['7 cursos en MediaDelivery', 'Talleres sabatinos', 'Foros', 'Sesión personal 1h/mes']
          }
        })
        console.log('✅ Plan creado en BD:', plan.id)
      } catch (createError) {
        console.error('Error creando plan:', createError)
        return NextResponse.json(
          { success: false, error: 'Error configurando el plan' },
          { status: 500 }
        )
      }
    }

    // Obtener información del usuario
    let user: any = null
    
    if (mockMode) {
      // Crear usuario mock para testing
      const testEmail = request.headers.get('X-Test-Email') || `test_${Date.now()}@example.com`
      user = {
        emailAddresses: [{ emailAddress: testEmail }],
        firstName: 'Test',
        lastName: 'User',
        imageUrl: null
      }
      console.log('🧪 MOCK MODE - Using mock user:', user.emailAddresses[0].emailAddress)
    } else {
      // Obtener usuario real de Clerk
      const { currentUser } = await import('@clerk/nextjs/server')
      user = await currentUser()

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado en Clerk' },
          { status: 404 }
        )
      }
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

    // Obtener precios para el país
    const pricing = payuService.getPlanPricing(planId, userCountry)
    const currency = pricing.currency
    
    // Calcular precio según ciclo de facturación
    let amount: number
    let description: string

    if (billingCycle === 'quarterly') {
      amount = pricing.quarterly
      description = `${plan.description || plan.name} - Plan Trimestral (${userCountry})`
    } else {
      amount = pricing.monthly
      description = `${plan.description || plan.name} - Plan Mensual (${userCountry})`
    }

    // Para el plan gratuito, redirigir sin crear pago
    if (planId === 'free' || amount === 0) {
      return NextResponse.json({
        success: true,
        redirectTo: 'https://psicognitiva.thinkific.com/',
        message: 'Plan gratuito - Redirigiendo a Thinkific',
        plan: {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          isFree: true
        }
      })
    }

    // Convertir a centavos para almacenamiento
    const amountInCents = Math.round(amount * 100)
    const displayAmount = amount

    // Crear suscripción pendiente
    const subscription = await prisma.subscription.create({
      data: {
        userId: dbUser.id,
        planId: plan.id,
        status: 'PENDING',
        billingCycle: billingCycle.toUpperCase() as 'MONTHLY' | 'QUARTERLY',
        priceAmount: amountInCents,
        currency: currency,
        currentPeriodStart: new Date(),
        currentPeriodEnd: billingCycle === 'quarterly' 
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })

    console.log('✅ Suscripción pendiente creada:', subscription.id)

    // Preparar datos de pago para PayU
    const paymentData = {
      planId: plan.name,
      planName: plan.description || plan.name,
      amount: displayAmount,
      currency: currency,
      country: userCountry,
      billingCycle: billingCycle as 'monthly' | 'quarterly',
      userEmail: user.emailAddresses[0]?.emailAddress || '',
      userId: userId,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                user.emailAddresses[0]?.emailAddress || 'Usuario',
      description: description
    }

    // Crear URL de checkout con PayU
    const payuResponse = payuService.createCheckoutUrl(paymentData)

    if (!payuResponse.success) {
      // Si falla PayU, eliminar la suscripción pendiente
      await prisma.subscription.delete({ where: { id: subscription.id } })
      
      return NextResponse.json(
        { success: false, error: payuResponse.error },
        { status: 500 }
      )
    }

    // Crear registro de transacción
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: dbUser.id,
        subscriptionId: subscription.id,
        referenceCode: payuResponse.referenceCode!,
        amount: amountInCents,
        currency: currency,
        country: userCountry,
        status: 'PENDING',
        description: description,
        extra1: userId,
        extra2: planId,
        extra3: billingCycle,
      }
    })

    console.log('✅ Transacción creada:', transaction.id)

    // Preparar respuesta con información completa
    const countryInfo = geolocationService.getCountryInfo(userCountry)
    const formattedAmount = geolocationService.formatCurrency(displayAmount, currency)

    return NextResponse.json({
      success: true,
      payment: {
        checkoutUrl: payuResponse.checkoutUrl,
        referenceCode: payuResponse.referenceCode,
        transactionId: transaction.id,
        subscriptionId: subscription.id
      },
      pricing: {
        amount: displayAmount,
        currency: currency,
        formattedAmount: formattedAmount,
        country: userCountry,
        countryInfo: countryInfo
      },
      plan: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        billingCycle: billingCycle
      },
      user: {
        created: !dbUser ? false : true
      }
    })

  } catch (error) {
    console.error('Error creating PayU payment:', error)
    
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

// GET endpoint for getting payment information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')
    const referenceCode = searchParams.get('referenceCode')

    if (!transactionId && !referenceCode) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID o Reference Code requerido' },
        { status: 400 }
      )
    }

    let transaction
    if (transactionId) {
      transaction = await prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          subscription: {
            include: { plan: true }
          }
        }
      })
    } else if (referenceCode) {
      transaction = await prisma.paymentTransaction.findUnique({
        where: { referenceCode },
        include: {
          user: true,
          subscription: {
            include: { plan: true }
          }
        }
      })
    }

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transacción no encontrada' },
        { status: 404 }
      )
    }

    const countryInfo = geolocationService.getCountryInfo(transaction.country)
    const formattedAmount = geolocationService.formatCurrency(
      transaction.amount / (transaction.currency === 'COP' ? 100 : 100), 
      transaction.currency
    )

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        referenceCode: transaction.referenceCode,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        country: transaction.country,
        countryInfo,
        formattedAmount,
        description: transaction.description,
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt,
        processedAt: transaction.processedAt,
        confirmedAt: transaction.confirmedAt
      },
      subscription: transaction.subscription ? {
        id: transaction.subscription.id,
        status: transaction.subscription.status,
        plan: transaction.subscription.plan
      } : null
    })

  } catch (error) {
    console.error('Error getting payment info:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}