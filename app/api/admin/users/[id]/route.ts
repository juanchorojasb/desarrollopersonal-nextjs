import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, updateUserSubscription, logAdminAction } from '@/lib/admin';

export const PATCH = withAdminAuth(async function(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { subscriptionStatus, subscriptionExpiry } = await request.json();
    const userId = params.id;
    
    if (!subscriptionStatus) {
      return NextResponse.json({ error: 'subscriptionStatus es requerido' }, { status: 400 });
    }
    
    const validPlans = ['free', 'basic', 'complete', 'personal'];
    if (!validPlans.includes(subscriptionStatus)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }
    
    const expiryDate = subscriptionExpiry ? new Date(subscriptionExpiry) : undefined;
    
    await updateUserSubscription(userId, subscriptionStatus, expiryDate);
    
    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/users/[id]:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('User not found')) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});

export const GET = withAdminAuth(async function(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Import prisma here to avoid issues
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        lessonProgress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        },
        forumPosts: true,
        forumReplies: true,
        _count: {
          select: {
            enrollments: true,
            lessonProgress: true,
            forumPosts: true,
            forumReplies: true
          }
        }
      }
    });
    
    if (!userData) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    // Log the action
    await logAdminAction('view_user_details', 'user', userId);
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error in GET /api/admin/users/[id]:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});