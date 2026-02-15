'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  postId: string;
  categorySlug: string;
}

export default function ReplyForm({ postId, categorySlug }: Props) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('La respuesta no puede estar vacía');
      return;
    }

    if (content.length < 5) {
      setError('La respuesta debe tener al menos 5 caracteres');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId,
          content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la respuesta');
      }

      setContent('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comparte tu opinión o experiencia..."
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        disabled={loading}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publicando...' : 'Publicar Respuesta'}
        </button>
      </div>
    </form>
  );
}
