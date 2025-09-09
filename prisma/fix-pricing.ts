import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('💰 Corrigiendo precios a las tarifas correctas...')

  try {
    // Plan Basic: $25,000 COP (2500000 centavos)
    const basicPlan = await prisma.plan.upsert({
      where: { id: 'basic' },
      update: {
        price: 2500000, // $25,000 COP en centavos
        description: 'Plan Básico - Acceso completo a todos los cursos',
      },
      create: {
        name: 'basic',
        price: 2500000, // $25,000 COP en centavos
        description: 'Plan Básico - Acceso completo a todos los cursos',
        features: [
          'Acceso completo a TODOS los cursos (30+ horas)',
          'Nuevos cursos incluidos automáticamente',
          'Progreso personalizado y certificados',
          'Acceso móvil y descarga offline',
          'Garantía de satisfacción de 7 días',
          'Soporte por email'
        ],
        currency: 'COP',
        billingCycle: 'MONTHLY',
        maxCourses: -1,
        hasLiveSupport: false,
        hasGroupCoaching: false,
        hasPrioritySupport: false,
        isActive: true,
        sortOrder: 1
      }
    })

    console.log(`✅ Plan corregido: ${basicPlan.name} - $${(basicPlan.price / 100).toLocaleString()} COP`)

    // Plan Premium: $80,000 COP (8000000 centavos)
    const premiumPlan = await prisma.plan.upsert({
      where: { id: 'premium' },
      update: {
        price: 8000000, // $80,000 COP en centavos
        description: 'Plan Premium - Todo lo básico + talleres en vivo + comunidad',
      },
      create: {
        name: 'premium',
        price: 8000000, // $80,000 COP en centavos
        description: 'Plan Premium - Todo lo básico + talleres en vivo + comunidad',
        features: [
          'Todo lo incluido en el Plan Básico',
          'Talleres en vivo mensuales',
          'Acceso a foros de comunidad',
          'Q&A con expertos',
          'Sesiones grupales interactivas',
          'Comunidad exclusiva',
          'Soporte prioritario'
        ],
        currency: 'COP',
        billingCycle: 'MONTHLY',
        maxCourses: -1,
        hasLiveSupport: true,
        hasGroupCoaching: true,
        hasPrioritySupport: true,
        isActive: true,
        sortOrder: 2
      }
    })

    console.log(`✅ Plan corregido: ${premiumPlan.name} - $${(premiumPlan.price / 100).toLocaleString()} COP`)

    // Plan Personal: $140,000 COP (14000000 centavos)
    const personalPlan = await prisma.plan.upsert({
      where: { id: 'personal' },
      update: {
        price: 14000000, // $140,000 COP en centavos
        description: 'Plan Personal - Todo lo premium + sesión personal mensual',
      },
      create: {
        name: 'personal',
        price: 14000000, // $140,000 COP en centavos
        description: 'Plan Personal - Todo lo premium + sesión personal mensual',
        features: [
          'Todo del Plan Premium',
          'Sesión personal virtual 1h/mes',
          'Consultoría individual',
          'Soporte prioritario',
          'Plan personalizado',
          'Acceso directo al especialista'
        ],
        currency: 'COP',
        billingCycle: 'MONTHLY',
        maxCourses: -1,
        hasLiveSupport: true,
        hasGroupCoaching: true,
        hasPrioritySupport: true,
        isActive: true,
        sortOrder: 3
      }
    })

    console.log(`✅ Plan corregido: ${personalPlan.name} - $${(personalPlan.price / 100).toLocaleString()} COP`)

    console.log('\n🎯 PRECIOS CORREGIDOS EXITOSAMENTE:')
    console.log('=====================================')
    console.log(`🆓 Plan Gratuito: $0 COP`)
    console.log(`💎 Plan Básico: $25.000 COP/mes ($6 USD Ecuador)`)
    console.log(`👑 Plan Premium: $80.000 COP/mes ($20 USD Ecuador)`)
    console.log(`🌟 Plan Personal: $140.000 COP/mes ($35 USD Ecuador)`)

  } catch (error) {
    console.error('❌ Error corrigiendo precios:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('✅ Corrección de precios completada')
  })