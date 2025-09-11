import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createForumPost } from '@/lib/forum';
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
        { message: 'Necesitas un plan Complete o Personal para crear posts en la comunidad' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, categoryId } = body;

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { message: 'El título es requerido' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { message: 'El título no puede exceder 200 caracteres' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'El contenido es requerido' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { message: 'El contenido no puede exceder 5000 caracteres' },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        { message: 'La categoría es requerida' },
        { status: 400 }
      );
    }

    // Verify category exists and is active
    const category = await prisma.forumCategory.findUnique({
      where: { id: categoryId },
      select: { id: true, isActive: true }
    });

    if (!category || !category.isActive) {
      return NextResponse.json(
        { message: 'Categoría no encontrada o inactiva' },
        { status: 404 }
      );
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

    // Create the post
    const post = await createForumPost({
      title: title.trim(),
      content: content.trim(),
      categoryId,
      authorId: user.id
    });

    return NextResponse.json({
      message: 'Post creado exitosamente',
      post: {
        id: post.id,
        slug: post.slug,
        categorySlug: post.category.slug
      }
    });

  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}