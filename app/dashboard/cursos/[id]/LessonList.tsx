'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Lesson {
  id: number;
  title: string;
  videoId: string;
  duration: string;
}

interface LessonListProps {
  lessons: Lesson[];
  courseId: string;
}

export default function LessonList({ lessons, courseId }: LessonListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLessonParam = searchParams.get('lesson');
  const currentLessonId = currentLessonParam ? parseInt(currentLessonParam) : lessons[0]?.id;

  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const selectLesson = (lesson: Lesson) => {
    router.push(`/dashboard/cursos/${courseId}?lesson=${lesson.id}`, { scroll: false });
  };

  const toggleCompleted = (lessonId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const completionPercentage = (completedLessons.length / lessons.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contenido del Curso</h3>
        <div className="text-sm text-gray-600 mb-3">
          {lessons.length} lecciones • {completedLessons.length} completadas
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round(completionPercentage)}% completado
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === currentLessonId;
          const isCompleted = completedLessons.includes(lesson.id);
          
          return (
            <div
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                  </div>
                  <h4 className={`text-sm font-medium truncate ${
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {lesson.title}
                  </h4>
                </div>
                
                <button
                  onClick={(e) => toggleCompleted(lesson.id, e)}
                  className={`ml-2 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {isCompleted && <span className="text-xs">✓</span>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {completionPercentage === 100 && (
        <div className="p-4 bg-green-50 border-t">
          <div className="flex items-center space-x-2 text-green-800">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium">Curso completado</span>
          </div>
        </div>
      )}
    </div>
  );
}
