import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        enrollments: {
          include: {
            course: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export default async function UsuariosAdminPage() {
  const users = await getUsers();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Inscripciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.subscriptionStatus === 'free' ? 'bg-gray-100 text-gray-800' :
                    user.subscriptionStatus === 'basic' ? 'bg-blue-100 text-blue-800' :
                    user.subscriptionStatus === 'premium' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {user.subscriptionStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.enrollments.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
