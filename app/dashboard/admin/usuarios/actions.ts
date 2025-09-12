'use server';

import { requireAdminAccess } from '@/lib/admin-access';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateUserPlan(userId: string, newPlan: string) {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    throw new Error('No autorizado');
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: newPlan }
    });

    revalidatePath('/dashboard/admin/usuarios');
    
    return { success: true, message: 'Plan actualizado exitosamente' };
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw new Error('Error al actualizar el plan del usuario');
  }
}

export async function deleteUser(userId: string) {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    throw new Error('No autorizado');
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath('/dashboard/admin/usuarios');
    
    return { success: true, message: 'Usuario eliminado exitosamente' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error al eliminar el usuario');
  }
}
