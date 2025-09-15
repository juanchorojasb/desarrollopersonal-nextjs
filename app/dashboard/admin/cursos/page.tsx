export const dynamic = "force-dynamic";
import { requireAdminAccess } from '@/lib/admin-access';

// Datos simulados de cursos
const mockCourses = [
  {
    id: 'habitos-estudio',
    title: 'Hábitos de Estudio Efectivos',
    description: 'Desarrolla técnicas probadas para optimizar tu aprendizaje',
    lessons: 5,
    enrollments: 45,
    published: true
  },
  {
    id: 'gps-salud-mental',
    title: 'GPS Salud Mental',
    description: 'Navega hacia el bienestar emocional',
    lessons: 4,
    enrollments: 32,
    published: true
  },
  {
    id: 'arquitectura-descanso',
    title: 'Arquitectura del Descanso',
    description: 'Construye rutinas de sueño reparador',
    lessons: 5,
    enrollments: 28,
    published: true
  }
];

export default async function CursosPage() {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
        <p className="text-gray-600">Administra el contenido educativo de la plataforma</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Cursos Disponibles</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lecciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockCourses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.lessons}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{course.enrollments}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Publicado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
