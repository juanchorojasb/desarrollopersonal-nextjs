import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log('🧪 TEST: Direct subscription activation endpoint started')
  
  try {
    // Enhanced logging for debugging curl vs browser differences
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'none'
    const origin = request.headers.get('origin') || 'none'
    const contentType = request.headers.get('content-type') || 'none'
    const host = request.headers.get('host') || 'none'
    const xForwardedFor = request.headers.get('x-forwarded-for') || 'none'
    const xRealIp = request.headers.get('x-real-ip') || 'none'
    const forwarded = request.headers.get('forwarded') || 'none'
    
    // Determine request source
    const isCurl = userAgent.toLowerCase().includes('curl')
    const isBrowser = !isCurl && (userAgent.includes('Mozilla') || userAgent.includes('Chrome'))
    
    console.log('📋 REQUEST DETAILS:', {
      timestamp: new Date().toISOString(),
      source: isCurl ? 'CURL' : isBrowser ? 'BROWSER' : 'UNKNOWN',
      method: request.method,
      url: request.url,
      userAgent,
      referer,
      origin,
      contentType,
      host,
      xForwardedFor,
      xRealIp,
      forwarded
    })
    
    // Log all headers for debugging
    const allHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      allHeaders[key] = value
    })
    console.log('📋 ALL HEADERS:', allHeaders)
    
    let body
    try {
      body = await request.json()
      console.log('📋 REQUEST BODY PARSED SUCCESSFULLY:', body)
    } catch (parseError) {
      console.error('❌ JSON PARSE ERROR:', parseError)
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body', details: parseError instanceof Error ? parseError.message : 'Unknown parse error' },
        { status: 400 }
      )
    }
    const { 
      email, 
      planId = 'basic', 
      testCode = '',
      userId = null // Optional clerk user ID
    } = body

    console.log('🔍 TEST request body:', { email, planId, testCode, userId })

    // Verificar código de prueba
    if (testCode !== 'PRUEBA') {
      return NextResponse.json(
        { success: false, error: 'Código de prueba inválido. Use "PRUEBA"' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requerido' },
        { status: 400 }
      )
    }

    // Buscar o crear usuario de prueba con manejo mejorado de duplicados
    let dbUser = null

    // Primero buscar por clerkId si se proporciona
    if (userId) {
      console.log('🔍 TEST: Buscando usuario por clerkId:', userId)
      dbUser = await prisma.user.findUnique({
        where: { clerkId: userId }
      })
    }

    // Si no se encontró por clerkId, buscar por email
    if (!dbUser && email) {
      console.log('🔍 TEST: Buscando usuario por email:', email)
      dbUser = await prisma.user.findUnique({
        where: { email: email }
      })
    }

    if (!dbUser) {
      // Crear usuario temporal para testing con manejo mejorado de duplicados
      const uniqueClerkId = userId || `test_${Date.now()}_${Math.random().toString(36).substring(2)}`
      
      console.log('🔧 TEST: Creando nuevo usuario con clerkId:', uniqueClerkId)
      
      try {
        dbUser = await prisma.user.create({
          data: {
            clerkId: uniqueClerkId,
            email: email,
            firstName: 'Test',
            lastName: 'User',
            imageUrl: null
          }
        })
        console.log('✅ TEST: Usuario de prueba creado exitosamente:', dbUser.id)
      } catch (createError: any) {
        console.log('⚠️  TEST: Error al crear usuario:', createError.message)
        
        // Si falla por email duplicado, usar upsert
        if (createError.message?.includes('users_email_key') || createError.message?.includes('unique constraint')) {
          console.log('🔧 TEST: Email duplicado detectado, usando upsert...')
          
          try {
            dbUser = await prisma.user.upsert({
              where: { email: email },
              update: {
                // Actualizar clerkId si es necesario
                clerkId: userId || dbUser?.clerkId || uniqueClerkId
              },
              create: {
                clerkId: uniqueClerkId,
                email: email,
                firstName: 'Test',
                lastName: 'User', 
                imageUrl: null
              }
            })
            console.log('✅ TEST: Usuario upsert exitoso:', dbUser.id)
          } catch (upsertError) {
            console.error('❌ TEST: Error en upsert:', upsertError)
            throw upsertError
          }
        } else {
          throw createError
        }
      }
    } else {
      console.log('✅ TEST: Usuario existente encontrado:', dbUser.id)
    }

    console.log('✅ TEST: Usuario para la prueba:', {
      id: dbUser.id,
      email: dbUser.email,
      clerkId: dbUser.clerkId
    })

    // Buscar o crear plan
    let plan = await prisma.plan.findFirst({
      where: { 
        name: planId,
        isActive: true 
      }
    })

    if (!plan) {
      const planMapping = {
        free: { name: 'free', description: 'Plan Gratuito', price: 0 },
        basic: { name: 'basic', description: 'Plan Básico', price: 2500000 },
        premium: { name: 'premium', description: 'Plan Premium', price: 8000000 },
        personal: { name: 'personal', description: 'Plan Personal', price: 14000000 }
      }
      
      const planConfig = planMapping[planId as keyof typeof planMapping]
      if (!planConfig) {
        return NextResponse.json(
          { success: false, error: 'Plan no soportado' },
          { status: 404 }
        )
      }

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
                   planId === 'personal' ? ['7 cursos en MediaDelivery', 'Talleres sabatinos', 'Foros', 'Sesión personal 1h/mes'] :
                   ['Funcionalidades básicas']
        }
      })
      console.log('✅ TEST: Plan creado:', plan.id)
    }

    // Verificar si ya existe una suscripción activa para este usuario y plan
    let subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        planId: plan.id,
        isActive: true,
        status: 'ACTIVE'
      }
    })

    if (subscription) {
      console.log('✅ TEST: Suscripción activa existente encontrada:', subscription.id)
    } else {
      // Crear suscripción activa inmediatamente
      console.log('🔧 TEST: Creando nueva suscripción...')
      subscription = await prisma.subscription.create({
        data: {
          userId: dbUser.id,
          planId: plan.id,
          status: 'ACTIVE',
          isActive: true,
          billingCycle: 'MONTHLY',
          priceAmount: plan.price,
          currency: 'COP',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
        }
      })
      console.log('✅ TEST: Nueva suscripción creada:', subscription.id)
    }

    // Crear transacción de prueba (opcional para tracking) solo si no existe una para esta suscripción
    let transaction = await prisma.paymentTransaction.findFirst({
      where: {
        subscriptionId: subscription.id,
        status: 'APPROVED'
      }
    })

    if (transaction) {
      console.log('✅ TEST: Transacción existente encontrada:', transaction.id)
    } else {
      console.log('🔧 TEST: Creando nueva transacción...')
      transaction = await prisma.paymentTransaction.create({
        data: {
          userId: dbUser.id,
          subscriptionId: subscription.id,
          referenceCode: `TEST_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          amount: plan.price,
          currency: 'COP',
          country: 'CO',
          status: 'APPROVED',
          description: `TEST: ${plan.description} - Plan de Prueba`,
          extra1: dbUser.clerkId,
          extra2: planId,
          extra3: 'monthly',
          paymentMethod: 'TEST',
          processedAt: new Date(),
          confirmedAt: new Date()
        }
      })
      console.log('✅ TEST: Nueva transacción creada:', transaction.id)
    }

    console.log('✅ TEST: Suscripción activada directamente:', {
      subscriptionId: subscription.id,
      userId: dbUser.id,
      userClerkId: dbUser.clerkId,
      planName: plan.name,
      endDate: subscription.currentPeriodEnd,
      transactionId: transaction.id
    })

    return NextResponse.json({
      success: true,
      message: 'Suscripción de prueba activada exitosamente',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        isActive: subscription.isActive,
        planName: plan.name,
        planDescription: plan.description,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd
      },
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        created: true
      },
      transaction: {
        id: transaction.id,
        referenceCode: transaction.referenceCode,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency
      }
    })

  } catch (error) {
    console.error('❌ TEST: Error activating subscription:', error)
    console.error('❌ TEST: Error timestamp:', new Date().toISOString())
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('❌ TEST: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      })
    } else {
      console.error('❌ TEST: Non-Error object thrown:', typeof error, error)
    }

    // Log environment info when error occurs
    console.error('❌ TEST: Environment context:', {
      nodeEnv: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      requestUrl: new URL(request.url).pathname,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET endpoint para verificar estado de prueba
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, error: 'Email o userId requerido' },
        { status: 400 }
      )
    }

    let user
    if (userId) {
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
          subscriptions: {
            where: { isActive: true },
            include: { plan: true }
          }
        }
      })
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          subscriptions: {
            where: { isActive: true },
            include: { plan: true }
          }
        }
      })
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      subscriptions: user.subscriptions.map(sub => ({
        id: sub.id,
        status: sub.status,
        isActive: sub.isActive,
        planName: sub.plan.name,
        planDescription: sub.plan.description,
        currentPeriodEnd: sub.currentPeriodEnd
      }))
    })

  } catch (error) {
    console.error('Error checking test subscription:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}