import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId es requerido' },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      )
    }

    if (course.isFree) {
      return NextResponse.json({
        hasAccess: true,
        reason: 'free_course'
      })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            isActive: true
          },
          include: {
            plan: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        hasAccess: false,
        reason: 'user_not_found',
        needsSubscription: true
      })
    }

    const activeSubscription = user.subscriptions[0]

    if (!activeSubscription) {
      return NextResponse.json({
        hasAccess: false,
        reason: 'no_active_subscription',
        needsSubscription: true
      })
    }

    const now = new Date()
    const isExpired = activeSubscription.currentPeriodEnd && activeSubscription.currentPeriodEnd < now

    if (isExpired) {
      await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: {
          status: 'EXPIRED',
          isActive: false
        }
      })

      return NextResponse.json({
        hasAccess: false,
        reason: 'subscription_expired',
        needsSubscription: true
      })
    }

    return NextResponse.json({
      hasAccess: true,
      reason: 'active_subscription',
      subscription: activeSubscription,
      plan: activeSubscription.plan
    })

  } catch (error) {
    console.error('Error checking course access:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}