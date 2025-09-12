import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // Simular datos de progreso
    const progressData = {
      userId,
      courseId,
      totalLessons: 10,
      completedLessonsCount: 3,
      progressPercentage: 30,
      lastAccessedLesson: 'lesson-3',
      completedLessons: [
        { id: 'lesson-1', completedAt: new Date() },
        { id: 'lesson-2', completedAt: new Date() },
        { id: 'lesson-3', completedAt: new Date() }
      ]
    };

    return NextResponse.json({ progress: progressData });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId, progress } = await request.json();

    // Simular actualización de progreso
    console.log(`Progress updated for user ${userId}, lesson ${lessonId}: ${progress}%`);

    return NextResponse.json({ 
      success: true,
      lessonId,
      progress 
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
