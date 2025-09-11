import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, getUsersWithStats, logAdminAction } from '@/lib/admin';

export const GET = withAdminAuth(async function(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const subscriptionFilter = searchParams.get('plan') || undefined;
    
    const result = await getUsersWithStats(page, limit, search, subscriptionFilter);
    
    // Log the action
    await logAdminAction('view_users', 'user', undefined, { 
      filters: { search, subscriptionFilter }, 
      count: result.users.length 
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
});