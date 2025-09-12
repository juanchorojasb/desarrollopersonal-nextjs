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

    const { courseId, plan } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID requerido' }, { status: 400 });
    }

    // Verificar plan del usuario (esto debería venir de Clerk metadata)
    const userPlan = plan || 'free';
    
    // Lógica de verificación de acceso según el plan
    const hasAccess = userPlan !== 'free';

    if (!hasAccess) {
      return NextResponse.json({ 
        error: 'Plan premium requerido',
        upgradeRequired: true 
      }, { status: 403 });
    }

    // Get or create user
    const user = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        email: '', // Get from Clerk if needed
        plan: userPlan
      }
    });

    // Here you would create enrollment record if you have that model
    // For now just return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Acceso concedido al curso',
      courseId,
      userPlan 
    });

  } catch (error) {
    console.error('Error in course enrollment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
