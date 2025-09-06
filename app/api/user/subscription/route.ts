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

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        isActive: true
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan: {
          name: subscription.plan.name,
          displayName: subscription.plan.name,
          hasLiveWorkshops: subscription.plan.hasLiveSupport,
          hasCoaching: subscription.plan.hasGroupCoaching,
          maxCourses: subscription.plan.maxCourses
        },
        startDate: subscription.currentPeriodStart?.toISOString() || subscription.createdAt.toISOString(),
        endDate: subscription.currentPeriodEnd?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        priceAmount: subscription.priceAmount,
        billingCycle: subscription.billingCycle
      }
    })
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}