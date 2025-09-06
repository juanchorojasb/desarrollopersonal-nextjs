import { User } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function syncUserToDatabase(clerkUser: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    }

    if (existingUser) {
      return await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: userData
      })
    } else {
      return await prisma.user.create({
        data: userData
      })
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
    throw error
  }
}

export async function getUserFromDatabase(clerkId: string) {
  try {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        subscriptions: {
          include: { plan: true },
          where: { isActive: true }
        },
        enrollments: {
          include: { course: true }
        }
      }
    })
  } catch (error) {
    console.error('Error getting user from database:', error)
    throw error
  }
}

export async function deleteUserFromDatabase(clerkId: string) {
  try {
    return await prisma.user.delete({
      where: { clerkId }
    })
  } catch (error) {
    console.error('Error deleting user from database:', error)
    throw error
  }
}