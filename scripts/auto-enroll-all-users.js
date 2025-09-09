const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function autoEnrollAllUsers() {
  try {
    const users = await prisma.user.findMany()
    const courses = await prisma.course.findMany()

    for (const user of users) {
      for (const course of courses) {
        const exists = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id
            }
          }
        })

        if (!exists) {
          await prisma.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              status: 'ACTIVE',
              progress: 0
            }
          })
          console.log(`Enrolled ${user.email} in ${course.title}`)
        }
      }
    }

    console.log('Auto-enrollment completado')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

autoEnrollAllUsers()
