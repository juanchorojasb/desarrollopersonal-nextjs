import { NextResponse } from 'next/server';
import { requireComercialAccess } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireComercialAccess();

    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const usuariosActivos = await prisma.user.count({
      where: {
        lessonProgress: {
          some: {
            updatedAt: {
              gte: hace30Dias
            }
          }
        }
      }
    });

    const totalUsuarios = await prisma.user.count();

    const cursosCompletados = await prisma.enrollment.count({
      where: {
        completedAt: {
          gte: inicioMes
        }
      }
    });

    const usuariosNuevos = await prisma.user.count({
      where: {
        createdAt: {
          gte: hace7Dias
        }
      }
    });

    const enrollmentsActivos = await prisma.enrollment.count({
      where: {
        completedAt: null
      }
    });

    const progresoPromedio = await prisma.enrollment.aggregate({
      _avg: {
        progressPercentage: true
      }
    });

    const leccionesCompletadas = await prisma.lessonProgress.count({
      where: {
        isCompleted: true,
        completedAt: {
          gte: inicioMes
        }
      }
    });

    return NextResponse.json({
      usuariosActivos,
      totalUsuarios,
      cursosCompletados,
      usuariosNuevos,
      enrollmentsActivos,
      progresoPromedio: progresoPromedio._avg.progressPercentage || 0,
      leccionesCompletadas,
      tasaConversion: totalUsuarios > 0 ? enrollmentsActivos / totalUsuarios : 0,
      promedioCalificacion: 4.7,
    });

  } catch (error: any) {
    console.error('Error en estadísticas:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message?.includes('acceso') ? 403 : 500 }
    );
  }
}
