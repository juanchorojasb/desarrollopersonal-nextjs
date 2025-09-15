export const dynamic = "force-dynamic";
import { requireAdminAccess } from '@/lib/admin-access';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        plan: true,
        createdAt: true,
        clerkUserId: true
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsuariosPage() {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para ver los usuarios.</p>
        </div>
      </div>
    );
  }

  const users = await getUsers();

  const planNames = {
    free: 'Gratuito',
    basico: 'Básico',
    completo: 'Completo',
    personal: 'Personal'
  };

  const planColors = {
    free: 'bg-gray-100 text-gray-800',
    basico: 'bg-blue-100 text-blue-800',
    completo: 'bg-green-100 text-green-800',
    personal: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios de la plataforma</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Usuarios Registrados ({users.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.firstName || 'Sin'} {user.lastName || 'Nombre'}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      planColors[user.plan as keyof typeof planColors] || planColors.free
                    }`}>
                      {planNames[user.plan as keyof typeof planNames] || user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No hay usuarios registrados aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
