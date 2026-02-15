import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import CourseEditForm from './CourseEditForm';
import ModulesList from './ModulesList';

async function getCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { position: 'asc' }
          }
        },
        orderBy: { position: 'asc' }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  return course;
}

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a cursos
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course._count.enrollments} estudiantes inscritos</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Información del Curso */}
        <div className="lg:col-span-2 space-y-6">
          <CourseEditForm course={course} />
          
          {/* Módulos y Lecciones */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Módulos y Lecciones</h2>
              <Link href={`/admin/courses/${course.id}/modules/new`}>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Módulo
                </button>
              </Link>
            </div>
            
            <ModulesList modules={course.modules} courseId={course.id} />
          </div>
        </div>

        {/* Sidebar - Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Módulos</p>
                <p className="text-2xl font-bold text-gray-900">{course.modules.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Lecciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duración Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(course.modules.reduce((acc, mod) => 
                    acc + mod.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0), 0
                  ) / 60)} min
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estado</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Publicado</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  course.isPublished 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {course.isPublished ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="text-sm font-medium text-gray-900">{course.requiredPlan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nivel</span>
                <span className="text-sm font-medium text-gray-900">{course.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
