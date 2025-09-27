// data/courses.ts - Datos completos de todos los cursos
import { Course } from '@/types/courses';

export const coursesData: Course[] = [
  {
    id: "habitos-estudio",
    title: "Hábitos de estudio",
    description: "Desarrolla técnicas efectivas de estudio y organización para maximizar tu aprendizaje y rendimiento académico.",
    thumbnail: "/images/courses/habitos-estudio.jpg",
    category: "Productividad",
    level: "beginner",
    totalSessions: 5,
    totalDuration: "2.5 horas",
    instructor: "Dra. Luz Marina",
    certificateAvailable: true,
    tags: ["estudio", "productividad", "hábitos", "concentración"],
    objectives: [
      "Crear rutinas de estudio efectivas y sostenibles",
      "Desarrollar técnicas avanzadas de concentración",
      "Organizar el tiempo de estudio de manera óptima",
      "Mejorar la retención y comprensión de información"
    ],
    requirements: [
      "Disposición para implementar nuevos hábitos",
      "Compromiso de práctica diaria"
    ],
    sessions: [
      {
        id: "session-1",
        order: 1,
        title: "Fundamentos de los hábitos de estudio",
        description: "Introducción a la ciencia detrás de los hábitos efectivos de estudio y cómo implementarlos.",
        videoUrl: "https://iframe.mediadelivery.net/play/476857/86e279ce-ee92-494d-aaad-47719c3b86fe",
        duration: "30 min",
        materials: [
          {
            id: "mat-1-1",
            title: "Guía de planificación semanal",
            type: "pdf",
            description: "Plantilla editable para organizar tu semana de estudio",
            downloadable: true
          }
        ],
        activities: [
          {
            id: "act-1-1",
            title: "Evaluación de hábitos actuales",
            type: "reflection",
            description: "Analiza y documenta tus hábitos de estudio actuales para identificar áreas de mejora",
            points: 10,
            instructions: [
              "Registra tus horarios de estudio actuales durante 3 días",
              "Identifica tus momentos de mayor y menor concentración",
              "Lista tus principales distractores y obstáculos"
            ]
          }
        ]
      },
      {
        id: "session-2",
        order: 2,
        title: "Técnicas de concentración y enfoque",
        videoUrl: "https://iframe.mediadelivery.net/play/476857/f88c9edf-3c7a-4186-80c1-88237f32c40b",
        duration: "25 min"
      },
      {
        id: "session-3",
        order: 3,
        title: "Optimización del espacio de estudio",
        videoUrl: "https://iframe.mediadelivery.net/play/476857/846aa33a-ae7d-4531-95e1-a5e4c575d289",
        duration: "20 min"
      },
      {
        id: "session-4",
        order: 4,
        title: "Gestión avanzada del tiempo de estudio",
        videoUrl: "https://iframe.mediadelivery.net/play/476857/3b8eb44e-39a6-480f-b87f-aa96334e4a8f",
        duration: "35 min"
      },
      {
        id: "session-5",
        order: 5,
        title: "Mantenimiento y evolución de hábitos",
        videoUrl: "https://iframe.mediadelivery.net/play/476857/014a0983-b268-4372-a94d-3699e86ee76c",
        duration: "30 min"
      }
    ]
  }
];

// Funciones de utilidad
export const getCourseById = (courseId: string): Course | undefined => {
  return coursesData.find(course => course.id === courseId);
};

export const getSessionById = (courseId: string, sessionId: string) => {
  const course = getCourseById(courseId);
  return course?.sessions.find(session => session.id === sessionId);
};

export const searchCourses = (query: string): Course[] => {
  const lowercaseQuery = query.toLowerCase();
  return coursesData.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
