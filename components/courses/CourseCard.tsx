// components/courses/CourseCard.tsx
import React from 'react';
import { Course } from '@/types/courses';
import { Clock, Users, Award } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            course.level === 'beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level === 'beginner' ? 'Principiante' :
             course.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
          </span>
        </div>
        {course.certificateAvailable && (
          <div className="absolute top-3 right-3">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-indigo-600 font-medium">{course.category}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.totalDuration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.totalSessions} sesiones</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <span>Instructor: <strong>{course.instructor}</strong></span>
        </div>
        
        <Link 
          href={`/dashboard/courses/${course.id}`}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-center block"
        >
          Ver curso
        </Link>
      </div>
    </div>
  );
};
