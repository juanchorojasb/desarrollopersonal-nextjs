"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  position: number;
  videoUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  position: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: number;
  instructor?: string;
  modules: Module[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
        
        // Auto-seleccionar primera lección
        if (data.modules?.[0]?.lessons?.[0]) {
          setSelectedLesson(data.modules[0].lessons[0]);
          setExpandedModules([data.modules[0].id]);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Curso no encontrado</p>
          <button
            onClick={() => router.push('/dashboard/cursos')}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/dashboard/cursos')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a cursos
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.5</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalLessons} lecciones</span>
                </div>
                {course.category && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                    {course.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {selectedLesson?.videoUrl ? (
                <div className="relative min-h-[450px] sm:min-h-[500px] lg:min-h-0" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={selectedLesson.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Play className="w-20 h-20 text-white/80" />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedLesson?.title || 'Selecciona una lección'}
                </h2>
                {selectedLesson?.description && (
                  <p className="text-gray-600">{selectedLesson.description}</p>
                )}
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Acerca del curso</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
            )}
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-6">
              <div className="p-4 bg-indigo-600 text-white">
                <h3 className="font-semibold">Contenido del Curso</h3>
                <p className="text-sm text-indigo-100 mt-1">
                  {totalLessons} lecciones
                </p>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {course.modules.map((module) => (
                  <div key={module.id} className="border-b last:border-b-0">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{module.title}</p>
                          <p className="text-xs text-gray-500">
                            {module.lessons.length} lecciones
                          </p>
                        </div>
                      </div>
                    </button>

                    {expandedModules.includes(module.id) && (
                      <div className="bg-gray-50">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-100 transition-colors text-left ${
                              selectedLesson?.id === lesson.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                            }`}
                          >
                            {selectedLesson?.id === lesson.id ? (
                              <Play className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {lesson.title}
                              </p>
                              {lesson.duration && (
                                <p className="text-xs text-gray-500">
                                  {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')} min
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
