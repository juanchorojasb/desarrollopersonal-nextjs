import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId, courseId } = await request.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID requerido' }, { status: 400 });
    }

    // Por ahora manejamos datos simulados ya que no tenemos modelo Lesson
    // TODO: Implementar modelos Course, Lesson, LessonProgress cuando sea necesario
    
    console.log(`Lesson ${lessonId} completed by user ${userId}`);

    // Simular marcado como completado
    const completionData = {
      lessonId,
      courseId,
      userId,
      completedAt: new Date(),
      progress: 100
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Lección marcada como completada',
      completion: completionData
    });

  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
