import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan, hasAccess } from '@/lib/plans';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // CORRECCIÓN CRÍTICA: auth() debe ser awaited en API routes
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const courseId = params.id; // Mantener como string
    
    if (!courseId || courseId.trim() === '') {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    // Get user from Clerk to check plan
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId);
    const userPlan = getUserPlan(clerkUser);

    // Get or create user in database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        imageUrl: clerkUser.imageUrl || undefined,
      }
    });

    // Obtener curso con módulos y lecciones
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId: user.id }
                }
              }
            }
          },
          orderBy: { position: 'asc' }
        },
        enrollments: {
          where: { userId: user.id }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    // Verificar acceso basado en plan
    const hasAccessToCourse = hasAccess(userPlan, 'basic'); // Basic plan or higher for course access
    const isEnrolled = course.enrollments.length > 0;
    
    if (!hasAccessToCourse) {
      return NextResponse.json({ 
        error: 'Tu plan actual no incluye acceso a cursos', 
        userPlan,
        requiredPlan: 'basic'
      }, { status: 403 });
    }

    // Calcular progreso del curso
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].isCompleted).length, 0
    );
    
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Preparar respuesta
    const courseWithProgress = {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      price: course.price,
      rating: 4.5, // Default rating
      reviewsCount: 12, // Default reviews count
      studentsCount: course.studentsCount,
      whatYouLearn: [
        "Desarrollar técnicas de estudio efectivas y científicamente probadas",
        "Crear rutinas de estudio que maximicen tu retención y comprensión",
        "Dominar métodos avanzados de memorización y asociación",
        "Gestionar tu tiempo de estudio de manera productiva",
        "Mantener la motivación y consistencia en tu aprendizaje"
      ],
      requirements: [
        "Dispositivo con acceso a internet",
        "Compromiso con la práctica de las técnicas enseñadas",
        "Dedicación de al menos 30 minutos diarios al estudio"
      ],
      progressPercentage,
      totalLessons,
      completedLessons,
      isEnrolled,
      hasAccess: hasAccessToCourse,
      userPlan,
      modules: course.modules
    };

    return NextResponse.json(courseWithProgress);

  } catch (error) {
    console.error('Error getting course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
