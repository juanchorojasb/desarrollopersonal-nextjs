'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Send, ArrowLeft, Eye, Edit } from 'lucide-react';

interface NewPostFormProps {
  categoryId: string;
  categorySlug: string;
  categoryName: string;
}

export default function NewPostForm({ categoryId, categorySlug, categoryName }: NewPostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  
  const { user } = useCurrentUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Por favor, ingresa un título');
      return;
    }

    if (!content.trim()) {
      setError('Por favor, escribe el contenido del post');
      return;
    }

    if (!user) {
      setError('Debes iniciar sesión para crear un post');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el post');
      }

      const data = await response.json();
      
      // Redirect to the new post
      router.push(`/dashboard/comunidad/${data.post.categorySlug}/post/${data.post.slug}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Edit className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Inicia sesión para crear un post
        </h3>
        <p className="text-gray-600 mb-6">
          Necesitas una cuenta para participar en la comunidad
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href={`/dashboard/comunidad/${categorySlug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a {categoryName}
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        {user?.image ? (
          <img
            src={user?.image}
            alt={user.name || 'Usuario'}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-medium">
              {user?.name?.split(' ')[0]?.[0]}{user?.name?.split(' ')[1]?.[0]}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">
            {user?.name?.split(' ')[0]} {user?.name?.split(' ')[1]}
          </div>
          <div className="text-sm text-gray-600">
            Creando en {categoryName}
          </div>
        </div>
      </div>

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del tema
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿De qué quieres hablar?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
          maxLength={200}
        />
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-gray-500">
            {title.length}/200 caracteres
          </div>
          {title.length > 200 && (
            <div className="text-xs text-red-500">
              Excede el límite de caracteres
            </div>
          )}
        </div>
      </div>

      {/* Content Field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenido del mensaje
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {isPreview ? <Edit className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {isPreview ? 'Editar' : 'Vista previa'}
            </button>
          </div>
        </div>
        
        {isPreview ? (
          <div className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap break-words">
                {content || 'No hay contenido para mostrar...'}
              </div>
            </div>
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comparte tus pensamientos, experiencias o preguntas..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            disabled={isSubmitting}
            maxLength={5000}
          />
        )}
        
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-gray-500">
            {content.length}/5000 caracteres
          </div>
          {content.length > 5000 && (
            <div className="text-xs text-red-500">
              Excede el límite de caracteres
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-xs text-gray-500">
          Tu post será visible para todos los miembros de la comunidad
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/comunidad/${categorySlug}`}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim() || title.length > 200 || content.length > 5000}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publicar Tema
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}