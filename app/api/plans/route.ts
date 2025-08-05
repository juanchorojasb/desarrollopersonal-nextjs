import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'


export async function GET() {
  try {
    // Obtener todos los planes activos ordenados por sortOrder
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      },
      select: {
        id: true,
        name: true,                    // ✅ CORREGIDO: era displayName
        description: true,
        price: true,                   // ✅ CORREGIDO: era monthlyPrice
        currency: true,
        billingCycle: true,            // ✅ AGREGADO: del nuevo schema
        features: true,
        maxCourses: true,
        hasLiveSupport: true,          // ✅ CORREGIDO: era hasLiveWorkshops
        hasGroupCoaching: true,        // ✅ CORREGIDO: era hasCoaching
        hasPrioritySupport: true,      // ✅ CORREGIDO: era hasSupport
        sortOrder: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Transformar datos para el frontend
    const transformedPlans = plans.map(plan => ({
      id: plan.id,                     // usar el ID real
      name: plan.name,                 // usar name directamente
      price: plan.price / 100,         // convertir de centavos a pesos
      description: plan.description,
      features: Array.isArray(plan.features) ? plan.features : [],
      billingCycle: plan.billingCycle,
      buttonText: `Comenzar ${plan.name.replace('Plan ', '')}`,
      isPopular: plan.name.toLowerCase().includes('premium'), // marcar premium como popular
      
      // Características detalladas usando campos correctos
      maxCourses: plan.maxCourses,
      hasLiveSupport: plan.hasLiveSupport,        // ✅ workshops → live support
      hasGroupCoaching: plan.hasGroupCoaching,    // ✅ coaching grupal
      hasPrioritySupport: plan.hasPrioritySupport, // ✅ soporte prioritario
      currency: plan.currency,
      
      // Datos adicionales
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt
    }))

    return NextResponse.json({
      success: true,
      plans: transformedPlans
    })
    
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los planes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST para crear planes (útil para poblar la DB)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price, // ya en centavos
        currency: data.currency || 'COP',
        billingCycle: data.billingCycle || 'MONTHLY',
        features: data.features || [],
        maxCourses: data.maxCourses,
        hasLiveSupport: data.hasLiveSupport || false,
        hasGroupCoaching: data.hasGroupCoaching || false,
        hasPrioritySupport: data.hasPrioritySupport || false,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      plan
    })
    
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear el plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
