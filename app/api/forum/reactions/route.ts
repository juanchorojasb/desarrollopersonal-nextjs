import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/server-auth';

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { type, postId, replyId } = body;

    const reaction = await prisma.forumReaction.create({
      data: {
        type,
        userId,
        postId,
        replyId
      }
    });

    return NextResponse.json(reaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reactionId = searchParams.get('id');

    if (!reactionId) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.forumReaction.delete({
      where: { id: reactionId, userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
