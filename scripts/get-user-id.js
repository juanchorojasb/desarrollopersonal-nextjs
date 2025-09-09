const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getUserId() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'juanchorojasb@gmail.com' }
    })
    
    console.log('ID del usuario:', user.id)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getUserId()
