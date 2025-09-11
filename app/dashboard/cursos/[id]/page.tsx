"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  CheckCircle,
  Lock,
  Download,
  MessageCircle,
  Share2,
  Heart,
  ArrowLeft,
  Target,
  Award,
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

import { Course } from '@/types/course';

interface CourseWithModules {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration?: number;
  instructor?: string;
  price: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  whatYouLearn: string[];
  requirements: string[];
  isEnrolled: boolean;
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
  modules: {
    id: string;
    title: string;
    description: string;
    position: number;
    courseId: string;
    lessons: {
      id: string;
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      position: number;
      moduleId: string;
      progress: {
        id: string;
        isCompleted: boolean;
        watchTime: number;
        watchPercentage: number;
      }[];
    }[];
  }[];
}


export default function CursoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseData();
  }, [params.id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const response = await fetch(`/api/courses/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No estás inscrito en este curso');
        }
        if (response.status === 404) {
          throw new Error('Curso no encontrado');
        }
        throw new Error('Error al cargar el curso');
      }

      const data = await response.json();
      setCourse(data);
      
      // Expandir el primer módulo por defecto
      if (data.modules && data.modules.length > 0) {
        setExpandedModules([data.modules[0].id]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
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

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "0min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level;
    }
  };

  const handleLessonClick = (lesson: any, moduleSlug: string) => {
    // Navigate to lesson page using the course ID as slug for now
    router.push(`/dashboard/cursos/${course?.id}/sesion/${lesson.id}`);
  };

  const startCourse = () => {
    if (course && course.modules && course.modules.length > 0) {
      // Find the first lesson in the first module
      const firstModule = course.modules[0];
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        const firstLesson = firstModule.lessons[0];
        router.push(`/dashboard/cursos/${course.id}/sesion/${firstLesson.id}`);
      }
    }
  };

  const getTotalLessons = () => {
    return course?.totalLessons || 0;
  };

  const getCompletedLessons = () => {
    return course?.completedLessons || 0;
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
            onClick={() => fetchCourseData()}
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

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Curso no encontrado</h2>
        <p className="text-gray-600 mb-4">El curso que buscas no existe o ha sido eliminado.</p>
        <button 
          onClick={() => router.push('/dashboard/cursos')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const isEnrolled = course.isEnrolled;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <button 
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Cursos
      </button>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white">
                {getLevelText(course.level)}
              </span>
              <span className="text-xs text-white/80">{course.category}</span>
              {isEnrolled && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500 text-white flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  INSCRITO
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {course.title}
            </h1>

            {/* Instructor */}
            {course.instructor && (
              <p className="text-lg text-white/90 mb-4">
                Por {course.instructor}
              </p>
            )}

            {/* Estadísticas */}
            <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                {course.rating} ({course.reviewsCount} reseñas)
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.studentsCount.toLocaleString()} estudiantes
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(course.duration)}
              </div>
              <div className="flex items-center">
                <PlayCircle className="w-4 h-4 mr-1" />
                {getTotalLessons()} lecciones
              </div>
            </div>

            {/* Progreso si está inscrito */}
            {isEnrolled && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Tu progreso</span>
                  <span>{Math.round(course.progressPercentage)}% completado</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${course.progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white/80 mt-2">
                  {getCompletedLessons()} de {getTotalLessons()} lecciones completadas
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center gap-4">
              {isEnrolled ? (
                <button 
                  onClick={startCourse}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Continuar Curso
                </button>
              ) : (
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Inscribirse por ${course.price}
                </button>
              )}
              
              <button className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Favorito
              </button>
              
              <button className="border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Compartir
              </button>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="w-full h-64 lg:h-80 bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayCircle className="w-16 h-16 mx-auto mb-2 text-white/60" />
                  <p className="text-sm">Vista previa del curso</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="bg-white/90 hover:bg-white text-gray-900 w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <Play className="w-8 h-8 ml-1" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/75 text-white text-sm px-3 py-1 rounded">
                Vista previa gratuita
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen', icon: BookOpen },
            { id: 'curriculum', label: 'Contenido', icon: PlayCircle },
            { id: 'reviews', label: 'Reseñas', icon: MessageCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'curriculum' | 'reviews')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Descripción */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre este curso</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>

              {/* Lo que aprenderás */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Lo que aprenderás
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requisitos */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Requisitos</h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Tu instructor</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{course.instructor}</h4>
                      <p className="text-gray-600">Psicóloga Clínica y Coach Certificada</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          4.9 calificación
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          5,000+ estudiantes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Contenido del curso</h2>
              
              <div className="space-y-4">
                {course.modules.map((courseModule) => (
                  <div key={courseModule.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(courseModule.id)}
                      className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{courseModule.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {courseModule.lessons.length} lecciones • {formatDuration(courseModule.lessons.reduce((acc, lesson) => acc + lesson.duration, 0))}
                        </p>
                      </div>
                      {expandedModules.includes(courseModule.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedModules.includes(courseModule.id) && (
                      <div className="border-t border-gray-200">
                        {courseModule.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            onClick={() => isEnrolled && handleLessonClick(lesson, courseModule.title)}
                            className={`px-6 py-3 border-b border-gray-100 last:border-b-0 flex items-center justify-between hover:bg-gray-50 ${isEnrolled ? 'cursor-pointer' : ''}`}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <PlayCircle className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                {lesson.description && (
                                  <p className="text-sm text-gray-600">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {lesson.progress.length > 0 && lesson.progress[0].isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                              {!isEnrolled && (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm text-gray-600">
                                {formatDuration(lesson.duration / 60)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Reseñas de estudiantes</h2>
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Las reseñas estarán disponibles próximamente</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Card de inscripción */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
            <div className="p-6">
              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="flex items-center text-green-600 mb-4">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Ya estás inscrito</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progreso del curso</span>
                      <span className="font-semibold">{Math.round(course.progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={startCourse}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Continuar Aprendiendo
                  </button>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    Descargar Recursos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                    <span className="text-gray-600 ml-2">USD</span>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Inscribirse Ahora
                  </button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Garantía de satisfacción de 30 días
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-3">Este curso incluye:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <PlayCircle className="w-4 h-4 mr-2 text-blue-600" />
                  {formatDuration(course.duration)} de video HD
                </li>
                <li className="flex items-center">
                  <Download className="w-4 h-4 mr-2 text-blue-600" />
                  Recursos descargables
                </li>
                <li className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-blue-600" />
                  Certificado de finalización
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Acceso de por vida
                </li>
              </ul>
            </div>
          </div>

          {/* Cursos relacionados */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Cursos relacionados</h4>
            <div className="space-y-4">
              {/* Placeholder para cursos relacionados */}
              <div className="text-sm text-gray-500 text-center py-4">
                Próximamente más cursos relacionados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
