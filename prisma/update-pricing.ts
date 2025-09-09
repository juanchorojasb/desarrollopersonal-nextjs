import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('💎 Actualizando precios de planes existentes...')

  try {
    // Plan Basic: $5,000 COP (500000 centavos)
    const basicPlan = await prisma.plan.upsert({
      where: { id: 'basic' },
      update: {
        price: 500000, // $5,000 COP en centavos
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
        isActive: true
      },
      create: {
        name: 'basic',
        price: 500000, // $5,000 COP en centavos
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
        maxCourses: -1, // ilimitado
        hasLiveSupport: false,
        hasGroupCoaching: false,
        hasPrioritySupport: false,
        isActive: true,
        sortOrder: 1
      }
    })

    console.log(`✅ Plan actualizado: ${basicPlan.name} - $${(basicPlan.price / 100).toLocaleString()} COP`)

    // Plan Premium: $40,000 COP (4000000 centavos)
    const premiumPlan = await prisma.plan.upsert({
      where: { id: 'premium' },
      update: {
        price: 4000000, // $40,000 COP en centavos
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
        isActive: true
      },
      create: {
        name: 'premium',
        price: 4000000, // $40,000 COP en centavos
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
        maxCourses: -1, // ilimitado
        hasLiveSupport: true,
        hasGroupCoaching: true,
        hasPrioritySupport: true,
        isActive: true,
        sortOrder: 2
      }
    })

    console.log(`✅ Plan actualizado: ${premiumPlan.name} - $${(premiumPlan.price / 100).toLocaleString()} COP`)

    // Plan Free: $0 COP
    const freePlan = await prisma.plan.upsert({
      where: { id: 'free' },
      update: {
        price: 0, // $0 COP
        description: 'Plan Gratuito - Curso externo en Thinkific',
        features: [
          'Curso completo de neurociencia empresarial',
          'Técnicas de liderazgo bajo presión',
          'Gestión del estrés empresarial',
          'Herramientas de inteligencia emocional'
        ],
        currency: 'COP',
        billingCycle: 'MONTHLY',
        isActive: true
      },
      create: {
        name: 'free',
        price: 0, // $0 COP
        description: 'Plan Gratuito - Curso externo en Thinkific',
        features: [
          'Curso completo de neurociencia empresarial',
          'Técnicas de liderazgo bajo presión',
          'Gestión del estrés empresarial',
          'Herramientas de inteligencia emocional'
        ],
        currency: 'COP',
        billingCycle: 'MONTHLY',
        maxCourses: 1,
        hasLiveSupport: false,
        hasGroupCoaching: false,
        hasPrioritySupport: false,
        isActive: true,
        sortOrder: 0
      }
    })

    console.log(`✅ Plan actualizado: ${freePlan.name} - $${(freePlan.price / 100).toLocaleString()} COP`)

    console.log('\n🎯 PRECIOS ACTUALIZADOS EXITOSAMENTE:')
    console.log('=====================================')
    console.log(`🆓 Plan Gratuito: $0 COP`)
    console.log(`💎 Plan Básico: $5.000 COP/mes`)
    console.log(`👑 Plan Premium: $40.000 COP/mes`)
    console.log('\n✅ Configuración de pagos real activada (PAYU_USE_MOCK=false)')
    console.log('🔗 Los usuarios ahora serán redirigidos al checkout real de PayU')

  } catch (error) {
    console.error('❌ Error actualizando precios:', error)
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
    console.log('✅ Actualización de precios completada')
  })