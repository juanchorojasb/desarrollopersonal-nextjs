import { NextResponse } from 'next/server';
import { requireComercialAccess } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireComercialAccess();

    const cursosPopulares = await prisma.course.findMany({
      where: {
        isPublished: true
      },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 10
    });

    return NextResponse.json(
      cursosPopulares.map(curso => ({
        id: curso.id,
        title: curso.title,
        category: curso.category,
        estudiantes: curso._count.enrollments,
        price: curso.price
      }))
    );

  } catch (error: any) {
    console.error('Error en cursos populares:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message?.includes('acceso') ? 403 : 500 }
    );
  }
}
