'use client';

import React, { useState, useMemo } from 'react';
import { coursesData, searchCourses } from '@/data/courses';
import { CourseCard } from '@/components/courses/CourseCard';
import { Search, Filter, Grid, List } from 'lucide-react';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = Array.from(new Set(coursesData.map(course => course.category)));
    return ['all', ...cats];
  }, []);

  // Filtrar cursos
  const filteredCourses = useMemo(() => {
    let courses = coursesData;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      courses = searchCourses(searchQuery);
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      courses = courses.filter(course => course.category === selectedCategory);
    }

    // Filtrar por nivel
    if (selectedLevel !== 'all') {
      courses = courses.filter(course => course.level === selectedLevel);
    }

    return courses;
  }, [searchQuery, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
          <p className="text-gray-600">
            Explora nuestros cursos de desarrollo personal y bienestar mental
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los niveles</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Mostrando {filteredCourses.length} de {coursesData.length} cursos
              </span>
            </div>
          </div>
        </div>

        {/* Grid de cursos */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron cursos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar tus filtros o búsqueda para encontrar cursos.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
