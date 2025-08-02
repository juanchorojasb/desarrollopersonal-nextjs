// Types for Course system
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  instructorName: string;
  price: number;
  rating: number;
  studentsCount: number;
  totalLessons: number;
  isEnrolled: boolean;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  modules: CourseModule[];
  enrollments: Enrollment[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  moduleId: string;
  progress: LessonProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt: Date | null;
  course: Course;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  watchTime: number;
  watchPercentage: number;
  startedAt: Date;
  completedAt: Date | null;
  lastWatchedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseFilters {
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';  // INCLUYE 'all'
  search: string;
}

export interface CourseStats {
  totalCourses: number;
  completedCourses: number;
  enrolledCourses: number;
  totalWatchTime: number;
  averageProgress: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  instructorName: string;
  thumbnail?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  id: string;
}
