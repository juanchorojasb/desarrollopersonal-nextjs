import { NextResponse } from 'next/server';
import { auth } from '@/src/auth/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get all published courses
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Return courses with basic info
    const coursesData = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category,
      level: course.level,
      duration: course.duration || 0,
      instructor: course.instructor || 'Instructor',
      price: course.price,
      requiredPlan: course.requiredPlan,
      isPublished: course.isPublished
    }));

    return NextResponse.json(coursesData);
  } catch (error) {
    console.error('Error getting courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
