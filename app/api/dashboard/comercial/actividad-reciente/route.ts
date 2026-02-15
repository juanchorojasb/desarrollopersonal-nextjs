import { NextResponse } from 'next/server';
import { requireComercialAccess } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireComercialAccess();

    const ultimasInscripciones = await prisma.enrollment.findMany({
      orderBy: {
        enrolledAt: 'desc'
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    });

    const ultimosCompletados = await prisma.enrollment.findMany({
      where: {
        completedAt: {
          not: null
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    });

    return NextResponse.json({
      inscripciones: ultimasInscripciones.map(e => ({
        tipo: 'inscripcion',
        usuario: e.user.name || e.user.email,
        curso: e.course.title,
        fecha: e.enrolledAt
      })),
      completados: ultimosCompletados.map(e => ({
        tipo: 'completado',
        usuario: e.user.name || e.user.email,
        curso: e.course.title,
        fecha: e.completedAt
      }))
    });

  } catch (error: any) {
    console.error('Error en actividad reciente:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message?.includes('acceso') ? 403 : 500 }
    );
  }
}
