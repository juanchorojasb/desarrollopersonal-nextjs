import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, postId } = body;

    if (!content || !postId) {
      return NextResponse.json(
        { message: 'Contenido y ID de post requeridos' },
        { status: 400 }
      );
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        postId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { message: 'Error al crear respuesta' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { message: 'ID de post requerido' },
        { status: 400 }
      );
    }

    const replies = await prisma.forumReply.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            reactions: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { message: 'Error al obtener respuestas' },
      { status: 500 }
    );
  }
}
