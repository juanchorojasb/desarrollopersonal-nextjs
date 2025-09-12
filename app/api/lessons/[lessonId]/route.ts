import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId } = await params;

    // Por ahora retornamos datos simulados ya que no tenemos modelo Lesson
    // TODO: Implementar modelo Lesson en Prisma cuando sea necesario
    const lessonData = {
      id: lessonId,
      title: `Lección ${lessonId}`,
      description: 'Descripción de la lección',
      videoUrl: '', // URL del video
      duration: 0,
      completed: false
    };

    return NextResponse.json({ lesson: lessonData });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { lessonId } = await params;
    const body = await request.json();

    // Simular marcar lección como completada
    console.log(`Lesson ${lessonId} marked as completed for user ${userId}`);

    return NextResponse.json({ 
      success: true, 
      lessonId,
      action: body.action || 'completed'
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
