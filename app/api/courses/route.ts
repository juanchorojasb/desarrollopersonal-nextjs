import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get current user data from Clerk (simpler approach)
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    // Get or create user in our database
    const user = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
      },
      create: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
      }
    });

    // Get user's plan from Clerk metadata
    const metadata = clerkUser.publicMetadata as { plan?: string };
    const userPlan = metadata.plan || 'free';

    // Define available courses based on plan
    const allCourses = [
      {
        id: 'habitos-estudio',
        title: 'Hábitos de Estudio Efectivos',
        description: 'Desarrolla técnicas probadas para optimizar tu aprendizaje',
        requiredPlan: 'basico',
        lessons: 5
      },
      {
        id: 'gps-salud-mental',
        title: 'GPS Salud Mental',
        description: 'Navega hacia el bienestar emocional con herramientas prácticas',
        requiredPlan: 'basico',
        lessons: 4
      },
      {
        id: 'arquitectura-descanso',
        title: 'Arquitectura del Descanso',
        description: 'Construye rutinas de sueño reparador y productividad sostenible',
        requiredPlan: 'basico',
        lessons: 5
      },
      {
        id: 'gestionando-depresion',
        title: 'Gestionando la Depresión',
        description: 'Estrategias basadas en evidencia para superar la depresión',
        requiredPlan: 'basico',
        lessons: 3
      },
      {
        id: 'emociones-equilibrio',
        title: 'Emociones en Equilibrio',
        description: 'Desarrolla inteligencia emocional y autorregulación',
        requiredPlan: 'free', // Este es gratuito
        lessons: 9
      },
      {
        id: 'neurocalma',
        title: 'NeuroCalma',
        description: 'Técnicas neurocientíficas para reducir el estrés y la ansiedad',
        requiredPlan: 'basico',
        lessons: 9
      },
      {
        id: 'navegando-tormenta',
        title: 'Navegando la Tormenta Interior',
        description: 'Herramientas para gestionar crisis emocionales y encontrar estabilidad',
        requiredPlan: 'basico',
        lessons: 6
      }
    ];

    // Filter courses based on user's plan
    const planHierarchy = {
      'free': ['free'],
      'basico': ['free', 'basico'],
      'completo': ['free', 'basico', 'completo'],
      'personal': ['free', 'basico', 'completo', 'personal']
    };

    const allowedPlans = planHierarchy[userPlan as keyof typeof planHierarchy] || ['free'];
    
    const accessibleCourses = allCourses.map(course => ({
      ...course,
      hasAccess: allowedPlans.includes(course.requiredPlan),
      userPlan
    }));

    return NextResponse.json({ 
      courses: accessibleCourses,
      userPlan,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: userPlan
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
