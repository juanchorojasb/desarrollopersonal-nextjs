import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 🔐 Verificar autenticación
    const { userId: clerkUserId } = auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'No autorizado - Debes iniciar sesión' },
        { status: 401 }
      )
    }

    // 📝 Obtener datos del request
    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId es requerido' },
        { status: 400 }
      )
    }

    // 🔍 Verificar que el curso existe
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      )
    }

    // 🚀 AUTO-CREAR USUARIO SI NO EXISTE
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!dbUser) {
      console.log('📝 Usuario no existe en BD, creando:', clerkUserId)
      
      // 👤 Obtener datos adicionales del usuario de Clerk
      const { clerkClient } = await import('@clerk/nextjs/server')
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      
      // ✨ Crear usuario en base de datos
      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          imageUrl: clerkUser.imageUrl || null,
        }
      })
      
      console.log('✅ Usuario creado exitosamente:', dbUser.id)
    } else {
      console.log('👤 Usuario ya existe en BD:', dbUser.id)
    }

    // 🔍 Verificar si ya está inscrito
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: clerkUserId,
        courseId: courseId
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { 
          message: 'Ya estás inscrito en este curso',
          enrollment: existingEnrollment 
        },
        { status: 200 }
      )
    }

    // 📚 Crear enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: clerkUserId, // Usamos clerkId directamente
        courseId: courseId,
        status: 'ACTIVE',
        progress: 0,
        enrolledAt: new Date()
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            level: true,
            price: true
          }
        }
      }
    })

    console.log('🎓 Enrollment creado exitosamente:', enrollment.id)

    // 📈 Actualizar estadísticas del curso (opcional)
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsEnrolled: {
          increment: 1
        }
      }
    }).catch(err => {
      // No es crítico si falla
      console.warn('⚠️ No se pudo actualizar studentsEnrolled:', err.message)
    })

    return NextResponse.json({
      success: true,
      message: 'Inscripción exitosa',
      enrollment,
      course: enrollment.course
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error en enrollment:', error)
    
    // 🚨 Manejar errores específicos
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya estás inscrito en este curso' },
        { status: 409 }
      )
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Curso no válido' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 📊 GET: Obtener enrollments del usuario
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = auth()
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: clerkUserId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            level: true,
            price: true,
            thumbnailUrl: true,
            instructorName: true
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      enrollments
    })

  } catch (error) {
    console.error('❌ Error obteniendo enrollments:', error)
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
