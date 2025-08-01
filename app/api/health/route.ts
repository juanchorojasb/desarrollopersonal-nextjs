import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DesarrolloPersonal.uno',
      version: '1.0.0',
      database: 'connected',
      port: 3001
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'DesarrolloPersonal.uno',
      error: 'Database connection failed'
    }, { status: 500 })
  }
}
