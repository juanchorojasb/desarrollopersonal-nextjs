'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Star,
  Eye,
  Edit3,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Clock,
  Award,
  Activity
} from 'lucide-react';
import { CourseWithStats } from '@/lib/admin';

interface CourseStatsCardProps {
  course: CourseWithStats;
  onToggleStatus?: (courseId: string) => Promise<void>;
  onToggleFeatured?: (courseId: string) => Promise<void>;
  onView?: (courseId: string) => void;
  onEdit?: (courseId: string) => void;
  showActions?: boolean;
}

export default function CourseStatsCard({ 
  course, 
  onToggleStatus,
  onToggleFeatured,
  onView,
  onEdit,
  showActions = true
}: CourseStatsCardProps) {
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);

  const handleToggleStatus = async () => {
    if (!onToggleStatus) return;
    
    setIsTogglingStatus(true);
    try {
      await onToggleStatus(course.id);
    } catch (error) {
      console.error('Error toggling course status:', error);
      alert('Error al cambiar el estado del curso');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!onToggleFeatured) return;
    
    setIsTogglingFeatured(true);
    try {
      await onToggleFeatured(course.id);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Error al cambiar el estado destacado');
    } finally {
      setIsTogglingFeatured(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Borrador';
      case 'archived':
        return 'Archivado';
      default:
        return status;
    }
  };

  const getLevelColor = (level: string) => {
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
  };

  const getLevelText = (level: string) => {
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
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500">{course.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                {getStatusText(course.status)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                {getLevelText(course.level)}
              </span>
              {course.featured && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  <Award className="w-3 h-3 mr-1" />
                  Destacado
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{course.enrollmentsCount}</div>
            <div className="text-xs text-gray-500">Estudiantes</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{course.completionRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Completado</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{course.averageRating.toFixed(1)}</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${course.price}</div>
            <div className="text-xs text-gray-500">Precio</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>Duración: {course.duration ? `${course.duration} min` : 'No especificada'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Activity className="w-4 h-4 mr-2 text-gray-400" />
            <span>Creado: {formatDate(course.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              {onView && (
                <button
                  onClick={() => onView(course.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={() => onEdit(course.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              {onToggleStatus && (
                <button
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title={`Cambiar a ${course.status === 'published' ? 'borrador' : 'publicado'}`}
                >
                  {isTogglingStatus ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : course.status === 'published' ? (
                    <ToggleRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-gray-400" />
                  )}
                  {course.status === 'published' ? 'Publicado' : 'Borrador'}
                </button>
              )}
              
              {onToggleFeatured && (
                <button
                  onClick={handleToggleFeatured}
                  disabled={isTogglingFeatured}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 ${
                    course.featured 
                      ? 'border-blue-300 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  title={`${course.featured ? 'Quitar de' : 'Marcar como'} destacado`}
                >
                  {isTogglingFeatured ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  {course.featured ? 'Destacado' : 'Destacar'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}