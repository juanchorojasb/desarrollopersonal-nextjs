import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de "Navegando la Tormenta Interior"...')

  try {
    console.log('🌊 Iniciando seed del curso "Navegando la Tormenta Interior: Un Camino hacia la Vida"...')

    // Verificar si el curso ya existe
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: "Navegando la Tormenta Interior: Un Camino hacia la Vida"
      }
    })

    if (existingCourse) {
      console.log('⚠️  El curso ya existe, saltando creación...')
      return existingCourse
    }

    // Crear el curso
    const course = await prisma.course.create({
      data: {
        title: "Navegando la Tormenta Interior: Un Camino hacia la Vida",
        description: "Un programa compasivo y científicamente fundamentado para superar momentos difíciles y encontrar un camino hacia una vida plena. Combina técnicas de autocompasión, mindfulness y neurociencia para transformar el dolor en crecimiento.",
        shortDesc: "Encuentra un camino hacia la vida plena a través de la autocompasión y el mindfulness científico",
        thumbnail: "https://desarrollopersonaluno.b-cdn.net/thumbnails/navegando-tormenta-thumb.jpg",
        level: "beginner",
        category: "desarrollo-personal",
        tags: JSON.stringify([
          "autocompasión",
          "mindfulness",
          "crecimiento-personal",
          "superación",
          "bienestar",
          "principiante"
        ]),
        price: 25000.0,
        currency: "COP",
        status: "published",
        featured: true,
        duration: 260, // 4h 20m en minutos
        studentsCount: 0,
        instructor: "Equipo DesarrolloPersonal.uno",
        position: 1
      }
    })

    console.log(`✅ Curso creado: ${course.title}`)

    // Crear el módulo principal
    const module = await prisma.module.create({
      data: {
        title: "Navegando la Tormenta Interior - Programa Completo",
        description: "Programa completo de 5 sesiones para encontrar un camino hacia la vida plena",
        position: 1,
        isRequired: true,
        duration: 260, // 4h 20m en minutos
        courseId: course.id
      }
    })

    console.log(`✅ Módulo creado: ${module.title}`)
    console.log('📚 Creando lecciones...')

    // Lecciones del curso
    const lessons = [
      {
        title: "Sesión 1: Reconociendo la Tormenta Interior",
        description: "Comprende que es normal sentirse abrumado y aprende a reconocer tus patrones emocionales con compasión.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/navegando-tormenta/sesion-1-reconociendo-tormenta.mp4",
        isFree: true,
        order: 1
      },
      {
        title: "Sesión 2: El Poder de la Autocompasión",
        description: "Aprende a tratarte con la misma bondad que le mostrarías a un buen amigo en momentos difíciles.",
        duration: "55 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/navegando-tormenta/sesion-2-autocompasion.mp4",
        isFree: false,
        order: 2
      },
      {
        title: "Sesión 3: Mindfulness para Calmar la Mente",
        description: "Técnicas de atención plena para encontrar calma en medio del caos emocional.",
        duration: "60 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/navegando-tormenta/sesion-3-mindfulness-calma.mp4",
        isFree: false,
        order: 3
      },
      {
        title: "Sesión 4: Transformando el Dolor en Crecimiento",
        description: "Descubre cómo las experiencias difíciles pueden convertirse en fuentes de sabiduría y fortaleza.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/navegando-tormenta/sesion-4-dolor-crecimiento.mp4",
        isFree: false,
        order: 4
      },
      {
        title: "Sesión 5: Construyendo un Camino hacia la Vida Plena",
        description: "Integra todo lo aprendido para crear un plan personalizado hacia el bienestar duradero.",
        duration: "45 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/navegando-tormenta/sesion-5-camino-vida-plena.mp4",
        isFree: false,
        order: 5
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

    console.log('\n🎯 CURSO "NAVEGANDO LA TORMENTA INTERIOR" CREADO EXITOSAMENTE:')
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
    console.log('✅ Seed de "Navegando la Tormenta Interior" completado exitosamente')
  })
