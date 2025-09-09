import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('💎 Iniciando seed de planes de suscripción...')

  try {
    // Check existing plans
    const existingPlans = await prisma.plan.findMany()
    console.log(`📊 Planes existentes: ${existingPlans.length}`)
    
    // Plan Básico
    let basicPlan = await prisma.plan.findFirst({ where: { name: 'basic' } })
    if (!basicPlan) {
      basicPlan = await prisma.plan.create({
        data: {
          name: 'basic',
          description: 'Acceso completo a todos los cursos de desarrollo personal. Perfecto para comenzar tu transformación.',
          price: 25000, // $25,000 COP
          currency: 'COP',
          billingCycle: 'monthly',
          features: [
            'Acceso completo a TODOS los cursos (30+ horas)',
            'Nuevos cursos incluidos automáticamente',
            'Progreso personalizado y certificados',
            'Acceso móvil y descarga offline',
            'Garantía de satisfacción de 7 días',
            'Soporte por email'
          ],
          maxCourses: -1, // ilimitado
          hasLiveSupport: false,
          hasGroupCoaching: false,
          hasPrioritySupport: false,
          isActive: true,
          sortOrder: 1
        }
      })
      console.log(`✅ Plan creado: ${basicPlan.name}`)
    } else {
      console.log(`📋 Plan básico ya existe: ${basicPlan.name}`)
    }

    // Plan Premium
    let premiumPlan = await prisma.plan.findFirst({ where: { name: 'premium' } })
    if (!premiumPlan) {
      premiumPlan = await prisma.plan.create({
        data: {
          name: 'premium',
          description: 'Todo del Plan Básico + talleres en vivo mensuales y sesiones de coaching grupal. Para una transformación acelerada.',
          price: 80000, // $80,000 COP
          currency: 'COP',
          billingCycle: 'monthly',
          features: [
            'Todo lo incluido en el Plan Básico',
            '2 talleres en vivo por mes',
            'Q&A directo con expertos',
            'Comunidad exclusiva Premium',
            'Casos personalizados en talleres',
            'Soporte prioritario',
            'Coaching grupal mensual',
            'Acceso anticipado a nuevos cursos'
          ],
          maxCourses: -1, // ilimitado
          hasLiveSupport: true,
          hasGroupCoaching: true,
          hasPrioritySupport: true,
          isActive: true,
          sortOrder: 2
        }
      })
      console.log(`✅ Plan creado: ${premiumPlan.name}`)
    } else {
      console.log(`📋 Plan premium ya existe: ${premiumPlan.name}`)
    }

    // Plan Individual (para cursos únicos - opcional)
    let individualPlan = await prisma.plan.findFirst({ where: { name: 'individual' } })
    if (!individualPlan) {
      individualPlan = await prisma.plan.create({
        data: {
          name: 'individual',
          description: 'Compra cursos por separado. Perfecto si solo te interesa un tema específico.',
          price: 20000, // $20,000 COP promedio por curso
          currency: 'COP',
          billingCycle: 'one-time',
          features: [
            'Acceso permanente al curso seleccionado',
            'Certificado de finalización',
            'Soporte por email',
            'Actualizaciones gratuitas del curso'
          ],
          maxCourses: 1,
          hasLiveSupport: false,
          hasGroupCoaching: false,
          hasPrioritySupport: false,
          isActive: true,
          sortOrder: 3
        }
      })
      console.log(`✅ Plan creado: ${individualPlan.name}`)
    } else {
      console.log(`📋 Plan individual ya existe: ${individualPlan.name}`)
    }

    console.log('\n🎯 PLANES CREADOS EXITOSAMENTE:')
    console.log('=====================================')
    console.log(`💎 ${basicPlan.name}: $${basicPlan.price.toLocaleString()}/mes`)
    console.log(`👑 ${premiumPlan.name}: $${premiumPlan.price.toLocaleString()}/mes`)
    console.log(`🎯 ${individualPlan.name}: $${individualPlan.price.toLocaleString()}/curso`)

    // Verificar que los planes se crearon correctamente
    const allPlans = await prisma.plan.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    console.log(`\n📋 TOTAL PLANES ACTIVOS: ${allPlans.length}`)
    console.log('🎯 ESTRATEGIA DE MONETIZACIÓN LISTA:')
    console.log('- Plan Básico: Acceso completo por $25k/mes')
    console.log('- Plan Premium: Experiencia premium por $80k/mes') 
    console.log('- Cursos individuales: Opción flexible por $20k promedio')
    console.log('\n💡 VALUE PROPOSITION:')
    console.log('- Valor individual cursos: $135k+ COP')
    console.log('- Precio suscripción: Solo $25k/mes (81% descuento)')
    console.log('- ROI usuario: Recupera inversión en solo 1 curso')

  } catch (error) {
    console.error('❌ Error creando planes:', error)
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
    console.log('✅ Seed de planes completado exitosamente')
  })
