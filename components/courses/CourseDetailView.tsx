"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Play, Clock, Users, CheckCircle, Lock, BookOpen, Award, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// ✅ INTERFACES CORREGIDAS - Solo campos que EXISTEN en Prisma
interface Lesson {
  id: string;
  title: string;
  content: string | null;
  sortOrder: number;
  videoUrl: string | null;
  videoDuration: number | null;
  isFree: boolean;
  isActive: boolean;
  moduleId: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  courseId: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isFree: boolean;
  sortOrder: number;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
  enrollments: Enrollment[];
  // Campos calculados por API
  totalLessons: number;
  isEnrolled: boolean;
  progressPercentage: number;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: string | null;
  watchTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseDetailViewProps {
  courseId: string;
}

export default function CourseDetailView({ courseId }: CourseDetailViewProps) {
  const { user } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) {
      fetchLessonProgress();
    }
  }, [courseId, user]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Curso no encontrado');
          return;
        }
        if (response.status === 401) {
          setError('Por favor inicia sesión para ver este curso');
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Error al cargar el curso. Intenta recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonProgress = async () => {
    try {
      const response = await fetch(`/api/lessons/progress?courseId=${courseId}`);
      if (response.ok) {
        const progress = await response.json();
        setLessonProgress(progress);
      }
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    try {
      setEnrolling(true);
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (response.ok) {
        // Refrescar datos del curso
        await fetchCourse();
        await fetchLessonProgress();
      } else {
        const error = await response.json();
        alert(error.message || 'Error al inscribirse en el curso');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Error al inscribirse en el curso');
    } finally {
      setEnrolling(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId }),
      });

      if (response.ok) {
        // Actualizar progreso local
        setLessonProgress(prev => [
          ...prev.filter(p => p.lessonId !== lessonId),
          {
            id: `temp-${Date.now()}`,
            userId: user?.id || '',
            lessonId,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            watchTimeSeconds: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress.find(p => p.lessonId === lessonId);
  };

  const isLessonCompleted = (lessonId: string) => {
    return getLessonProgress(lessonId)?.isCompleted || false;
  };

  const canAccessLesson = (lesson: Lesson) => {
    return lesson.isFree || course?.isEnrolled || false;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <div className="text-red-700 mb-4">{error || 'Curso no encontrado'}</div>
          <button
            onClick={fetchCourse}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const completedLessons = course.modules.flatMap(m => m.lessons).filter(lesson => 
    isLessonCompleted(lesson.id)
  ).length;
  
  const totalLessons = course.modules.flatMap(m => m.lessons).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header del curso */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Imagen de portada */}
        <div className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-24 w-24 text-white opacity-50" />
            </div>
          )}
          
          {/* Overlay con estado */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center mb-2">
                {course.isEnrolled ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Inscrito
                  </span>
                ) : course.isFree ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Gratis
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información del curso */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          
          <p className="text-gray-600 text-lg mb-6">
            {course.description || 'Sin descripción disponible'}
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-sm text-gray-600">Lecciones</div>
              <div className="text-xl font-bold text-gray-900">{totalLessons}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-sm text-gray-600">Duración</div>
              <div className="text-xl font-bold text-gray-900">
                {course.duration ? `${course.duration} min` : 'N/A'}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-sm text-gray-600">Módulos</div>
              <div className="text-xl font-bold text-gray-900">{course.modules.length}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-sm text-gray-600">Progreso</div>
              <div className="text-xl font-bold text-gray-900">{progressPercentage}%</div>
            </div>
          </div>

          {/* Progreso visual */}
          {course.isEnrolled && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Tu progreso: {completedLessons} de {totalLessons} lecciones</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Botón de acción principal */}
          {!course.isEnrolled && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {course.isFree ? 'Curso gratuito' : 'Requiere suscripción premium'}
                </p>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {enrolling ? 'Inscribiendo...' : 'Inscribirse Ahora'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contenido del curso - Módulos */}
      <div className="space-y-6">
        {course.modules
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((module, moduleIndex) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Módulo {moduleIndex + 1}: {module.title}
              </h2>
              {module.description && (
                <p className="text-gray-600">{module.description}</p>
              )}
            </div>

            <div className="divide-y divide-gray-200">
              {module.lessons
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((lesson, lessonIndex) => {
                const canAccess = canAccessLesson(lesson);
                const isCompleted = isLessonCompleted(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      !canAccess ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0 mr-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : canAccess ? (
                          <Play className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900 mr-2">
                            {lessonIndex + 1}. {lesson.title}
                          </h3>
                          {lesson.isFree && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Gratis
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          {lesson.videoDuration && (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="mr-3">{lesson.videoDuration} min</span>
                            </>
                          )}
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Módulo {moduleIndex + 1}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {canAccess ? (
                        <button
                          onClick={() => !isCompleted && markLessonComplete(lesson.id)}
                          className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium"
                        >
                          {isCompleted ? 'Completado' : 'Ver Lección'}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">Bloqueado</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {course.modules.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Contenido en desarrollo
          </h3>
          <p className="text-gray-600">
            Este curso está siendo preparado. El contenido estará disponible pronto.
          </p>
        </div>
      )}
    </div>
  );
}
