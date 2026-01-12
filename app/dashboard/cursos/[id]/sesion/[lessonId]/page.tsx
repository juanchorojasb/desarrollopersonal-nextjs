"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

interface LessonWithCourse {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  position: number;
  moduleId: string;
  module: {
    id: string;
    title: string;
    courseId: string;
    course: {
      id: string;
      title: string;
    };
  };
  progress: {
    id: string;
    isCompleted: boolean;
    watchTime: number;
    watchPercentage: number;
  }[];
}

interface NavigationInfo {
  previousLesson: { id: string; title: string; } | null;
  nextLesson: { id: string; title: string; } | null;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useCurrentUser();
  
  const [lesson, setLesson] = useState<LessonWithCourse | null>(null);
  const [navigation, setNavigation] = useState<NavigationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    if (!userLoading) {
      fetchLessonData();
    }
  }, [params.lessonId, userLoading]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/lessons/${params.lessonId}`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No tienes acceso a esta lección');
        }
        if (response.status === 404) {
          throw new Error('Lección no encontrada');
        }
        throw new Error('Error al cargar la lección');
      }

      const data = await response.json();
      setLesson(data.lesson);
      setNavigation(data.navigation);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = async (currentTime: number, duration: number) => {
    if (!lesson) return;

    const percentage = (currentTime / duration) * 100;
    setWatchTime(currentTime);

    // Update progress every 10 seconds
    if (Math.floor(currentTime) % 10 === 0) {
      try {
        await fetch('/api/lessons/progress', {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({
            lessonId: lesson.id,
            watchTime: currentTime,
            watchPercentage: percentage,
          }),
        });
      } catch (err) {
        console.error('Error updating progress:', err);
      }
    }
  };

  const handleComplete = async () => {
    if (!lesson) return;

    try {
      await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lessonId: lesson.id,
        }),
      });

      fetchLessonData();
    } catch (err) {
      console.error('Error marking complete:', err);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetLesson = direction === 'prev' 
      ? navigation?.previousLesson 
      : navigation?.nextLesson;

    if (targetLesson) {
      router.push(`/dashboard/cursos/${lesson?.module.courseId}/sesion/${targetLesson.id}`);
      router.push(`/dashboard/cursos/${lesson?.module.courseId}/sesion/${targetLesson.id}`);
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Lección no encontrada'}
          </h2>
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = lesson.progress?.[0]?.isCompleted || false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/dashboard/cursos/${lesson.module.courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al curso
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Completado</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
              {lesson.videoUrl ? (
                <video
                  className="w-full h-full"
                  controls
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    handleProgress(video.currentTime, video.duration);
                  }}
                  onEnded={handleComplete}
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                  Tu navegador no soporta video HTML5.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  Video no disponible
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {lesson.title}
              </h2>
              {lesson.description && (
                <p className="text-gray-600 mb-4">{lesson.description}</p>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={() => handleNavigate('prev')}
                  disabled={!navigation?.previousLesson}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {navigation?.previousLesson?.title || 'Anterior'}
                  </span>
                </button>

                {!isCompleted && (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Marcar como completado
                  </button>
                )}

                <button
                  onClick={() => handleNavigate('next')}
                  disabled={!navigation?.nextLesson}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">
                    {navigation?.nextLesson?.title || 'Siguiente'}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Información del curso
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Curso</p>
                  <p className="font-medium">{lesson.module.course.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">Módulo</p>
                  <p className="font-medium">{lesson.module.title}</p>
                </div>
                {lesson.duration && (
                  <div>
                    <p className="text-gray-500">Duración</p>
                    <p className="font-medium">
                      {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                    </p>
                  </div>
                )}
                {lesson.progress?.[0] && (
                  <div>
                    <p className="text-gray-500">Progreso</p>
                    <p className="font-medium">
                      {Math.round(lesson.progress[0].watchPercentage)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
}
