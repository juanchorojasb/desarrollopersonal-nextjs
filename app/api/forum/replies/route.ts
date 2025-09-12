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

    const { postId, content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 });
    }

    // Verificar que el usuario existe en nuestra base de datos
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el post existe
    const post = await prisma.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    // Crear la respuesta
    const reply = await prisma.forumReply.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        postId
      },
      include: {
        author: true
      }
    });

    return NextResponse.json({ success: true, reply });

  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
