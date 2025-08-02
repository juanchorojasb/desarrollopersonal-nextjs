// lib/courses/utils.ts

import { Course, CourseModule, Lesson, LessonProgress, Enrollment } from '@/types/course';

/**
 * Calcula el progreso total de un curso basado en las lecciones completadas
 */
export function calculateCourseProgress(
  modules: CourseModule[],
  userProgress: LessonProgress[]
): number {
  const totalLessons = modules.reduce((total, courseModule) => total + courseModule.lessons.length, 0);
  
  if (totalLessons === 0) return 0;
  
  const completedLessons = userProgress.filter(progress => progress.isCompleted).length;
  
  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Obtiene el tiempo total de duración de un curso
 */
export function getTotalCourseDuration(course: Course): number {
  return course.modules.reduce((total, courseModule) => {
    return total + courseModule.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + lesson.duration;
    }, 0);
  }, 0);
}

/**
 * Formatea la duración en minutos a formato legible
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Obtiene el color del badge según el nivel del curso
 */
export function getLevelBadgeColor(level: string): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Convierte el nivel técnico a texto legible
 */
export function getLevelText(level: string): string {
  switch (level) {
    case 'beginner':
      return 'Principiante';
    case 'intermediate':
      return 'Intermedio';
    case 'advanced':
      return 'Avanzado';
    default:
      return level;
  }
}

/**
 * Obtiene el color del badge según la categoría
 */
export function getCategoryBadgeColor(category: string): string {
  switch (category) {
    case 'desarrollo-personal':
      return 'bg-blue-100 text-blue-800';
    case 'mindfulness':
      return 'bg-purple-100 text-purple-800';
    case 'liderazgo':
      return 'bg-indigo-100 text-indigo-800';
    case 'comunicacion':
      return 'bg-pink-100 text-pink-800';
    case 'bienestar':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Verifica si un usuario está inscrito en un curso
 */
export function isUserEnrolled(course: Course, userId: string): boolean {
  return course.enrollments.some(enrollment => enrollment.userId === userId);
}

/**
 * Obtiene la inscripción de un usuario en un curso específico
 */
export function getUserEnrollment(course: Course, userId: string): Enrollment | undefined {
  return course.enrollments.find(enrollment => enrollment.userId === userId);
}

/**
 * Calcula el progreso total de un curso específico para un usuario
 */
export function calculateUserCourseProgress(course: Course, userId: string): number {
  const totalLessons = course.modules.reduce((total, courseModule) => total + courseModule.lessons.length, 0);
  
  if (totalLessons === 0) return 0;
  
  const completedLessons = course.modules.reduce((completed, courseModule) => {
    return completed + courseModule.lessons.filter(lesson => {
      return lesson.progress.some(progress => 
        progress.userId === userId && progress.isCompleted
      );
    }).length;
  }, 0);
  
  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Obtiene la siguiente lección pendiente en un curso
 */
export function getNextLesson(course: Course, userId: string): Lesson | null {
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      const userProgress = lesson.progress.find(p => p.userId === userId);
      if (!userProgress || !userProgress.isCompleted) {
        return lesson;
      }
    }
  }
  return null;
}

/**
 * Obtiene estadísticas de progreso del usuario
 */
export function getUserProgressStats(
  courses: Course[],
  userId: string
): {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalWatchTime: number;
} {
  const enrolledCourses = courses.filter(course => isUserEnrolled(course, userId));
  
  const completedCourses = enrolledCourses.filter(course => 
    calculateUserCourseProgress(course, userId) === 100
  );
  
  const inProgressCourses = enrolledCourses.filter(course => {
    const progress = calculateUserCourseProgress(course, userId);
    return progress > 0 && progress < 100;
  });
  
  const totalWatchTime = enrolledCourses.reduce((total, course) => {
    return total + course.modules.reduce((courseTotal, courseModule) => {
      return courseTotal + courseModule.lessons.reduce((moduleTotal, lesson) => {
        const userProgress = lesson.progress.find(p => p.userId === userId);
        return moduleTotal + (userProgress?.watchTime || 0);
      }, 0);
    }, 0);
  }, 0);
  
  return {
    totalCourses: courses.length,
    enrolledCourses: enrolledCourses.length,
    completedCourses: completedCourses.length,
    inProgressCourses: inProgressCourses.length,
    totalWatchTime
  };
}

/**
 * Filtra cursos basado en criterios de búsqueda
 */
export function filterCourses(
  courses: Course[],
  filters: {
    search?: string;
    category?: string;
    level?: string;
    onlyEnrolled?: boolean;
    onlyCompleted?: boolean;
  },
  userId?: string
): Course[] {
  let filtered = [...courses];
  
  // Filtro por búsqueda
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructorName.toLowerCase().includes(searchTerm)
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
  
  // Filtro por inscripción
  if (filters.onlyEnrolled && userId) {
    filtered = filtered.filter(course => isUserEnrolled(course, userId));
  }
  
  // Filtro por completado
  if (filters.onlyCompleted && userId) {
    filtered = filtered.filter(course => 
      isUserEnrolled(course, userId) && 
      calculateUserCourseProgress(course, userId) === 100
    );
  }
  
  return filtered;
}

/**
 * Obtiene las lecciones más recientes vistas por el usuario
 */
export function getRecentLessons(
  modules: CourseModule[],
  userId: string,
  limit: number = 5
): (Lesson & { lastWatchedAt: Date; courseModuleTitle: string })[] {
  const recentLessons: (Lesson & { lastWatchedAt: Date; courseModuleTitle: string })[] = [];
  
  for (const courseModule of modules) {
    for (const lesson of courseModule.lessons) {
      const userProgress = lesson.progress.find(p => p.userId === userId);
      if (userProgress && userProgress.lastWatchedAt) {
        recentLessons.push({
          ...lesson,
          lastWatchedAt: userProgress.lastWatchedAt,
          courseModuleTitle: courseModule.title
        });
      }
    }
  }
  
  return recentLessons
    .sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime())
    .slice(0, limit);
}

/**
 * Calcula el tiempo estimado para completar un curso
 */
export function getEstimatedCompletionTime(
  modules: CourseModule[],
  userId: string
): number {
  let remainingTime = 0;
  
  for (const courseModule of modules) {
    for (const lesson of courseModule.lessons) {
      const userProgress = lesson.progress.find(p => p.userId === userId);
      if (!userProgress || !userProgress.isCompleted) {
        remainingTime += lesson.duration;
      }
    }
  }
  
  return remainingTime;
}

/**
 * Genera un slug URL-friendly desde un título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones con un solo guión
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
}

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formatea un precio a moneda
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Calcula el descuento aplicado
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
