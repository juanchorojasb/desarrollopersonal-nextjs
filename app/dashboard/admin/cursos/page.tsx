import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        modules: {
          include: {
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return courses;
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
}

export default async function CursosAdminPage() {
  const courses = await getCourses();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Cursos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
          
          return (
            <div key={course.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {true ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Módulos:</span>
                  <span>{course.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lecciones:</span>
                  <span>{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inscritos:</span>
                  <span>{course.enrollments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creado:</span>
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
