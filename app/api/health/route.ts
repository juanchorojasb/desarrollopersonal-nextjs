import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test basic database connectivity
    await prisma.$connect();
    
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: 'Database connection failed'
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
