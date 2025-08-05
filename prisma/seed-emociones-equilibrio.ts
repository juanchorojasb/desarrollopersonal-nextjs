import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de "Emociones en Equilibrio"...')

  try {
    console.log('⚖️ Iniciando seed del curso "Emociones en Equilibrio: Armonía Interior"...')

    // Verificar si el curso ya existe
    const existingCourse = await prisma.course.findFirst({
      where: {
        title: "Emociones en Equilibrio: Armonía Interior"
      }
    })

    if (existingCourse) {
      console.log('⚠️  El curso ya existe, saltando creación...')
      return existingCourse
    }

    // Crear el curso
    const course = await prisma.course.create({
      data: {
        title: "Emociones en Equilibrio: Armonía Interior",
        description: "Aprende a navegar tus emociones con sabiduría y crear un estado de armonía interior duradero. Un programa intermedio que combina técnicas de regulación emocional, mindfulness y neurociencia para lograr el equilibrio emocional que has estado buscando.",
        shortDesc: "Técnicas de regulación emocional para crear armonía interior y equilibrio duradero",
        thumbnail: "https://desarrollopersonaluno.b-cdn.net/thumbnails/emociones-equilibrio-thumb.jpg",
        level: "intermediate",
        category: "inteligencia-emocional",
        tags: JSON.stringify([
          "equilibrio-emocional",
          "armonía-interior",
          "regulación-emocional",
          "mindfulness",
          "bienestar",
          "intermedio"
        ]),
        price: 25000.0,
        currency: "COP",
        status: "published",
        featured: true,
        duration: 320, // 5h 20m en minutos
        studentsCount: 0,
        instructor: "Lic. María Elena Vásquez"
      }
    })

    console.log(`✅ Curso creado: ${course.title}`)

    // Crear el módulo principal
    const module = await prisma.module.create({
      data: {
        title: "Emociones en Equilibrio - Programa Completo",
        description: "Programa completo de 6 sesiones para lograr equilibrio y armonía emocional",
        position: 1,
        isRequired: true,
        duration: 320, // 5h 20m en minutos
        courseId: course.id
      }
    })

    console.log(`✅ Módulo creado: ${module.title}`)
    console.log('📚 Creando lecciones...')

    // Lecciones del curso
    const lessons = [
      {
        title: "Sesión 1: El Mapa de tus Emociones",
        description: "Comprende el mundo emocional humano y aprende a identificar, nombrar y navegar tus propias emociones con claridad y compasión.",
        duration: "55 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/emociones-equilibrio/sesion-1-mapa-emociones.mp4",
        isFree: true,
        order: 1
      },
      {
        title: "Sesión 2: La Sabiduría de las Emociones Difíciles",
        description: "Descubre el mensaje oculto en emociones como la ira, miedo y tristeza, y aprende a transformarlas en aliadas de tu crecimiento.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/emociones-equilibrio/sesion-2-sabiduria-emociones-dificiles.mp4",
        isFree: false,
        order: 2
      },
      {
        title: "Sesión 3: Técnicas de Regulación Emocional",
        description: "Herramientas prácticas y científicamente validadas para regular tus emociones en tiempo real y mantener tu equilibrio interior.",
        duration: "60 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/emociones-equilibrio/sesion-3-tecnicas-regulacion.mp4",
        isFree: false,
        order: 3
      },
      {
        title: "Sesión 4: Mindfulness Emocional",
        description: "Desarrolla la capacidad de observar tus emociones sin ser arrastrado por ellas, creando espacio para respuestas conscientes.",
        duration: "45 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/emociones-equilibrio/sesion-4-mindfulness-emocional.mp4",
        isFree: false,
        order: 4
      },
      {
        title: "Sesión 5: Relaciones Emocionales Saludables",
        description: "Aprende a mantener tu equilibrio emocional en las relaciones y a comunicarte desde un lugar de armonía interior.",
        duration: "50 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/emociones-equilibrio/sesion-5-relaciones-emocionales.mp4",
        isFree: false,
        order: 5
      },
      {
        title: "Sesión 6: Construyendo tu Estilo de Vida Equilibrado",
        description: "Integra todo lo aprendido en un estilo de vida que mantenga tu armonía emocional y bienestar a largo plazo.",
        duration: "40 min",
        videoUrl: "https://desarrollopersonaluno.b-cdn.net/cursos/emociones-equilibrio/sesion-6-estilo-vida-equilibrado.mp4",
        isFree: false,
        order: 6
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

    console.log('\n🎯 CURSO "EMOCIONES EN EQUILIBRIO" CREADO EXITOSAMENTE:')
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
    console.log('✅ Seed de "Emociones en Equilibrio" completado exitosamente')
  })
