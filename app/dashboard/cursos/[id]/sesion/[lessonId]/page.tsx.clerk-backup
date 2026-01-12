"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle, 
  Clock,
  Users,
  Star
} from 'lucide-react';
import CourseVideoPlayer from '@/components/cursos/CourseVideoPlayer';
import { Course, Lesson } from '@/types/course';

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
    course: Course;
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
  const { getToken } = useAuth();
  
  const [lesson, setLesson] = useState<LessonWithCourse | null>(null);
  const [navigation, setNavigation] = useState<NavigationInfo>({ previousLesson: null, nextLesson: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessonData();
  }, [params.lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const response = await fetch(`/api/lessons/${params.lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
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
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = async (watchTime: number, percentage: number) => {
    try {
      const token = await getToken();
      await fetch('/api/lessons/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: params.lessonId,
          watchTime,
          percentage
        })
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const token = await getToken();
      await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: params.lessonId
        })
      });
      
      // Refresh lesson data to update completion status
      fetchLessonData();
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    }
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/dashboard/cursos/${params.id}/sesion/${lessonId}`);
  };

  const handleNext = () => {
    if (navigation.nextLesson) {
      navigateToLesson(navigation.nextLesson.id);
    }
  };

  const handlePrevious = () => {
    if (navigation.previousLesson) {
      navigateToLesson(navigation.previousLesson.id);
    }
  };

  const goBackToCourse = () => {
    router.push(`/dashboard/cursos/${lesson?.module.courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-x-4">
          <button 
            onClick={() => fetchLessonData()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
          <button 
            onClick={() => router.push('/dashboard/cursos')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lección no encontrada</h2>
        <button 
          onClick={() => router.push('/dashboard/cursos')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const isCompleted = lesson.progress.length > 0 && lesson.progress[0].isCompleted;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={goBackToCourse}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Curso
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.module.course.title} • {lesson.module.title}</p>
              </div>
            </div>
            
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Completada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <CourseVideoPlayer
              lesson={{
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration,
                isCompleted: isCompleted
              }}
              onProgress={handleProgress}
              onComplete={handleComplete}
              onNext={navigation.nextLesson ? handleNext : undefined}
              onPrevious={navigation.previousLesson ? handlePrevious : undefined}
              hasNext={!!navigation.nextLesson}
              hasPrevious={!!navigation.previousLesson}
              courseTitle={lesson.module.course.title}
            />
            
            {/* Lesson Description */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre esta lección</h2>
              <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Información del Curso</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {lesson.module.course.title}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {lesson.module.course.studentsCount} estudiantes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  {lesson.module.course.rating} ★
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')} min
                </div>
              </div>
              
              <button
                onClick={goBackToCourse}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Todo el Curso
              </button>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Navegación</h3>
              <div className="space-y-2">
                {navigation.previousLesson && (
                  <button
                    onClick={handlePrevious}
                    className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500">Anterior</div>
                      <div className="font-medium text-sm truncate">{navigation.previousLesson.title}</div>
                    </div>
                  </button>
                )}
                
                {navigation.nextLesson && (
                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-xs text-blue-600">Siguiente</div>
                      <div className="font-medium text-sm truncate">{navigation.nextLesson.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}