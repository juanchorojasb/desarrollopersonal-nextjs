const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addDescansoLessons() {
  try {
    console.log('Agregando nuevas lecciones de Arquitectura del Descanso...')

    const lessons = [
      {
        id: 'lesson-ambiente-1',
        moduleId: 'mod-descanso-2',
        title: 'Sesión 2: Temperatura y Ventilación Óptimas',
        content: 'Configuración científica del ambiente térmico para el descanso profundo y recuperación neurológica.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/a2d31bb1-bd57-424e-88a5-54229d0bf142',
        videoDuration: 2700,
        sortOrder: 1,
        isActive: true,
        isFree: false
      },
      {
        id: 'lesson-ambiente-2',
        moduleId: 'mod-descanso-2',
        title: 'Sesión 3: Iluminación y Ritmos Circadianos',
        content: 'Manejo estratégico de la luz para optimizar la producción natural de melatonina.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/ef26a4b5-db39-4239-a049-2d825910bb8b',
        videoDuration: 3000,
        sortOrder: 2,
        isActive: true,
        isFree: false
      },
      {
        id: 'lesson-rutinas-1',
        moduleId: 'mod-descanso-3',
        title: 'Sesión 4: Protocolo de Desconexión Digital',
        content: 'Técnicas neurocientíficas para reducir la activación del sistema nervioso antes del descanso.',
        videoUrl: 'https://iframe.mediadelivery.net/play/476857/2d6144b5-f737-49fe-b6a0-a71aad965269',
        videoDuration: 2400,
        sortOrder: 1,
        isActive: true,
        isFree: false
      }
    ]

    for (const lesson of lessons) {
      await prisma.lesson.create({ data: lesson })
    }

    console.log('Lecciones de Arquitectura del Descanso agregadas exitosamente')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addDescansoLessons()
