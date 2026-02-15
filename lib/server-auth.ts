import { auth } from '@/src/auth/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  return user;
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function getUserId() {
  const session = await auth();
  return session?.user?.id || null;
}

export async function getCurrentUserWithPlan() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return {
    ...user,
    plan: user.subscriptionStatus as 'free' | 'basic' | 'complete' | 'personal'
  };
}

// NUEVAS FUNCIONES PARA DASHBOARD COMERCIAL
export async function requireComercialAccess() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('No autenticado');
  }
  
  if (user.role !== 'comercial' && user.role !== 'admin') {
    throw new Error('Acceso denegado - Se requiere rol comercial o admin');
  }
  
  return user;
}

export async function hasComercialAccess() {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  return user.role === 'comercial' || user.role === 'admin';
}
