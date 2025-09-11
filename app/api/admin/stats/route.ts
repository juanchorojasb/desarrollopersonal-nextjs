import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, getAdminStats, logAdminAction } from '@/lib/admin';

export const GET = withAdminAuth(async function(request: NextRequest) {
  try {
    const stats = await getAdminStats();
    
    // Log the action
    await logAdminAction('view_stats', 'stats');
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});