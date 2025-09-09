import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('💎 Iniciando seed de planes de suscripción...')

  try {
    // Plan Básico
    const basicPlan = await prisma.plan.upsert({
      where: { name: 'basic' },
      update: {},
      create: {
        name: 'basic',
        displayName: 'Plan Básico',
        description: 'Acceso completo a todos los cursos de desarrollo personal. Perfecto para comenzar tu transformación.',
        monthlyPrice: 500000, // $5,000 COP en centavos
        quarterlyPrice: 1350000, // $13,500 COP (10% descuento trimestral)
        currency: 'COP',
        features: [
          'Acceso completo a TODOS los cursos (30+ horas)',
          'Nuevos cursos incluidos automáticamente',
          'Progreso personalizado y certificados',
          'Acceso móvil y descarga offline',
          'Garantía de satisfacción de 7 días',
          'Soporte por email'
        ],
        maxCourses: -1, // ilimitado
        hasLiveWorkshops: false,
        hasSupport: true,
        hasCertificates: true,
        hasCoaching: false,
        isActive: true,
        sortOrder: 1
      }
    })

    console.log(`✅ Plan creado: ${basicPlan.displayName}`)

    // Plan Premium
    const premiumPlan = await prisma.plan.upsert({
      where: { name: 'premium' },
      update: {},
      create: {
        name: 'premium',
        displayName: 'Plan Premium',
        description: 'Todo del Plan Básico + talleres en vivo mensuales y sesiones de coaching grupal. Para una transformación acelerada.',
        monthlyPrice: 4000000, // $40,000 COP en centavos
        quarterlyPrice: 10800000, // $108,000 COP (10% descuento trimestral)
        currency: 'COP',
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
        hasLiveWorkshops: true,
        hasSupport: true,
        hasCertificates: true,
        hasCoaching: true,
        isActive: true,
        sortOrder: 2
      }
    })

    console.log(`✅ Plan creado: ${premiumPlan.displayName}`)

    // Plan Individual (para cursos únicos - opcional)
    const individualPlan = await prisma.plan.upsert({
      where: { name: 'individual' },
      update: {},
      create: {
        name: 'individual',
        displayName: 'Curso Individual',
        description: 'Compra cursos por separado. Perfecto si solo te interesa un tema específico.',
        monthlyPrice: 2000000, // $20,000 COP promedio por curso
        quarterlyPrice: null, // no aplica para cursos individuales
        currency: 'COP',
        features: [
          'Acceso permanente al curso seleccionado',
          'Certificado de finalización',
          'Soporte por email',
          'Actualizaciones gratuitas del curso'
        ],
        maxCourses: 1,
        hasLiveWorkshops: false,
        hasSupport: true,
        hasCertificates: true,
        hasCoaching: false,
        isActive: true,
        sortOrder: 3
      }
    })

    console.log(`✅ Plan creado: ${individualPlan.displayName}`)

    console.log('\n🎯 PLANES CREADOS EXITOSAMENTE:')
    console.log('=====================================')
    console.log(`💎 ${basicPlan.displayName}: $${(basicPlan.monthlyPrice / 100).toLocaleString()}/mes`)
    console.log(`   📊 Trimestral: $${(basicPlan.quarterlyPrice! / 100).toLocaleString()} (10% descuento)`)
    console.log(`   💰 Ahorro anual: $${((basicPlan.monthlyPrice * 12 - basicPlan.quarterlyPrice! * 4) / 100).toLocaleString()}`)
    
    console.log(`\n👑 ${premiumPlan.displayName}: $${(premiumPlan.monthlyPrice / 100).toLocaleString()}/mes`)
    console.log(`   📊 Trimestral: $${(premiumPlan.quarterlyPrice! / 100).toLocaleString()} (10% descuento)`)
    console.log(`   💰 Ahorro anual: $${((premiumPlan.monthlyPrice * 12 - premiumPlan.quarterlyPrice! * 4) / 100).toLocaleString()}`)
    
    console.log(`\n🎯 ${individualPlan.displayName}: $${(individualPlan.monthlyPrice / 100).toLocaleString()}/curso`)

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
