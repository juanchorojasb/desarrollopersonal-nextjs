import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { postId, type } = await request.json();

    // Verificar que el usuario existe en nuestra base de datos
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si ya existe la reacción
    const existingReaction = await prisma.forumReaction.findUnique({
      where: {
        userId_postId_type: {
          userId: user.id,
          postId,
          type
        }
      }
    });

    if (existingReaction) {
      // Remover reacción existente
      await prisma.forumReaction.delete({
        where: { id: existingReaction.id }
      });
    } else {
      // Crear nueva reacción
      await prisma.forumReaction.create({
        data: {
          userId: user.id,
          postId,
          type
        }
      });
    }

    // Obtener el conteo actualizado
    const reactionCount = await prisma.forumReaction.count({
      where: { postId, type }
    });

    const userReacted = !existingReaction; // Si no existía, ahora sí; si existía, ahora no

    return NextResponse.json({
      type,
      count: reactionCount,
      userReacted
    });

  } catch (error) {
    console.error('Error processing reaction:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
