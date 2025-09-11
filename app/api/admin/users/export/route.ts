import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { requireAdmin, logAdminAction } from '@/lib/admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const adminUser = requireAdmin(user);
    
    // Get all users with their stats
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            enrollments: true,
            lessonProgress: true,
            forumPosts: true,
            forumReplies: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Create CSV content
    const headers = [
      'ID',
      'Email', 
      'Nombre',
      'Apellido',
      'Plan',
      'XP Total',
      'Nivel',
      'Racha (días)',
      'Cursos Inscritos',
      'Lecciones Completadas',
      'Posts en Foros',
      'Respuestas en Foros',
      'Fecha de Registro',
      'Última Actividad'
    ].join(',');
    
    const csvRows = users.map(userData => {
      return [
        userData.id,
        userData.email,
        userData.firstName || '',
        userData.lastName || '',
        userData.subscriptionStatus,
        userData.totalXP,
        userData.currentLevel,
        userData.streakDays,
        userData._count.enrollments,
        userData._count.lessonProgress,
        userData._count.forumPosts,
        userData._count.forumReplies,
        userData.createdAt.toISOString().split('T')[0],
        userData.lastActivity ? userData.lastActivity.toISOString().split('T')[0] : ''
      ].map(field => {
        // Escape commas and quotes in CSV
        if (typeof field === 'string' && (field.includes(',') || field.includes('"'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',');
    });
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Log the action
    await logAdminAction({
      adminId: adminUser.id,
      adminEmail: adminUser.emailAddresses[0]?.emailAddress || '',
      action: 'export_users',
      resource: 'user',
      metadata: { userCount: users.length },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    });
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error in GET /api/admin/users/export:', error);
    
    if (error instanceof Error && error.message.includes('Acceso denegado')) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
    
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}