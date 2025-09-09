import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import ProgressButton from './ProgressButton';

const prisma = new PrismaClient();

interface LessonPageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id: slug, lessonId } = await params;
  
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true
          }
        }
      }
    });

    return {
      title: lesson 
        ? `${lesson.title} - ${lesson.module.course.title} - DesarrolloPersonal.uno`
        : `Sesión - DesarrolloPersonal.uno`,
    };
  } catch (error) {
    return {
      title: 'Sesión - DesarrolloPersonal.uno',
    };
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id: courseSlug, lessonId } = await params;
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Requerido</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder a este contenido.</p>
        </div>
      </div>
    );
  }

  try {
    // Obtener información del usuario y suscripción
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            isActive: true
          },
          include: {
            plan: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        lessonProgress: {
          where: {
            lessonId: lessonId
          }
        }
      }
    });

    // Obtener lección con información completa
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
            lessons: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    });

    if (!lesson) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Sesión No Encontrada</h1>
            <p className="text-gray-600">La sesión que buscas no existe.</p>
          </div>
        </div>
      );
    }

    // Verificar acceso
    const hasActiveSubscription = user && user.subscriptions.length > 0;
    const canAccess = lesson.isFree || hasActiveSubscription;

    if (!canAccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-orange-600 mb-4">Suscripción Requerida</h1>
            <p className="text-gray-600 mb-6">
              Esta sesión requiere una suscripción activa para acceder al contenido completo.
            </p>
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Planes
            </button>
          </div>
        </div>
      );
    }

    // Obtener progreso actual
    const currentProgress = user?.lessonProgress[0];
    const allLessons = lesson.module.lessons;
    const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
    const nextLesson = allLessons[currentLessonIndex + 1];
    const previousLesson = allLessons[currentLessonIndex - 1];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header con navegación */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{lesson.title}</h1>
                <p className="text-gray-600">{lesson.module.course.title}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Sesión {currentLessonIndex + 1} de {allLessons.length}
                </span>
                <button
                  onClick={() => window.location.href = `/dashboard/cursos/${courseSlug}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Volver al curso
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reproductor principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Video */}
                <div className="aspect-video">
                  <iframe
                    src={lesson.videoUrl || ''}
                    className="w-full h-full"
                    allowFullScreen
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>

                {/* Información de la sesión */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-3">{lesson.title}</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-500">
                      Duración: {Math.floor((lesson.videoDuration || 0) / 60)} min
                    </span>
                    {lesson.isFree && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Gratis
                      </span>
                    )}
                  </div>
                  
                  {lesson.content && (
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-medium mb-3">Descripción de la Sesión</h3>
                      <p className="text-gray-700 leading-relaxed">{lesson.content}</p>
                    </div>
                  )}

                  {/* Botones de progreso */}
                  <div className="mt-6 flex gap-3">
                    <ProgressButton 
                      lessonId={lessonId}
                      isCompleted={currentProgress?.completed || false}
                    />
                    
                    {nextLesson && (
                      <button
                        onClick={() => window.location.href = `/dashboard/cursos/${courseSlug}/sesion/${nextLesson.id}`}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Siguiente Sesión →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar con lista de sesiones */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Contenido del Curso</h3>
                <div className="space-y-2">
                  {allLessons.map((lessonItem, index) => (
                    <div
                      key={lessonItem.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        lessonItem.id === lessonId
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        if (lessonItem.isFree || hasActiveSubscription) {
                          window.location.href = `/dashboard/cursos/${courseSlug}/sesion/${lessonItem.id}`;
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {index + 1}. {lessonItem.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.floor((lessonItem.videoDuration || 0) / 60)} min
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {lessonItem.isFree && (
                            <span className="text-xs text-green-600">🆓</span>
                          )}
                          {(!lessonItem.isFree && !hasActiveSubscription) && (
                            <span className="text-xs text-orange-600">🔒</span>
                          )}
                          {lessonItem.id === lessonId && (
                            <span className="text-xs text-blue-600">▶️</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progreso general */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-2">Progreso General</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0 de {allLessons.length} sesiones completadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading lesson:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">Ocurrió un error al cargar la sesión.</p>
          <p className="text-sm text-gray-500 mt-2">{String(error)}</p>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}