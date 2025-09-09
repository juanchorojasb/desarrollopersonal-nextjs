const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addMissingEnrollment() {
  try {
    console.log('Creando enrollment faltante para habitos-estudio-efectivos...')

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: 'user_30fGz19mOyfmywnXBNgplVBDMbb',
        courseId: 'habitos-estudio-efectivos',
        status: 'ACTIVE',
        progress: 0
      }
    })

    console.log('Enrollment creado exitosamente:', enrollment.id)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addMissingEnrollment()
