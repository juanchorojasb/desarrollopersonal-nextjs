import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
    .substring(0, 100);
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.forumPost.findUnique({
      where: { slug }
    });
    
    if (!existing) return slug;
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { title, content, categoryId } = await request.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json({ error: 'El título y contenido son requeridos' }, { status: 400 });
    }

    if (title.length > 200) {
      return NextResponse.json({ error: 'El título es demasiado largo' }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'El contenido es demasiado largo' }, { status: 400 });
    }

    // Verificar que el usuario existe en nuestra base de datos
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que la categoría existe
    const category = await prisma.forumCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    // Crear slug único
    const baseSlug = createSlug(title);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // Crear el post
    const post = await prisma.forumPost.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        content: content.trim(),
        authorId: user.id,
        categoryId
      },
      include: {
        author: true,
        category: true
      }
    });

    return NextResponse.json({ success: true, post });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
