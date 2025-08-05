'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Play, Clock, Users, Star, CheckCircle, Lock, BookOpen, Award, Zap, Calendar, Crown } from 'lucide-react';
import Image from 'next/image';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  position: number;
  type: string;
  videoUrl: string | null;
  videoDuration: number | null;
  isPreview: boolean;
  isRequired: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isRequired: boolean;
  duration: number | null;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  shortDesc: string | null;
  thumbnail: string | null;
  trailerVideo: string | null;
  level: string;
  category: string;
  tags: string | null;
  price: number;
  currency: string;
  status: string;
  featured: boolean;
  duration: number | null;
  studentsCount: number;
  instructorId: string | null;
  instructor: string | null;
  modules: Module[];
}

interface CourseDetailViewProps {
  course: Course;
}

export default function CourseDetailView({ course }: CourseDetailViewProps) {
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const previewLessons = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.isPreview).length, 0);
  
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del Curso */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          {/* Imagen/Video */}
          <div className="md:w-1/2">
            {course.thumbnail ? (
              <div className="relative h-64 md:h-full">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.trailerVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all">
                      <Play className="w-8 h-8 text-blue-600" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Información */}
          <div className="md:w-1/2 p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                {getLevelText(course.level)}
              </span>
              {course.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Destacado
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Incluido en Suscripción
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>

            <p className="text-gray-600 mb-6">
              {course.shortDesc || course.description}
            </p>

            {/* Estadísticas */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} lecciones</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.studentsCount} estudiantes</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>4.8 (124 reseñas)</span>
              </div>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">Instructor:</p>
                <p className="font-medium text-gray-900">{course.instructor}</p>
              </div>
            )}

            {/* Valor de Suscripción */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Parte de tu Suscripción</span>
              </div>
              <p className="text-sm text-gray-600">
                Este curso + TODOS nuestros cursos disponibles por solo{' '}
                <span className="font-bold text-blue-600">$25,000/mes</span>
              </p>
              {previewLessons > 0 && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {previewLessons} lección{previewLessons > 1 ? 'es' : ''} gratuita{previewLessons > 1 ? 's' : ''} disponible{previewLessons > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* CTA Principal */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                Comenzar Suscripción - $25,000/mes
              </button>
              {previewLessons > 0 && (
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Ver Lección Gratuita Primero
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Contenido del Curso */}
        <div className="lg:w-2/3">
          {/* Descripción Completa */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acerca de este curso
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p>{course.description}</p>
            </div>

            {/* Valor de la Suscripción */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                🎯 Con tu suscripción también accedes a:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Curso "Transformando tus Emociones" (8 sesiones)</li>
                <li>• Curso "NeuroCalm: Mente en Equilibrio" (10 sesiones)</li>
                <li>• Curso "Superando la Depresión" (12 sesiones)</li>
                <li>• Curso "Emociones en Equilibrio" (6 sesiones)</li>
                <li>• TODOS los cursos futuros automáticamente</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2 font-medium">
                Valor individual: $150,000+ • Tu precio: Solo $25,000/mes
              </p>
            </div>
          </div>

          {/* Contenido del Curso */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contenido del curso
            </h2>

            {/* Lecciones */}
            {course.modules.map((module) => (
              <div key={module.id} className="space-y-4">
                {module.description && (
                  <p className="text-gray-600 mb-4">{module.description}</p>
                )}
                
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {lesson.isPreview ? (
                            <Play className="w-5 h-5 text-green-600" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {lesson.title}
                          </h3>
                          {lesson.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDuration(lesson.videoDuration ? Math.ceil(lesson.videoDuration / 60) : null)}</span>
                        {lesson.isPreview ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Gratis
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            Suscripción
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          {/* Planes de Suscripción */}
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Elige tu Plan de Transformación
            </h3>

            {/* Plan Básico */}
            <div className={`border-2 rounded-lg p-4 mb-4 cursor-pointer transition-all ${
              selectedPlan === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`} onClick={() => setSelectedPlan('basic')}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Plan Básico</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">$25,000</div>
                  <div className="text-sm text-gray-600">/mes</div>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Acceso a TODOS los cursos</li>
                <li>• 40+ horas de contenido</li>
                <li>• Nuevos cursos incluidos</li>
                <li>• Progreso personalizado</li>
              </ul>
              <div className="text-xs text-green-600 font-medium mt-2">
                Solo $833 pesos por día ☕
              </div>
            </div>

            {/* Plan Premium */}
            <div className={`border-2 rounded-lg p-4 mb-6 cursor-pointer transition-all ${
              selectedPlan === 'premium' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`} onClick={() => setSelectedPlan('premium')}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">Plan Premium</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    Popular
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">$80,000</div>
                  <div className="text-sm text-gray-600">/mes</div>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Todo lo del Plan Básico</li>
                <li>• 2 talleres en vivo por mes</li>
                <li>• Q&A directo con expertos</li>
                <li>• Comunidad exclusiva</li>
                <li>• Casos personalizados</li>
              </ul>
              <div className="text-xs text-purple-600 font-medium mt-2">
                Valor talleres: $450,000+ • Ahorras $370,000
              </div>
            </div>

            <button className={`w-full py-3 rounded-lg font-medium mb-4 transition-colors ${
              selectedPlan === 'basic' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}>
              {selectedPlan === 'basic' 
                ? 'Comenzar Plan Básico - $25,000/mes'
                : 'Comenzar Plan Premium - $80,000/mes'
              }
            </button>

            {previewLessons > 0 && (
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium mb-6 hover:bg-gray-50 transition-colors">
                Probar con Lección Gratuita Primero
              </button>
            )}

            {/* Lo que incluye */}
            <div className="space-y-3 text-sm">
              <h4 className="font-medium text-gray-900">Tu suscripción incluye:</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Acceso ilimitado a toda la biblioteca</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>40+ horas de contenido premium</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Nuevos cursos automáticamente</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cancela cuando quieras</span>
              </div>
              {selectedPlan === 'premium' && (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>2 talleres en vivo mensuales</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Comunidad exclusiva Premium</span>
                  </div>
                </>
              )}
            </div>

            {/* Garantía */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Garantía de 7 días</span>
              </div>
              <p className="text-xs text-green-700">
                Si no sientes valor en los primeros 7 días, cancela y recibe reembolso completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
