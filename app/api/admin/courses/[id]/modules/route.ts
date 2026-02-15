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
    const { title, description, position, courseId } = body;

    const module = await prisma.module.create({
      data: {
        title,
        description: description || null,
        position: position || 1,
        courseId
      }
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
