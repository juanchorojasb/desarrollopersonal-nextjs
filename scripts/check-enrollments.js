const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkEnrollments() {
  try {
    console.log('=== CURSOS ===')
    const courses = await prisma.course.findMany()
    courses.forEach(course => {
      console.log(`${course.id}: ${course.title} (activo: ${course.isActive}, gratis: ${course.isFree})`)
    })

    console.log('\n=== ENROLLMENTS ===')
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: { select: { title: true } },
        user: { select: { email: true } }
      }
    })
    
    enrollments.forEach(enrollment => {
      console.log(`Usuario: ${enrollment.user.email} -> Curso: ${enrollment.course.title} (${enrollment.status})`)
    })

    console.log('\n=== USUARIOS ===')
    const users = await prisma.user.findMany()
    console.log(`Total usuarios: ${users.length}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEnrollments()
