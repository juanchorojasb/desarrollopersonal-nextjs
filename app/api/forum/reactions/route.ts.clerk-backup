import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserPlan, hasAccess } from '@/lib/plans';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_REACTION_TYPES = ['like', 'love', 'laugh', 'helpful', 'insightful'];

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
        { message: 'Necesitas un plan Complete o Personal para reaccionar a posts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, postId, replyId } = body;

    // Validate input
    if (!type || !VALID_REACTION_TYPES.includes(type)) {
      return NextResponse.json(
        { message: 'Tipo de reacción inválido' },
        { status: 400 }
      );
    }

    if (!postId && !replyId) {
      return NextResponse.json(
        { message: 'Debes especificar un post o una respuesta' },
        { status: 400 }
      );
    }

    if (postId && replyId) {
      return NextResponse.json(
        { message: 'No puedes reaccionar a un post y una respuesta al mismo tiempo' },
        { status: 400 }
      );
    }

    // Get or create user record
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
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

    // Check if content exists and is not deleted
    if (postId) {
      const post = await prisma.forumPost.findUnique({
        where: { id: postId },
        select: { id: true, isDeleted: true }
      });

      if (!post || post.isDeleted) {
        return NextResponse.json(
          { message: 'Post no encontrado' },
          { status: 404 }
        );
      }
    }

    if (replyId) {
      const reply = await prisma.forumReply.findUnique({
        where: { id: replyId },
        select: { id: true, isDeleted: true }
      });

      if (!reply || reply.isDeleted) {
        return NextResponse.json(
          { message: 'Respuesta no encontrada' },
          { status: 404 }
        );
      }
    }

    // Check if user already reacted
    const existingReaction = await prisma.forumReaction.findFirst({
      where: {
        userId: user.id,
        ...(postId ? { postId } : {}),
        ...(replyId ? { replyId } : {})
      }
    });

    if (existingReaction) {
      // If same reaction type, remove it (toggle off)
      if (existingReaction.type === type) {
        await prisma.forumReaction.delete({
          where: { id: existingReaction.id }
        });

        // Update reaction count
        if (postId) {
          await prisma.forumPost.update({
            where: { id: postId },
            data: { reactionsCount: { decrement: 1 } }
          });
        } else if (replyId) {
          await prisma.forumReply.update({
            where: { id: replyId },
            data: { reactionsCount: { decrement: 1 } }
          });
        }

        return NextResponse.json({
          message: 'Reacción eliminada',
          action: 'removed',
          type
        });
      } else {
        // Different reaction type, update it
        await prisma.forumReaction.update({
          where: { id: existingReaction.id },
          data: { type }
        });

        return NextResponse.json({
          message: 'Reacción actualizada',
          action: 'updated',
          type,
          oldType: existingReaction.type
        });
      }
    } else {
      // Create new reaction
      await prisma.forumReaction.create({
        data: {
          type,
          userId: user.id,
          ...(postId ? { postId } : {}),
          ...(replyId ? { replyId } : {})
        }
      });

      // Update reaction count
      if (postId) {
        await prisma.forumPost.update({
          where: { id: postId },
          data: { reactionsCount: { increment: 1 } }
        });
      } else if (replyId) {
        await prisma.forumReply.update({
          where: { id: replyId },
          data: { reactionsCount: { increment: 1 } }
        });
      }

      return NextResponse.json({
        message: 'Reacción agregada',
        action: 'added',
        type
      });
    }

  } catch (error) {
    console.error('Error managing forum reaction:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Get reactions for a post or reply
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const replyId = searchParams.get('replyId');

    if (!postId && !replyId) {
      return NextResponse.json(
        { message: 'Debes especificar un post o una respuesta' },
        { status: 400 }
      );
    }

    const reactions = await prisma.forumReaction.findMany({
      where: {
        ...(postId ? { postId } : {}),
        ...(replyId ? { replyId } : {})
      },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    // Group reactions by type
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = {
          type: reaction.type,
          count: 0,
          users: []
        };
      }
      acc[reaction.type].count++;
      acc[reaction.type].users.push({
        firstName: reaction.user.firstName,
        lastName: reaction.user.lastName
      });
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      reactions: Object.values(groupedReactions),
      total: reactions.length
    });

  } catch (error) {
    console.error('Error fetching forum reactions:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}