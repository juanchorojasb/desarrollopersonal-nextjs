import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { enrolled: false, message: 'No autenticado' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const courseId = resolvedParams.id

    // Verificar si existe enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: clerkUserId,
        courseId: courseId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (enrollment) {
      return NextResponse.json({
        enrolled: true,
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
          course: enrollment.course
        }
      })
    } else {
      return NextResponse.json({
        enrolled: false,
        message: 'No inscrito en este curso'
      })
    }

  } catch (error) {
    console.error('❌ Error verificando enrollment:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
