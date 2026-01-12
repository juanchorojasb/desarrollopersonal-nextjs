import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan, hasAccess } from '@/lib/plans';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get user from Clerk to check plan
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userPlan = getUserPlan(clerkUser);

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      // Si no existe por clerkId, buscar por email
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
      
      if (userEmail) {
        user = await prisma.user.findUnique({
          where: { email: userEmail }
        });
        
        if (user) {
          // Actualizar el clerkId del usuario existente
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              clerkId: userId,
              firstName: clerkUser.firstName || undefined,
              lastName: clerkUser.lastName || undefined,
              imageUrl: clerkUser.imageUrl || undefined,
            }
          });
        }
      }
      
      // Si aún no existe, crear nuevo usuario
      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || `user_${userId}@temp.com`,
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            imageUrl: clerkUser.imageUrl || undefined,
          }
        });
      }
    }

    const courses = await prisma.course.findMany({
      where: {
        status: 'published' // Only show published courses
      },
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
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular progreso para cada curso
    const coursesWithProgress = courses.map(course => {
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedLessons = course.modules.reduce((acc, module) =>
        acc + module.lessons.filter(lesson =>
          lesson.progress.length > 0 && lesson.progress[0].isCompleted
        ).length, 0
      );

      // Check if user has access based on plan
      const hasAccessToCourse = hasAccess(userPlan, 'basic'); // Basic plan or higher for course access
      const isEnrolled = course.enrollments.length > 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        duration: course.duration || 0,
        instructorName: course.instructor || 'Instructor',
        price: course.price,
        rating: 4.5, // Default rating
        studentsCount: course.studentsCount,
        totalLessons,
        completedLessons,
        isEnrolled,
        hasAccess: hasAccessToCourse,
        userPlan,
        progressPercentage
      };
    });

    return NextResponse.json(coursesWithProgress);

  } catch (error) {
    console.error('Error getting courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
