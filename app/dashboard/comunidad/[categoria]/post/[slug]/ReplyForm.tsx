'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Send, MessageSquare } from 'lucide-react';

interface ReplyFormProps {
  postId: string;
  categorySlug: string;
  postSlug: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function ReplyForm({ 
  postId, 
  categorySlug, 
  postSlug, 
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Escribe tu respuesta..."
}: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useCurrentUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor, escribe una respuesta');
      return;
    }

    if (!user) {
      setError('Debes iniciar sesión para responder');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim(),
          postId,
          parentId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la respuesta');
      }

      setContent('');
      router.refresh(); // Refresh to show new reply
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar la respuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-4">Inicia sesión para participar en la discusión</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        {user?.image ? (
          <img
            src={user?.image}
            alt={user.name || 'Usuario'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-medium text-sm">
              {user?.name?.split(' ')[0]?.[0]}{user?.name?.split(' ')[1]?.[0]}
            </span>
          </div>
        )}
        <span className="text-sm text-gray-700 font-medium">
          {user?.name?.split(' ')[0]} {user?.name?.split(' ')[1]}
        </span>
      </div>

      {/* Textarea */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          disabled={isSubmitting}
        />
        
        {/* Character count */}
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">
            {content.length}/1000 caracteres
          </div>
          {content.length > 1000 && (
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

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Tip: Sé respetuoso y constructivo en tus comentarios
        </div>
        
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim() || content.length > 1000}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Responder
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}