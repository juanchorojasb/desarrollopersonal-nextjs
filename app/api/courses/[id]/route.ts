import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await context.params;

    // Verificar si es para dashboard (incluir datos de progreso)
    const url = new URL(request.url);
    const isDashboard = url.searchParams.get('dashboard') === 'true';

    if (isDashboard) {
      // Para dashboard: acceso completo temporal
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: {
              lessons: {
                orderBy: { sortOrder: 'asc' }
              }
            },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      if (!course) {
        return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
      }

      // Calcular progreso simple
      let totalLessons = 0;
      course.modules.forEach(module => {
        totalLessons += module.lessons.length;
      });

      const progressPercentage = 0; // Temporal sin cálculo de progreso específico

      return NextResponse.json({
        ...course,
        progress: progressPercentage,
        isEnrolled: true,
        hasAccess: true,
        subscriptionStatus: 'ACTIVE'
      });
    } else {
      // Para página pública: datos básicos
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          modules: {
            include: {
              lessons: {
                orderBy: { sortOrder: 'asc' }
              }
            },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      if (!course) {
        return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        ...course,
        hasAccess: true,
        subscriptionStatus: 'ACTIVE'
      });
    }
  } catch (error) {
    console.error('Error in GET /api/courses/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
