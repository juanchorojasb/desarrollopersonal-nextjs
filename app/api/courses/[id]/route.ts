import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id: courseId } = await params;
    
    // Here you would typically fetch course data from your database
    // For now, returning a placeholder response
    const courseData = {
      id: courseId,
      title: `Curso ${courseId}`,
      description: 'Descripción del curso',
      videos: []
    };

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Await params in Next.js 15
    const { id: courseId } = await params;

    // Get or create user in database
    const user = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        email: '', // You might want to get this from Clerk
        plan: 'free'
      }
    });

    const body = await request.json();
    
    // Process the request (e.g., mark lesson as completed, etc.)
    console.log(`Processing action for course ${courseId} by user ${userId}`);
    
    return NextResponse.json({ success: true, courseId });
  } catch (error) {
    console.error('Error processing course action:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
