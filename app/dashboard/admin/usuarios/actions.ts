'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateUserPlan(userId: string, newPlan: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: newPlan }
    });
    
    revalidatePath('/dashboard/admin/usuarios');
    return { success: true };
  } catch (error) {
    console.error('Error updating user plan:', error);
    return { success: false, error: 'Error updating user plan' };
  }
}
