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

export default async function AdminDashboard() {
  const stats = await getBasicStats();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <p className="text-3xl font-bold text-orange-600">{stats.totalEnrollments}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del Sistema</h2>
        <div className="text-gray-600">
          <p>Plataforma de desarrollo personal funcionando correctamente.</p>
          <p className="mt-2">
            Tienes {stats.totalUsers} usuario(s) registrado(s) con acceso a {stats.totalCourses} curso(s).
          </p>
        </div>
      </div>
    </div>
  );
}
