import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import DashboardCourseView from '@/components/dashboard/DashboardCourseView';

const prisma = new PrismaClient();

interface DashboardCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCourseWithEnrollment(courseId: string, userId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { sortOrder: 'asc' }
        },
        enrollments: {
          where: { userId }
        }
      }
    });

    if (!course) {
      return null;
    }

    // Calcular progreso
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const isEnrolled = course.enrollments.length > 0;

    // Obtener progreso de lecciones
    let completedLessons = 0;
    if (isEnrolled) {
      const lessonProgress = await prisma.lessonProgress.findMany({
        where: {
          userId,
          lesson: {
            module: {
              courseId
            }
          },
          isCompleted: true
        }
      });
      completedLessons = lessonProgress.length;
    }

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      ...course,
      totalLessons,
      isEnrolled,
      progressPercentage,
      completedLessons
    };

  } catch (error) {
    console.error('Error getting course:', error);
    return null;
  }
}

export async function generateMetadata({ params }: DashboardCoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return {
      title: 'Acceso Requerido - DesarrolloPersonal.uno'
    };
  }

  const course = await getCourseWithEnrollment(id, userId);
  
  if (!course) {
    return {
      title: 'Curso no encontrado - DesarrolloPersonal.uno'
    };
  }

  return {
    title: `${course.title} - Dashboard - DesarrolloPersonal.uno`,
    description: course.description || `Accede a todas las lecciones del curso ${course.title}`,
  };
}

export default async function DashboardCoursePage({ params }: DashboardCoursePageProps) {
  const { id } = await params;
  const { userId } = await auth();

  // Verificar autenticación
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Requerido
          </h1>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para acceder a tus cursos.
          </p>
          <a
            href="/sign-in"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  // Obtener curso con datos de inscripción
  const course = await getCourseWithEnrollment(id, userId);

  if (!course) {
    notFound();
  }

  // Verificar si el usuario está inscrito
  if (!course.isEnrolled && !course.isFree) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Suscripción Requerida
            </h1>
            <p className="text-gray-600 mb-6">
              Este curso requiere una suscripción activa para acceder al contenido completo.
            </p>
            <div className="space-y-4">
              <a
                href="/pricing"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
              >
                Ver Planes de Suscripción
              </a>
              <div>
                <a
                  href="/dashboard/cursos"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Volver a Mis Cursos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardCourseView course={course} userId={userId} />
    </div>
  );
}
