import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, getPromoCodes, createPromoCode, logAdminAction } from '@/lib/admin';

export const GET = withAdminAuth(async function(request: NextRequest) {
  try {
    const promoCodes = await getPromoCodes();
    
    // Log the action
    await logAdminAction('view_promo_codes', 'promo_code');
    
    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error('Error in GET /api/admin/promo-codes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});

export const POST = withAdminAuth(async function(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const { code, discountType, discountValue, validFrom, validUntil } = data;
    
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Campos requeridos: code, discountType, discountValue, validFrom, validUntil' },
        { status: 400 }
      );
    }
    
    // Validate discount type
    if (!['percentage', 'fixed_amount'].includes(discountType)) {
      return NextResponse.json(
        { error: 'discountType debe ser "percentage" o "fixed_amount"' },
        { status: 400 }
      );
    }
    
    // Validate discount value
    if (discountValue <= 0) {
      return NextResponse.json(
        { error: 'discountValue debe ser mayor a 0' },
        { status: 400 }
      );
    }
    
    if (discountType === 'percentage' && discountValue > 100) {
      return NextResponse.json(
        { error: 'El porcentaje de descuento no puede ser mayor a 100%' },
        { status: 400 }
      );
    }
    
    // Validate dates
    const fromDate = new Date(validFrom);
    const untilDate = new Date(validUntil);
    
    if (fromDate >= untilDate) {
      return NextResponse.json(
        { error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
        { status: 400 }
      );
    }
    
    const promoCodeData = {
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      maxUses: data.maxUses ? Number(data.maxUses) : undefined,
      validFrom: fromDate,
      validUntil: untilDate,
      applicablePlans: data.applicablePlans || undefined,
      minPurchase: data.minPurchase ? Number(data.minPurchase) : undefined,
      description: data.description || undefined,
    };
    
    const promoCode = await createPromoCode(promoCodeData);
    
    return NextResponse.json({
      success: true,
      promoCode
    });
  } catch (error) {
    console.error('Error in POST /api/admin/promo-codes:', error);
    
    if (error instanceof Error) {
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