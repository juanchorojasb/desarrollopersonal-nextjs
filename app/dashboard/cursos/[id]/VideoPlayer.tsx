'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Lesson {
  id: number;
  title: string;
  videoId: string;
  duration: string;
}

interface VideoPlayerProps {
  courseId: string;
  lessons: Lesson[];
  courseTitle: string;
}

export default function VideoPlayer({ courseId, lessons, courseTitle }: VideoPlayerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  // Obtener lección desde URL o usar la primera
  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam) {
      const lessonIndex = lessons.findIndex(l => l.id.toString() === lessonParam);
      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
  }, [searchParams, lessons]);

  const currentLesson = lessons[currentLessonIndex];
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === lessons.length - 1;

  const goToLesson = (index: number) => {
    setCurrentLessonIndex(index);
    const lesson = lessons[index];
    router.push(`/dashboard/cursos/${courseId}?lesson=${lesson.id}`, { scroll: false });
  };

  const nextLesson = () => {
    if (!isLastLesson) {
      goToLesson(currentLessonIndex + 1);
    }
  };

  const prevLesson = () => {
    if (!isFirstLesson) {
      goToLesson(currentLessonIndex - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/476857/${currentLesson.videoId}?autoplay=false&preload=true`}
          loading="lazy"
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>

      {/* Video Info */}
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Lección {currentLesson.id}: {currentLesson.title}
          </h2>
          <p className="text-sm text-gray-500">
            {courseTitle} • {currentLesson.duration}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del curso</span>
            <span>{currentLessonIndex + 1} de {lessons.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevLesson}
            disabled={isFirstLesson}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>←</span>
            <span>Anterior</span>
          </button>

          <span className="text-sm text-gray-500">
            {currentLessonIndex + 1} / {lessons.length}
          </span>

          <button
            onClick={nextLesson}
            disabled={isLastLesson}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Siguiente</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
