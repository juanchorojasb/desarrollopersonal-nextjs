'use server'

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createPromoCode(data: {
  code: string;
  description: string;
  discountPercent: number;
  maxUses: number;
  expiresAt: Date | null;
}) {
  try {
    await prisma.promoCode.create({
      data: {
        code: data.code,
        discountType: 'percentage',
        discountValue: data.discountPercent,
        maxUses: data.maxUses,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: data.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año por defecto
      }
    });
    
    revalidatePath('/dashboard/admin/promociones');
    return { success: true };
  } catch (error) {
    console.error('Error creating promo code:', error);
    return { success: false, error: 'Error creating promo code' };
  }
}
