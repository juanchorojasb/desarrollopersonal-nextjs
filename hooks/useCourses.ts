import { useState, useEffect, useCallback } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Course, CourseFilters, Enrollment, LessonProgress } from '@/types/course';

interface UseCoursesOptions {
  initialFilters?: Partial<CourseFilters>;
  autoLoad?: boolean;
}

interface UseCoursesReturn {
  // Estado
  courses: Course[];
  filteredCourses: Course[];
  loading: boolean;
  error: string | null;
  
  // Filtros
  filters: CourseFilters;
  setFilters: (filters: Partial<CourseFilters>) => void;
  clearFilters: () => void;
  
  // Acciones
  refreshCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  getCourseById: (id: string) => Course | undefined;
  
  // Datos derivados
  enrolledCourses: Course[];
  completedCourses: Course[];
  getUserEnrollments: () => Enrollment[];
  
  // Estadísticas
  totalCourses: number;
  totalEnrolled: number;
  totalCompleted: number;
  averageProgress: number;
}

// Valores por defecto para filtros
const defaultFilters: CourseFilters = {
  category: 'all',
  level: 'all',
  search: ''
};

export function useCourses({ 
  initialFilters = {}, 
  autoLoad = true 
}: UseCoursesOptions = {}): UseCoursesReturn {
  const { user } = useCurrentUser();
  
  // Estado principal
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros con valores por defecto
  const [filters, setFiltersState] = useState<CourseFilters>({
    ...defaultFilters,
    ...initialFilters
  });

  // Cargar cursos desde la API
  const loadCourses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar cursos automáticamente
  useEffect(() => {
    if (autoLoad && user) {
      loadCourses();
    }
  }, [autoLoad, user, loadCourses]);

  // Función para actualizar filtros
  const setFilters = useCallback((newFilters: Partial<CourseFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // Obtener curso por ID
  const getCourseById = useCallback((id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  }, [courses]);

  // Inscribirse en un curso
  const enrollInCourse = useCallback(async (courseId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });
      
      if (response.ok) {
        // Recargar cursos para actualizar el estado de inscripción
        await loadCourses();
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al inscribirse en el curso');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
      console.error('Error enrolling in course:', err);
      return false;
    }
  }, [user, loadCourses]);

  // Cursos filtrados
  const filteredCourses = useCallback(() => {
    let filtered = [...courses];

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructorName.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por categoría
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Filtro por nivel
    if (filters.level && filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    return filtered;
  }, [courses, filters]);

  // Cursos inscriptos
  const enrolledCourses = useCallback(() => {
    return courses.filter(course => course.isEnrolled);
  }, [courses]);

  // Cursos completados
  const completedCourses = useCallback(() => {
    return courses.filter(course => 
      course.isEnrolled && course.progressPercentage === 100
    );
  }, [courses]);

  // Obtener inscripciones del usuario
  const getUserEnrollments = useCallback((): Enrollment[] => {
    return courses
      .filter(course => course.enrollments && course.enrollments.length > 0)
      .flatMap(course => course.enrollments)
      .filter(Boolean);
  }, [courses]);

  // Calcular progreso promedio
  const averageProgress = useCallback(() => {
    const enrolled = enrolledCourses();
    if (enrolled.length === 0) return 0;
    
    const totalProgress = enrolled.reduce((sum, course) => sum + course.progressPercentage, 0);
    return Math.round(totalProgress / enrolled.length);
  }, [enrolledCourses]);

  // Función de refresh
  const refreshCourses = useCallback(async () => {
    await loadCourses();
  }, [loadCourses]);

  // Valores calculados
  const coursesFiltered = filteredCourses();
  const coursesEnrolled = enrolledCourses();
  const coursesCompleted = completedCourses();
  const avgProgress = averageProgress();

  return {
    // Estado
    courses,
    filteredCourses: coursesFiltered,
    loading,
    error,
    
    // Filtros
    filters,
    setFilters,
    clearFilters,
    
    // Acciones
    refreshCourses,
    enrollInCourse,
    getCourseById,
    
    // Datos derivados
    enrolledCourses: coursesEnrolled,
    completedCourses: coursesCompleted,
    getUserEnrollments,
    
    // Estadísticas
    totalCourses: courses.length,
    totalEnrolled: coursesEnrolled.length,
    totalCompleted: coursesCompleted.length,
    averageProgress: avgProgress,
  };
}
