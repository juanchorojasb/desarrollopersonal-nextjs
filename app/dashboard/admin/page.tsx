import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getBasicStats() {
  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    
    return {
      totalUsers,
      totalCourses,
      totalEnrollments
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalUsers: 0,
      totalCourses: 0,
      totalEnrollments: 0
    };
  }
}

export default async function SimpleAdminPage() {
  const user = await currentUser();
  
  // Solo verificar si el usuario está logueado y es admin
  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  const stats = await getBasicStats();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración Simple</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Usuarios</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Cursos</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Inscripciones</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalEnrollments}</p>
        </div>
      </div>
    </div>
  );
}
