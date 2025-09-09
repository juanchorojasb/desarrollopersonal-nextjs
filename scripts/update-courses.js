const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateCourses() {
  try {
    console.log('Iniciando actualización de cursos...')

    // 1. Actualizar curso existente
    await prisma.course.update({
      where: { id: 'arquitectura-sueno' },
      data: {
        title: 'Arquitectura del Descanso: Neurobiología del Sueño Reparador',
        description: 'Domina la ciencia del descanso reparador y optimiza tu sueño para un mejor bienestar mental. Explora la neurobiología del sueño y su impacto en la regulación emocional, consolidación de memoria y neuroplasticidad.',
        updatedAt: new Date()
      }
    })

    // 2. Agregar nuevos módulos
    const newModules = [
      {
        id: 'mod-descanso-2',
        courseId: 'arquitectura-sueno',
        title: 'Optimización del Ambiente de Descanso',
        description: 'Diseño del entorno perfecto para el sueño reparador',
        sortOrder: 2
      },
      {
        id: 'mod-descanso-3', 
        courseId: 'arquitectura-sueno',
        title: 'Rutinas y Rituales de Descanso',
        description: 'Protocolos científicos para preparar el cuerpo y mente',
        sortOrder: 3
      }
    ]

    for (const module of newModules) {
      await prisma.module.create({ data: module })
    }

    console.log('Cursos actualizados exitosamente')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCourses()
