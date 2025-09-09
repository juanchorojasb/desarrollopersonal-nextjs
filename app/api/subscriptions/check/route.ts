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
        hasActiveSubscription: false,
        subscription: null,
        plan: null
      })
    }

    const activeSubscription = user.subscriptions[0]

    if (!activeSubscription) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
        plan: null
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
        hasActiveSubscription: false,
        subscription: null,
        plan: null,
        expired: true
      })
    }

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: activeSubscription,
      plan: activeSubscription.plan,
      canAccessCourses: true,
      canAccessWorkshops: ['PREMIUM', 'PREMIUM_PLUS'].includes(activeSubscription.plan.name.toUpperCase())
    })

  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}