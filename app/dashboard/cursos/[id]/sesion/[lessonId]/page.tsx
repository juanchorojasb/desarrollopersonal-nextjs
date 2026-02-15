"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Trophy,
  Star,
  X,
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
  const [completing, setCompleting] = useState(false);
  
  // Gamificación
  const [showAchievements, setShowAchievements] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showCourseComplete, setShowCourseComplete] = useState(false);

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

  const handleComplete = async () => {
    if (!lesson || completing) return;

    setCompleting(true);
    try {
      const response = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar la lección
        fetchLessonData();

        // Mostrar notificaciones de gamificación
        if (data.gamification) {
          // Logros desbloqueados
          if (data.gamification.newAchievements?.length > 0) {
            setShowAchievements(data.gamification.newAchievements);
          }

          // Subida de nivel
          if (data.gamification.newLevel) {
            setTimeout(() => setShowLevelUp(data.gamification.newLevel), 1000);
          }

          // Curso completado
          if (data.courseCompleted) {
            setTimeout(() => setShowCourseComplete(true), 2000);
          }
        }
      }
    } catch (err) {
      console.error('Error marking complete:', err);
    } finally {
      setCompleting(false);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetLesson = direction === 'prev'
      ? navigation?.previousLesson
      : navigation?.nextLesson;

    if (targetLesson) {
      router.push(`/dashboard/cursos/${lesson?.module.courseId}/sesion/${targetLesson.id}`);
    }
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
                  <span className="text-sm">Completada</span>
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
          <div className="lg:col-span-2 space-y-6">
            {/* Bunny Video Player */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              {lesson.videoUrl ? (
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  Video no disponible
                </div>
              )}
            </div>

            {/* Complete Button */}
            {!isCompleted && (
              <div className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">¿Terminaste esta lección?</p>
                  <p className="text-sm text-gray-600">Márcala como completada para ganar puntos</p>
                </div>
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {completing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Marcar Completada
                    </>
                  )}
                </button>
              </div>
            )}

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
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <button
                  onClick={() => handleNavigate('next')}
                  disabled={!navigation?.nextLesson}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Información
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificaciones de Logros */}
      {showAchievements.map((achievement, index) => (
        <AchievementToast
          key={achievement.id}
          achievement={achievement}
          onClose={() => {
            setShowAchievements(prev => prev.filter((_, i) => i !== index));
          }}
        />
      ))}

      {/* Notificación de Level Up */}
      {showLevelUp && (
        <LevelUpToast
          level={showLevelUp}
          onClose={() => setShowLevelUp(null)}
        />
      )}

      {/* Notificación de Curso Completado */}
      {showCourseComplete && (
        <CourseCompleteToast
          courseName={lesson.module.course.title}
          onClose={() => setShowCourseComplete(false)}
        />
      )}
    </div>
  );
}

// Componente de Toast de Logro
function AchievementToast({ achievement, onClose }: any) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`bg-gradient-to-br ${getTierColor(achievement.tier)} text-white rounded-xl shadow-2xl p-6 max-w-sm`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            <div className="font-bold text-lg">¡Logro Desbloqueado!</div>
          </div>
          <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1">{achievement.title}</h3>
            <p className="text-sm text-white/90 mb-2">{achievement.description}</p>
            <div className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
              +{achievement.points} puntos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Toast de Level Up
function LevelUpToast({ level, onClose }: any) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getLevelEmoji = (level: number) => {
    if (level >= 50) return '👑';
    if (level >= 25) return '⭐⭐⭐';
    if (level >= 10) return '⭐⭐';
    if (level >= 5) return '⭐';
    return '🌱';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-2xl p-6 max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6" />
            <div className="font-bold text-lg">¡Subiste de Nivel!</div>
          </div>
          <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-3">{getLevelEmoji(level)}</div>
          <div className="text-3xl font-bold mb-2">Nivel {level}</div>
        </div>
      </div>
    </div>
  );
}

// Componente de Toast de Curso Completado
function CourseCompleteToast({ courseName, onClose }: any) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-6 max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            <div className="font-bold text-lg">¡Curso Completado!</div>
          </div>
          <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-3">🎓</div>
          <h3 className="text-xl font-bold mb-2">{courseName}</h3>
          <p className="text-white/90 mb-3">¡Felicitaciones por completar el curso!</p>
          <div className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
            +100 puntos bonus
          </div>
        </div>
      </div>
    </div>
  );
}
