'use client';

import { useState } from 'react';
import { 
  Users, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  Trophy,
  BookOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { UserWithStats } from '@/lib/admin';

interface UserTableProps {
  users: UserWithStats[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEditUser: (user: UserWithStats) => void;
  onDeleteUser?: (user: UserWithStats) => void;
  loading?: boolean;
}

export default function UserTable({ 
  users, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onEditUser,
  onDeleteUser,
  loading = false 
}: UserTableProps) {
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const getPlanBadgeColor = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      complete: 'bg-green-100 text-green-800',
      personal: 'bg-purple-100 text-purple-800'
    };
    return colors[plan] || colors.free;
  };

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      free: 'Gratuito',
      basic: 'Básico',
      complete: 'Completo',
      personal: 'Personal'
    };
    return names[plan] || plan;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = async (user: UserWithStats) => {
    if (!onDeleteUser) return;
    
    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar al usuario ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`
    );
    
    if (confirmed) {
      setDeletingUser(user.id);
      try {
        await onDeleteUser(user);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario. Inténtalo de nuevo.');
      } finally {
        setDeletingUser(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.imageUrl ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        ID: {user.id.slice(-8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(user.subscriptionStatus)}`}>
                    {getPlanName(user.subscriptionStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center" title="Nivel actual">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{user.currentLevel}</span>
                    </div>
                    <div className="flex items-center" title="XP total">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {user.totalXP} XP
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center" title="Cursos inscritos">
                      <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
                      <span>{user.enrollmentsCount} cursos</span>
                    </div>
                    <div className="flex items-center" title="Cursos completados">
                      <span className="text-xs text-green-600">
                        {user.completedCoursesCount} completados
                      </span>
                    </div>
                    <div className="flex items-center" title="Posts en foros">
                      <MessageSquare className="w-4 h-4 text-green-500 mr-1" />
                      <span>{user.forumPostsCount}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(user.createdAt)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Última actividad: {user.lastActivity ? formatDate(user.lastActivity) : 'Nunca'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-blue-600 hover:text-blue-700 flex items-center px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="Editar usuario"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    
                    {onDeleteUser && (
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={deletingUser === user.id}
                        className="text-red-600 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Eliminar usuario"
                      >
                        {deletingUser === user.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> a{' '}
                <span className="font-medium">{Math.min(currentPage * 20, users.length)}</span> de{' '}
                <span className="font-medium">{users.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}