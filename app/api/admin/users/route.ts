import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, password, subscriptionStatus, isAdmin, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        hashedPassword,
        subscriptionStatus: subscriptionStatus || 'free',
        isAdmin: isAdmin || false,
        role: role || 'user',
      }
    });

    // Crear UserStats para el nuevo usuario
    await prisma.userStats.create({
      data: {
        userId: newUser.id,
        totalPoints: 0,
        level: 1,
      }
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
