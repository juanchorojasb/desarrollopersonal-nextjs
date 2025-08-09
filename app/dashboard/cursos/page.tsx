'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Users,
  Play,
  Search,
  ChevronRight,
  Clock,
  CheckCircle
} from 'lucide-react';

// ✅ INTERFAZ CORREGIDA - Solo campos que EXISTEN en Prisma
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

interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string | null;
  sortOrder: number;
  videoUrl: string | null;
  videoDuration: number | null;
  isFree: boolean;
  isActive: boolean;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export default function CursosPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Por favor inicia sesión para ver los cursos');
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error al cargar los cursos. Intenta recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        // Refrescar cursos después de inscribirse
        fetchCourses();
      } else {
        alert('Error al inscribirse en el curso');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error al inscribirse en el curso');
    }
  };

  // Filtrar cursos por búsqueda
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error</div>
            <div className="text-red-700 mb-4">{error}</div>
            <button
              onClick={fetchCourses}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Cursos
          </h1>
          <p className="text-gray-600">
            Explora y continúa tu aprendizaje con nuestros cursos disponibles
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inscritos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(course => course.isEnrolled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(course => !course.isEnrolled && course.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Imagen del curso */}
              <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                
                {/* Badge de estado */}
                <div className="absolute top-4 left-4">
                  {course.isEnrolled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Inscrito
                    </span>
                  ) : course.isFree ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Gratis
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description || 'Descripción no disponible'}
                </p>

                {/* Información del curso */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration ? `${course.duration} min` : 'Sin especificar'}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{course.totalLessons} lecciones</span>
                  </div>
                </div>

                {/* Progreso (solo si está inscrito) */}
                {course.isEnrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{course.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {course.modules.length} módulos
                  </div>

                  {course.isEnrolled ? (
                    <Link
                      href={`/dashboard/cursos/${course.id}`}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Ver Curso
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Inscribirse
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vacío */}
        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron cursos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Intenta cambiar los términos de búsqueda' : 'No hay cursos disponibles en este momento'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
