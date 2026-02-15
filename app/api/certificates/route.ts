import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            title: true,
            imageUrl: true,
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
