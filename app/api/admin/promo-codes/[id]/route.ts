import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, updatePromoCode, deletePromoCode } from '@/lib/admin';

export const PATCH = withAdminAuth(async function(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const promoCodeId = params.id;
    
    // Validate data if provided
    if (data.discountValue !== undefined && data.discountValue <= 0) {
      return NextResponse.json(
        { error: 'discountValue debe ser mayor a 0' },
        { status: 400 }
      );
    }
    
    if (data.discountType === 'percentage' && data.discountValue > 100) {
      return NextResponse.json(
        { error: 'El porcentaje de descuento no puede ser mayor a 100%' },
        { status: 400 }
      );
    }
    
    // Validate dates if provided
    if (data.validFrom && data.validUntil) {
      const fromDate = new Date(data.validFrom);
      const untilDate = new Date(data.validUntil);
      
      if (fromDate >= untilDate) {
        return NextResponse.json(
          { error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
          { status: 400 }
        );
      }
    }
    
    const updateData: any = {};
    
    if (data.code) updateData.code = data.code.toUpperCase();
    if (data.discountType) updateData.discountType = data.discountType;
    if (data.discountValue !== undefined) updateData.discountValue = Number(data.discountValue);
    if (data.maxUses !== undefined) updateData.maxUses = Number(data.maxUses);
    if (data.validFrom) updateData.validFrom = new Date(data.validFrom);
    if (data.validUntil) updateData.validUntil = new Date(data.validUntil);
    if (data.applicablePlans) updateData.applicablePlans = data.applicablePlans;
    if (data.minPurchase !== undefined) updateData.minPurchase = Number(data.minPurchase);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    
    const promoCode = await updatePromoCode(promoCodeId, updateData);
    
    return NextResponse.json({
      success: true,
      promoCode
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/promo-codes/[id]:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Promo code not found')) {
        return NextResponse.json({ error: 'Código promocional no encontrado' }, { status: 404 });
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Ya existe un código promocional con ese código' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});

export const DELETE = withAdminAuth(async function(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promoCodeId = params.id;
    
    await deletePromoCode(promoCodeId);
    
    return NextResponse.json({
      success: true,
      message: 'Código promocional eliminado correctamente'
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/promo-codes/[id]:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Promo code not found')) {
        return NextResponse.json({ error: 'Código promocional no encontrado' }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});