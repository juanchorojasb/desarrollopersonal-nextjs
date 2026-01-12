import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, selectedPlan } = body;

    if (!code || !selectedPlan) {
      return NextResponse.json(
        { error: 'Código y plan son requeridos' },
        { status: 400 }
      );
    }

    // Validate promo code
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Código promocional inválido' },
        { status: 404 }
      );
    }

    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: 'Código promocional no está activo' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return NextResponse.json(
        { error: 'Código promocional expirado' },
        { status: 400 }
      );
    }

    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: 'Código promocional alcanzó el límite de usos' },
        { status: 400 }
      );
    }

    // Check if applicable to selected plan
    if (promoCode.applicablePlans) {
      const applicablePlans = JSON.parse(promoCode.applicablePlans);
      if (!applicablePlans.includes(selectedPlan)) {
        return NextResponse.json(
          { error: 'Código no aplicable al plan seleccionado' },
          { status: 400 }
        );
      }
    }

    // Calculate expiration date (1 month from now)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    // Update user subscription in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: selectedPlan,
        subscriptionExpiry: expirationDate
      }
    });

    // Increment promo code usage
    await prisma.promoCode.update({
      where: { id: promoCode.id },
      data: {
        usedCount: { increment: 1 }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Plan activado exitosamente',
      plan: selectedPlan,
      expiresAt: expirationDate.toISOString()
    });
  } catch (error) {
    console.error('Error applying promo code:', error);
    return NextResponse.json(
      { error: 'Error al aplicar código promocional' },
      { status: 500 }
    );
  }
}
