import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, videoUrl, content, duration, position, moduleId } = body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        content: content || null,
        duration: duration || null,
        position: position || 1,
        moduleId
      }
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
