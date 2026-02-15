import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId, replyId, type } = body;

    if (!type || (!postId && !replyId)) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe la reacción
    const existingReaction = await prisma.forumReaction.findFirst({
      where: {
        userId: user.id,
        ...(postId ? { postId } : { replyId })
      }
    });

    if (existingReaction) {
      // Eliminar reacción (toggle)
      await prisma.forumReaction.delete({
        where: { id: existingReaction.id }
      });

      return NextResponse.json({ action: 'removed' });
    } else {
      // Crear reacción
      const reaction = await prisma.forumReaction.create({
        data: {
          type,
          userId: user.id,
          ...(postId ? { postId } : { replyId })
        }
      });

      return NextResponse.json({ action: 'added', reaction }, { status: 201 });
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
