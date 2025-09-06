import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const [enrollments, lessonProgress] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: user.id },
        include: { course: true }
      }),
      prisma.lessonProgress.findMany({
        where: { userId: user.id },
        include: { lesson: true }
      })
    ])

    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length
    const totalWatchTime = lessonProgress.reduce((total, progress) => total + progress.watchTime, 0)
    const completedLessons = lessonProgress.filter(p => p.completed).length

    const currentStreak = 7

    const stats = {
      totalCourses,
      completedCourses,
      totalWatchTime: Math.floor(totalWatchTime / 60),
      currentStreak,
      completedLessons,
      nextWorkshop: {
        title: 'Fundamentos de la Autoestima',
        date: '2025-08-02T14:00:00Z'
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}