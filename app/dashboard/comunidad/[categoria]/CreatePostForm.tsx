'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CreatePostFormProps {
  categoryId: string;
  userPlan?: string;
}

export default function CreatePostForm({ categoryId, userPlan = 'free' }: CreatePostFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Límites según el plan
  const limits = {
    free: { posts: 2, titleLength: 100, contentLength: 500 },
    basico: { posts: 10, titleLength: 150, contentLength: 1000 },
    completo: { posts: -1, titleLength: 200, contentLength: 2000 },
    personal: { posts: -1, titleLength: 200, contentLength: 2000 }
  };

  const currentLimits = limits[userPlan as keyof typeof limits] || limits.free;
  const isPremium = ['completo', 'personal'].includes(userPlan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim() || isSubmitting) return;

    // Verificar límites para usuarios free
    if (userPlan === 'free' && (title.length > currentLimits.titleLength || content.length > currentLimits.contentLength)) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          categoryId
        })
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        router.refresh(); // Refrescar la página actual para mostrar el nuevo post
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la publicación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Inicia sesión para crear una publicación</p>
        </div>
        <Link
          href="/sign-in"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Plan status indicator */}
      <div className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
        isPremium 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      }`}>
        {isPremium ? (
          <>
            <Crown className="w-4 h-4" />
            <span className="font-medium">Plan {userPlan}</span>
            <CheckCircle className="w-4 h-4" />
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            <span>Plan {userPlan} - Acceso limitado</span>
          </>
        )}
      </div>

      {/* Upgrade prompt modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Límite alcanzado
              </h3>
              <p className="text-gray-600 mt-2">
                Tu publicación excede los límites del plan gratuito. Actualiza a premium para contenido ilimitado.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/pricing"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block text-center"
              >
                Ver Planes Premium
              </Link>
              <button
                onClick={() => setShowUpgradePrompt(false)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continuar editando
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿De qué quieres hablar?"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              title.length > currentLimits.titleLength ? 'border-red-300' : 'border-gray-300'
            }`}
            required
            maxLength={isPremium ? 200 : currentLimits.titleLength}
          />
          <div className={`text-xs mt-1 flex justify-between ${
            title.length > currentLimits.titleLength ? 'text-red-500' : 'text-gray-500'
          }`}>
            <span>{title.length}/{currentLimits.titleLength} caracteres</span>
            {!isPremium && title.length > currentLimits.titleLength && (
              <span className="text-red-500 font-medium">Límite excedido</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comparte tu experiencia, pregunta o reflexión..."
            rows={isPremium ? 8 : 5}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
              content.length > currentLimits.contentLength ? 'border-red-300' : 'border-gray-300'
            }`}
            required
            maxLength={isPremium ? 2000 : currentLimits.contentLength}
          />
          <div className={`text-xs mt-1 flex justify-between ${
            content.length > currentLimits.contentLength ? 'text-red-500' : 'text-gray-500'
          }`}>
            <span>{content.length}/{currentLimits.contentLength} caracteres</span>
            {!isPremium && content.length > currentLimits.contentLength && (
              <span className="text-red-500 font-medium">Límite excedido</span>
            )}
          </div>
        </div>

        {/* Free user limitations notice */}
        {!isPremium && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Crown className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-1">
                  Usuarios Premium obtienen:
                </p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Publicaciones con hasta 2,000 caracteres</li>
                  <li>• Sin límites de posts por día</li>
                  <li>• Acceso a categorías exclusivas</li>
                  <li>• Respuestas prioritarias</li>
                </ul>
                <Link
                  href="/pricing"
                  className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Conocer planes premium →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={
              isSubmitting || 
              !title.trim() || 
              !content.trim() ||
              (!isPremium && (title.length > currentLimits.titleLength || content.length > currentLimits.contentLength))
            }
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Publicando...' : 'Crear Publicación'}
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setContent('');
            }}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
