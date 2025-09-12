'use server';

import { requireAdminAccess } from '@/lib/admin-access';

export async function createPromoCode(formData: FormData) {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    throw new Error('No autorizado');
  }

  const code = formData.get('code') as string;
  const description = formData.get('description') as string;
  const discount = parseInt(formData.get('discount') as string);

  // Simulamos la creación del código promocional
  console.log('Código promocional creado:', { code, description, discount });

  return { success: true, message: 'Código promocional creado exitosamente' };
}
