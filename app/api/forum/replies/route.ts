import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createForumReply } from '@/lib/forum';
import { getUserPlan, hasAccess } from '@/lib/plans';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Check if user has access to community features
    const userClerkData = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    
    if (!userClerkData.ok) {
      return NextResponse.json(
        { message: 'Error verificando usuario' },
        { status: 500 }
      );
    }

    const userData = await userClerkData.json();
    const userPlan = getUserPlan(userData);
    
    if (!hasAccess(userPlan, 'complete')) {
      return NextResponse.json(
        { message: 'Necesitas un plan Complete o Personal para participar en la comunidad' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, postId, parentId } = body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'El contenido es requerido' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { message: 'El contenido no puede exceder 1000 caracteres' },
        { status: 400 }
      );
    }

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json(
        { message: 'ID del post es requerido' },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { id: true, isLocked: true, isDeleted: true }
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post no encontrado' },
        { status: 404 }
      );
    }

    if (post.isLocked) {
      return NextResponse.json(
        { message: 'Este post está cerrado para comentarios' },
        { status: 403 }
      );
    }

    if (post.isDeleted) {
      return NextResponse.json(
        { message: 'Este post ha sido eliminado' },
        { status: 404 }
      );
    }

    // Verify parent reply exists if provided
    if (parentId) {
      const parentReply = await prisma.forumReply.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true, isDeleted: true }
      });

      if (!parentReply) {
        return NextResponse.json(
          { message: 'Respuesta padre no encontrada' },
          { status: 404 }
        );
      }

      if (parentReply.postId !== postId) {
        return NextResponse.json(
          { message: 'La respuesta padre no pertenece a este post' },
          { status: 400 }
        );
      }

      if (parentReply.isDeleted) {
        return NextResponse.json(
          { message: 'No puedes responder a una respuesta eliminada' },
          { status: 400 }
        );
      }
    }

    // Get or create user record
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      // Create user record from Clerk data
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: userData.email_addresses[0]?.email_address || '',
          firstName: userData.first_name,
          lastName: userData.last_name,
          imageUrl: userData.image_url
        }
      });
    }

    // Create the reply
    const reply = await createForumReply({
      content: content.trim(),
      postId,
      authorId: user.id,
      parentId: parentId || undefined
    });

    return NextResponse.json({
      message: 'Respuesta creada exitosamente',
      reply
    });

  } catch (error) {
    console.error('Error creating forum reply:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}