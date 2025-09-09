const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createHabitosCurso() {
  try {
    console.log('Creando curso de Hábitos de Estudio...')

    // Crear el curso
    const course = await prisma.course.create({
      data: {
        id: 'habitos-estudio-efectivos',
        title: 'Hábitos de Estudio Efectivos: Metodología Científica',
        description: 'Desarrolla técnicas de estudio basadas en neurociencia cognitiva para maximizar la retención, comprensión y aplicación del conocimiento de forma sostenible.',
        imageUrl: 'https://picsum.photos/400/300?random=15',
        isActive: true,
        isFree: false,
        sortOrder: 3,
        duration: 120
      }
    })

    // Crear módulos
    const modules = [
      {
        id: 'mod-estudio-1',
        courseId: 'habitos-estudio-efectivos',
        title: 'Fundamentos Neurocientíficos del Aprendizaje',
        description: 'Base científica de la memoria, atención y procesamiento cognitivo',
        sortOrder: 1
      },
      {
        id: 'mod-estudio-2',
        courseId: 'habitos-estudio-efectivos',
        title: 'Técnicas de Retención y Consolidación',
        description: 'Métodos comprobados para optimizar la memoria a largo plazo',
        sortOrder: 2
      },
      {
        id: 'mod-estudio-3',
        courseId: 'habitos-estudio-efectivos',
        title: 'Estrategias de Organización y Planificación',
        description: 'Sistemas de productividad académica sostenibles',
        sortOrder: 3
      }
    ]

    for (const module of modules) {
      await prisma.module.create({ data: module })
    }

    // Crear lecciones
    const lessons = [
      {
        id: 'lesson-estudio-1',
        moduleId: 'mod-estudio-1',
        title: 'Sesión 1: Neuroplasticidad y Formación de Hábitos',
        content: 'Comprende cómo el cerebro forma nuevos patrones de aprendizaje y los consolida.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/86e279ce-ee92-494d-aaad-47719c3b86fe',
        videoDuration: 3600,
        sortOrder: 1,
        isActive: true,
        isFree: true
      },
      {
        id: 'lesson-estudio-2',
        moduleId: 'mod-estudio-1',
        title: 'Sesión 2: Atención Selectiva y Concentración Profunda',
        content: 'Técnicas para mantener el foco cognitivo durante períodos extendidos de estudio.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/f88c9edf-3c7a-4186-80c1-88237f32c40b',
        videoDuration: 3300,
        sortOrder: 2,
        isActive: true,
        isFree: false
      },
      {
        id: 'lesson-estudio-3',
        moduleId: 'mod-estudio-2',
        title: 'Sesión 3: Repetición Espaciada y Curva del Olvido',
        content: 'Aplicación práctica de algoritmos de repetición para maximizar la retención.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/846aa33a-ae7d-4531-95e1-a5e4c575d289',
        videoDuration: 2800,
        sortOrder: 1,
        isActive: true,
        isFree: false
      },
      {
        id: 'lesson-estudio-4',
        moduleId: 'mod-estudio-2',
        title: 'Sesión 4: Mapas Mentales y Conexiones Conceptuales',
        content: 'Estructuración visual del conocimiento para facilitar la comprensión profunda.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/3b8eb44e-39a6-480f-b87f-aa96334e4a8f',
        videoDuration: 3100,
        sortOrder: 2,
        isActive: true,
        isFree: false
      },
      {
        id: 'lesson-estudio-5',
        moduleId: 'mod-estudio-3',
        title: 'Sesión 5: Sistemas de Productividad Académica',
        content: 'Implementación de metodologías organizacionales para el estudio sostenible.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/014a0983-b268-4372-a94d-3699e86ee76c',
        videoDuration: 2900,
        sortOrder: 1,
        isActive: true,
        isFree: false
      }
    ]

    for (const lesson of lessons) {
      await prisma.lesson.create({ data: lesson })
    }

    console.log('Curso de Hábitos de Estudio creado exitosamente')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createHabitosCurso()
