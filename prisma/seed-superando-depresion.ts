import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de "Superando la Depresión"...')

  try {
    console.log('🌅 Iniciando seed del curso "Superando la Depresión: Un Camino de Esperanza"...')

    // Verificar si el curso ya existe
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: "Superando la Depresión: Un Camino de Esperanza"
      }
    })

    if (existingCourse) {
      console.log('⚠️  El curso ya existe, saltando creación...')
      return
    }

    // Crear el curso
    const course = await prisma.course.create({
      data: {
        title: "Superando la Depresión: Un Camino de Esperanza",
        description: "Un programa avanzado y científicamente fundamentado para superar la depresión, recuperar la esperanza y construir una vida plena. Basado en terapia cognitivo-conductual, mindfulness y neurociencia aplicada.",
        shortDesc: "Programa avanzado para superar la depresión con herramientas científicamente validadas",
        thumbnail: "https://desarrollopersonaluno.b-cdn.net/thumbnails/superando-depresion-thumb.jpg",
        level: "advanced",
        category: "salud-mental",
        tags: JSON.stringify([
          "depresión",
          "esperanza",
          "terapia-cognitiva",
          "mindfulness",
          "neurociencia",
          "avanzado"
        ]),
        price: 35000.0,
        currency: "COP",
        status: "published",
        featured: true,
        duration: 645, // 10h 45m en minutos
        studentsCount: 0,
        instructor: "Dr. Ana María Rodríguez"
      }
    })

    console.log(`✅ Curso creado: ${course.title}`)

    // Crear el módulo principal
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Superando la Depresión - Programa Avanzado",
        description: "Programa completo de 12 sesiones para superar la depresión y recuperar la esperanza",
        order: 1
      }
    })

    console.log(`✅ Módulo creado: ${module.title}`)
    console.log('📚 Creando lecciones...')

    // Lecciones del curso
    const lessons = [
      {
        title: "Sesión 1: Entendiendo la Depresión desde la Neurociencia",
        description: "Comprende qué sucede en tu cerebro durante la depresión y cómo la neuroplasticidad puede ayudarte a sanar.",
        duration: "55 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-1-neurociencia-depresion.mp4",
        isFree: true,
        order: 1
      },
      {
        title: "Sesión 2: Identificando Patrones de Pensamiento Depresivos",
        description: "Aprende a reconocer y documentar los pensamientos automáticos que alimentan la depresión.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-2-patrones-pensamiento.mp4",
        isFree: false,
        order: 2
      },
      {
        title: "Sesión 3: Reestructuración Cognitiva Avanzada",
        description: "Técnicas científicamente validadas para transformar pensamientos negativos en perspectivas realistas y esperanzadoras.",
        duration: "60 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-3-reestructuracion-cognitiva.mp4",
        isFree: false,
        order: 3
      },
      {
        title: "Sesión 4: Activación Conductual y Recuperación del Placer",
        description: "Estrategias para reactivar tu vida y recuperar la capacidad de experimentar placer y satisfacción.",
        duration: "55 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-4-activacion-conductual.mp4",
        isFree: false,
        order: 4
      },
      {
        title: "Sesión 5: Mindfulness para la Depresión (MBCT)",
        description: "Terapia cognitiva basada en mindfulness: técnicas específicas para prevenir recaídas depresivas.",
        duration: "65 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-5-mindfulness-mbct.mp4",
        isFree: false,
        order: 5
      },
      {
        title: "Sesión 6: Sanando Heridas Emocionales del Pasado",
        description: "Procesa y sana experiencias pasadas que contribuyen a la depresión actual con técnicas de trauma-informed care.",
        duration: "70 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-6-sanando-heridas.mp4",
        isFree: false,
        order: 6
      },
      {
        title: "Sesión 7: Construyendo Esperanza y Propósito",
        description: "Desarrolla una visión clara de futuro y encuentra el propósito que te motive a seguir adelante.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-7-esperanza-proposito.mp4",
        isFree: false,
        order: 7
      },
      {
        title: "Sesión 8: Relaciones Saludables y Apoyo Social",
        description: "Aprende a construir y mantener relaciones que nutran tu bienestar emocional y recovery.",
        duration: "45 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-8-relaciones-saludables.mp4",
        isFree: false,
        order: 8
      },
      {
        title: "Sesión 9: Manejo de Crisis y Pensamientos Suicidas",
        description: "Herramientas de seguridad y estrategias de manejo para momentos de crisis severa.",
        duration: "60 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-9-manejo-crisis.mp4",
        isFree: false,
        order: 9
      },
      {
        title: "Sesión 10: Autocuidado Integral y Estilo de Vida",
        description: "Desarrolla rutinas de autocuidado que apoyen tu bienestar físico, mental y emocional.",
        duration: "40 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-10-autocuidado.mp4",
        isFree: false,
        order: 10
      },
      {
        title: "Sesión 11: Plan de Prevención de Recaídas",
        description: "Crea un plan personalizado para mantener tu bienestar y prevenir futuros episodios depresivos.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-11-prevencion-recaidas.mp4",
        isFree: false,
        order: 11
      },
      {
        title: "Sesión 12: Integración y Celebración del Camino Recorrido",
        description: "Consolida todo lo aprendido y celebra tu transformación hacia una vida llena de esperanza.",
        duration: "45 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/superando-depresion/sesion-12-integracion-celebracion.mp4",
        isFree: false,
        order: 12
      }
    ]

    // Crear todas las lecciones
    for (const lessonData of lessons) {
      const lesson = await prisma.lesson.create({
        data: {
          moduleId: module.id,
          ...lessonData
        }
      })
      console.log(`✅ Lección ${lesson.order}: ${lesson.title}`)
    }

    console.log('\n🎯 CURSO "SUPERANDO LA DEPRESIÓN" CREADO EXITOSAMENTE:')
    console.log(`📖 Título: ${course.title}`)
    console.log(`💰 Precio: $${course.price.toLocaleString()} COP`)
    console.log(`📚 Módulos: 1`)
    console.log(`🎬 Lecciones: ${lessons.length}`)
    console.log(`🆓 Lección gratuita: ${lessons.find(l => l.isFree)?.title}`)
    console.log(`⏱️  Duración total: ${Math.floor(course.duration / 60)}h ${course.duration % 60}m`)

  } catch (error) {
    console.error('❌ Error ejecutando seed:', error)
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
    console.log('✅ Seed de "Superando la Depresión" completado exitosamente')
  })
