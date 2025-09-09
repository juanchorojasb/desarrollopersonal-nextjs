const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkNewUsers() {
  try {
    console.log('=== TODOS LOS USUARIOS ===')
    const users = await prisma.user.findMany()
    users.forEach(user => {
      console.log(`ID: ${user.id}`)
      console.log(`Clerk ID: ${user.clerkId}`)
      console.log(`Email: ${user.email}`)
      console.log(`Nombre: ${user.firstName} ${user.lastName}`)
      console.log('---')
    })

    console.log('\n=== ENROLLMENTS POR USUARIO ===')
    for (const user of users) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        include: { course: { select: { title: true } } }
      })
      
      console.log(`${user.email}: ${enrollments.length} enrollments`)
      enrollments.forEach(e => console.log(`  - ${e.course.title}`))
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNewUsers()
