import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed completo de 7 cursos con MediaDelivery...')

  // Configuración de MediaDelivery
  const MEDIA_DELIVERY_BASE = "https://iframe.mediadelivery.net/play/476857"

  const coursesData = [
    {
      slug: "habitos-estudio-efectivos",
      title: "Hábitos de Estudio Efectivos",
      description: "Desarrolla técnicas de estudio probadas para maximizar tu aprendizaje y retención de información.",
      duration: 300, // 5 horas
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/habitos-estudio-thumb.jpg",
      videos: [
        { id: "86e279ce-ee92-494d-aaad-47719c3b86fe", title: "Introducción a los Hábitos de Estudio", duration: 60 },
        { id: "f88c9edf-3c7a-4186-80c1-88237f32c40b", title: "Técnicas de Memorización", duration: 75 },
        { id: "846aa33a-ae7d-4531-95e1-a5e4c575d289", title: "Organización del Tiempo de Estudio", duration: 65 },
        { id: "3b8eb44e-39a6-480f-b87f-aa96334e4a8f", title: "Ambiente Óptimo de Aprendizaje", duration: 50 },
        { id: "014a0983-b268-4372-a94d-3699e86ee76c", title: "Evaluación y Mejora Continua", duration: 50 }
      ]
    },
    {
      slug: "gps-salud-mental",
      title: "GPS Salud Mental",
      description: "Tu guía personal para navegar el bienestar mental y encontrar equilibrio en tu vida diaria.",
      duration: 240, // 4 horas
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/gps-salud-mental-thumb.jpg",
      videos: [
        { id: "93fd37b8-4ccb-4b1b-9227-d8accebfabaf", title: "Mapa de tu Salud Mental", duration: 60 },
        { id: "c71755cc-d89e-4c76-8870-e52c6ab17658", title: "Herramientas de Autocuidado", duration: 60 },
        { id: "8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc", title: "Navegando Crisis Emocionales", duration: 65 },
        { id: "e33758a5-aeda-4a0c-b12e-aad06cd20a78", title: "Plan de Bienestar Personalizado", duration: 55 }
      ]
    },
    {
      slug: "arquitectura-del-descanso",
      title: "Arquitectura del Descanso",
      description: "Diseña tu descanso perfecto para maximizar la recuperación y energía en tu día a día.",
      duration: 200, // 3h 20m
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/arquitectura-descanso-thumb.jpg",
      videos: [
        { id: "a2d31bb1-bd57-424e-88a5-54229d0bf142", title: "Fundamentos del Descanso", duration: 50 },
        { id: "ef26a4b5-db39-4239-a049-2d825910bb8b", title: "Higiene del Sueño", duration: 55 },
        { id: "2d6144b5-f737-49fe-b6a0-a71aad965269", title: "Técnicas de Relajación", duration: 45 },
        { id: "95c57c4c-eccb-428b-9519-2a468002a0cf", title: "Rutinas de Descanso Activo", duration: 50 }
      ]
    },
    {
      slug: "gestionando-la-depresion",
      title: "Gestionando la Depresión",
      description: "Estrategias prácticas y herramientas terapéuticas para superar episodios depresivos.",
      duration: 180, // 3 horas
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/gestion-depresion-thumb.jpg",
      videos: [
        { id: "5d457920-2a95-4fce-a326-ce664ab3ff97", title: "Comprendiendo la Depresión", duration: 65 },
        { id: "4741f5f0-b7c6-4b8c-b07a-a5896f282218", title: "Herramientas de Autoayuda", duration: 60 },
        { id: "a96727cf-ad3a-42d4-93d5-53fbb1bf845e", title: "Construyendo Resistencia Mental", duration: 55 }
      ]
    },
    {
      slug: "emociones-equilibrio",
      title: "Emociones en Equilibrio",
      description: "Aprende a navegar tus emociones con sabiduría y crear un estado de armonía interior duradero.",
      duration: 540, // 9 horas
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/emociones-equilibrio-thumb.jpg",
      videos: [
        { id: "cea9cf65-6466-4ebd-b670-8baea2f6c1e9", title: "El Mapa de tus Emociones", duration: 55 },
        { id: "7288352b-3466-4477-a805-a7a5da3fcc71", title: "La Sabiduría de las Emociones Difíciles", duration: 50 },
        { id: "c189a931-08ea-4aeb-8d6f-a95d0b3873f4", title: "Técnicas de Regulación Emocional", duration: 60 },
        { id: "d837af16-6e3f-46ef-9b86-cf6f1795c2ac", title: "Mindfulness Emocional", duration: 45 },
        { id: "69ab3b9f-486b-4c4f-b1d5-d44bb490b55c", title: "Relaciones Emocionales Saludables", duration: 50 },
        { id: "0dde13f5-7915-46d4-b2d8-08af8a1777f7", title: "Construyendo tu Estilo de Vida Equilibrado", duration: 40 },
        { id: "f36f8f75-4b66-4747-bcff-72be870aaa27", title: "Inteligencia Emocional Avanzada", duration: 65 },
        { id: "cb737748-58c9-4f90-a6cf-36041f6c3861", title: "Transformación Emocional", duration: 55 },
        { id: "8c3472e4-d00a-4177-bae7-8511cd19d2a8", title: "Maestría Emocional", duration: 60 }
      ]
    },
    {
      slug: "neurocalma",
      title: "NeuroCalma",
      description: "Técnicas de neurociencia aplicada para reducir estrés y ansiedad de manera efectiva.",
      duration: 450, // 7.5 horas
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/neurocalma-thumb.jpg",
      videos: [
        { id: "0d189ecb-71e2-4f32-a47c-38a298a2e793", title: "Neurociencia del Estrés", duration: 50 },
        { id: "6b7cb42c-bb6f-42e6-b064-8d755843be7f", title: "Técnicas de Respiración Neuronal", duration: 45 },
        { id: "9a9b8c38-3bcb-4b78-984e-a345bf9f8a61", title: "Meditación Neurocientífica", duration: 55 },
        { id: "612c76ff-d82b-4222-b8fe-05d4c41c2a05", title: "Reprogramación Neural", duration: 60 },
        { id: "4b53e15e-da14-4b72-a504-c89a88845afe", title: "Química de la Calma", duration: 50 },
        { id: "e9861eb2-f938-41cb-963c-41c863cdafc6", title: "Neuroplasticidad y Bienestar", duration: 45 },
        { id: "1c976c5d-b474-4ca6-87b9-87976c82d422", title: "Protocolo NeuroCalma", duration: 55 },
        { id: "a50d21fe-71e9-407b-b081-72de07cbcca0", title: "Mantenimiento del Estado Calm", duration: 45 },
        { id: "e3574e25-d69b-4fa3-ad02-dff865385046", title: "NeuroCalma Avanzado", duration: 45 }
      ]
    },
    {
      slug: "navegando-tormenta-interior",
      title: "Navegando la Tormenta Interior",
      description: "Herramientas para gestionar crisis emocionales y encontrar estabilidad en tiempos difíciles.",
      duration: 275, // 4h 35m
      imageUrl: "https://desarrollopersonaluno.b-cdn.net/thumbnails/tormenta-interior-thumb.jpg",
      videos: [
        { id: "e332c8c8-1db6-4bca-aac9-7ac54ecb8896", title: "Anatomía de la Tormenta Interior", duration: 60 },
        { id: "3cb0913f-bd2c-45bb-89cb-6d00d8156a31", title: "Técnicas de Estabilización", duration: 55 },
        { id: "327e4e9d-632d-45a6-a28c-1c7d15534985", title: "Navegando la Crisis", duration: 50 },
        { id: "3f1f9265-f391-4133-942c-944897178729", title: "Reconstrucción Post-Crisis", duration: 55 },
        { id: "79a8778c-21c5-4344-98f9-410deb238324", title: "Fortaleza Interior Duradera", duration: 55 }
      ]
    }
  ]

  console.log('🧹 Limpiando datos existentes...')
  
  // Limpiar datos existentes en orden correcto
  await prisma.lessonProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()
  await prisma.course.deleteMany()

  console.log('✅ Datos limpiados')

  let totalCourses = 0
  let totalLessons = 0

  // Crear cada curso con sus módulos y lecciones
  for (const courseData of coursesData) {
    console.log(`\n📚 Creando curso: ${courseData.title}...`)

    // Crear el curso
    const course = await prisma.course.create({
      data: {
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description,
        imageUrl: courseData.imageUrl,
        duration: courseData.duration,
        isActive: true,
        isFree: false,
        sortOrder: totalCourses + 1
      }
    })

    // Crear módulo principal del curso
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: `${courseData.title} - Programa Completo`,
        description: courseData.description,
        sortOrder: 1,
        isActive: true
      }
    })

    // Crear lecciones con videos de MediaDelivery
    for (let i = 0; i < courseData.videos.length; i++) {
      const video = courseData.videos[i]
      const lesson = await prisma.lesson.create({
        data: {
          moduleId: module.id,
          title: `Sesión ${i + 1}: ${video.title}`,
          content: `Contenido de la sesión ${i + 1} del curso ${courseData.title}`,
          videoId: video.id,
          videoUrl: `${MEDIA_DELIVERY_BASE}/${video.id}`,
          videoDuration: video.duration * 60, // Convertir minutos a segundos
          sortOrder: i + 1,
          isActive: true,
          isFree: i === 0 // Primera lección gratuita
        }
      })
      
      console.log(`  ✅ Lección ${i + 1}: ${lesson.title}`)
      totalLessons++
    }

    console.log(`✅ Curso completado: ${course.title} (${courseData.videos.length} lecciones)`)
    totalCourses++
  }

  console.log('\n🎯 SEED COMPLETADO EXITOSAMENTE:')
  console.log(`📚 Cursos creados: ${totalCourses}`)
  console.log(`🎬 Lecciones totales: ${totalLessons}`)
  console.log(`🎥 Videos MediaDelivery configurados: ${totalLessons}`)
  console.log(`🆓 Lecciones gratuitas: ${totalCourses} (primera de cada curso)`)
  console.log('\n📋 CURSOS DISPONIBLES:')
  
  for (const course of coursesData) {
    console.log(`  • ${course.title} - /${course.slug} (${course.videos.length} sesiones)`)
  }

  console.log('\n🔗 URLs de acceso:')
  console.log('Dashboard principal: /dashboard/cursos')
  for (const course of coursesData) {
    console.log(`${course.title}: /dashboard/cursos/${course.slug}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Seed de cursos completado exitosamente')
  })