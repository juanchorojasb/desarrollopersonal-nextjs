import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, BookOpen, Users, Clock, Edit, Trash2 } from 'lucide-react';

async function getCourses() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          lessons: true,
        }
      },
      enrollments: true,
      _count: {
        select: {
          modules: true,
          enrollments: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return courses;
}

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-2">{courses.length} cursos en la plataforma</p>
        </div>
        <Link href="/admin/courses/new">
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Curso
          </button>
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
          const totalDuration = course.modules.reduce(
            (acc, mod) => acc + mod.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
            0
          );

          return (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Course Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.isPublished 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {course.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{course._count.modules}</div>
                    <div className="text-xs text-gray-500">Módulos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{totalLessons}</div>
                    <div className="text-xs text-gray-500">Lecciones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{course._count.enrollments}</div>
                    <div className="text-xs text-gray-500">Inscritos</div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(totalDuration / 60)} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Plan: {course.requiredPlan}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/courses/${course.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                  </Link>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay cursos creados</p>
          <Link href="/admin/courses/new">
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Crear Primer Curso
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
