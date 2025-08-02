'use client'

import { useState } from 'react'
import { Clock, Play, Star, Users, BookOpen, CheckCircle } from 'lucide-react'

const cursosData = [
  {
    id: 1,
    title: 'Inteligencia Emocional Avanzada',
    description: 'Desarrolla habilidades para gestionar emociones y mejorar relaciones interpersonales a través de técnicas probadas.',
    instructor: 'Dra. María González',
    duration: '8 semanas',
    lessons: 24,
    students: 156,
    rating: 4.8,
    progress: 75,
    thumbnail: '🧠',
    level: 'Intermedio',
    status: 'active',
    nextLesson: 'Módulo 4: Gestión del Estrés',
    videoId: 'curso-ie-intro',
    category: 'Desarrollo Personal'
  },
  {
    id: 2,
    title: 'Liderazgo Personal y Profesional',
    description: 'Fortalece tu capacidad de liderazgo y comunicación efectiva para destacar en tu carrera profesional.',
    instructor: 'Coach Juan Carlos López',
    duration: '6 semanas',
    lessons: 18,
    students: 203,
    rating: 4.9,
    progress: 45,
    thumbnail: '👑',
    level: 'Avanzado',
    status: 'active',
    nextLesson: 'Módulo 2: Comunicación Asertiva',
    videoId: 'curso-liderazgo-intro',
    category: 'Liderazgo'
  },
  {
    id: 3,
    title: 'Mindfulness y Meditación',
    description: 'Aprende técnicas de mindfulness para reducir estrés y aumentar tu bienestar mental y físico.',
    instructor: 'Psic. Ana Rodríguez',
    duration: '4 semanas',
    lessons: 16,
    students: 89,
    rating: 4.7,
    progress: 90,
    thumbnail: '🧘‍♀️',
    level: 'Principiante',
    status: 'active',
    nextLesson: 'Módulo Final: Integración',
    videoId: 'curso-mindfulness-intro',
    category: 'Bienestar'
  },
  {
    id: 4,
    title: 'Productividad y Gestión del Tiempo',
    description: 'Optimiza tu tiempo y aumenta tu productividad personal y profesional con métodos científicamente probados.',
    instructor: 'Lic. Carlos Méndez',
    duration: '5 semanas',
    lessons: 20,
    students: 134,
    rating: 4.6,
    progress: 0,
    thumbnail: '⏰',
    level: 'Intermedio',
    status: 'not-started',
    nextLesson: 'Módulo 1: Fundamentos',
    videoId: 'curso-productividad-intro',
    category: 'Productividad'
  }
]

export function CursosGrid() {

const [filter, setFilter] = useState<string>('all')
  const filteredCursos = cursosData.filter(curso => {
    if (filter === 'all') return true
    if (filter === 'active') return curso.status === 'active'
    if (filter === 'completed') return curso.progress === 100
    if (filter === 'not-started') return curso.status === 'not-started'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all', label: 'Todos', count: cursosData.length },
          { key: 'active', label: 'Activos', count: cursosData.filter(c => c.status === 'active').length },
          { key: 'completed', label: 'Completados', count: cursosData.filter(c => c.progress === 100).length },
          { key: 'not-started', label: 'Disponibles', count: cursosData.filter(c => c.status === 'not-started').length }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCursos.map((curso) => (
          <div key={curso.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{curso.thumbnail}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{curso.title}</h3>
                    <p className="text-sm text-gray-600">{curso.instructor}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  curso.level === 'Principiante' 
                    ? 'bg-green-100 text-green-700'
                    : curso.level === 'Intermedio'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {curso.level}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{curso.description}</p>
              
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{curso.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{curso.lessons} lecciones</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{curso.students}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{curso.rating}</span>
                </div>
              </div>
              
              {/* Progress */}
              {curso.status === 'active' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium text-gray-900">{curso.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${curso.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Siguiente: {curso.nextLesson}</p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                {curso.status === 'active' ? (
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Continuar</span>
                  </button>
                ) : curso.progress === 100 ? (
                  <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Completado</span>
                  </button>
                ) : (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Comenzar Curso
                  </button>
                )}
                
                <button className="text-gray-500 hover:text-gray-700 text-sm">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
