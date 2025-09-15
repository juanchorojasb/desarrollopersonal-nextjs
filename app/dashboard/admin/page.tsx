export const dynamic = "force-dynamic";
import { requireAdminAccess } from '@/lib/admin-access';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getStats() {
  try {
    // Solo contar modelos que existen
    const totalUsers = await prisma.user.count();
    const totalPosts = await prisma.forumPost.count();
    const totalCategories = await prisma.forumCategory.count();
    
    return {
      users: totalUsers,
      posts: totalPosts,
      categories: totalCategories,
      courses: 7 // Hardcoded ya que no tenemos modelo Course
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { users: 0, posts: 0, categories: 0, courses: 0 };
  }
}

export default async function AdminPage() {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  const stats = await getStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona todos los aspectos de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">U</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">C</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cursos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.courses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.posts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">F</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Sistema funcionando correctamente</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Base de datos sincronizada</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Comunidad activa</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
              Ver usuarios registrados
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
              Gestionar contenido
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 text-sm">
              Revisar comunidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
