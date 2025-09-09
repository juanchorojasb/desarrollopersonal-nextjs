import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (courseId) {
      const courseProgress = await getCourseProgress(user.clerkId, courseId)
      return NextResponse.json(courseProgress)
    }

    const allProgress = await getAllUserProgress(user.clerkId)
    return NextResponse.json(allProgress)

  } catch (error) {
    console.error('Error getting progress:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

async function getCourseProgress(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  })

  if (!course) {
    throw new Error('Course not found')
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed).length, 0
  )

  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return {
    courseId,
    totalLessons,
    completedLessons,
    progressPercentage,
    modules: course.modules.map(module => ({
      id: module.id,
      title: module.title,
      totalLessons: module.lessons.length,
      completedLessons: module.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed).length,
      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        completed: lesson.progress.length > 0 ? lesson.progress[0].completed : false,
        watchTime: lesson.progress.length > 0 ? lesson.progress[0].watchTime : 0,
        videoDuration: lesson.videoDuration
      }))
    }))
  }
}

async function getAllUserProgress(userId: string) {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  })

  return courses.map(course => {
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
    const completedLessons = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed).length, 0
    )
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return {
      courseId: course.id,
      courseTitle: course.title,
      totalLessons,
      completedLessons,
      progressPercentage
    }
  })
}