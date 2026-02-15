'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface FormData {
  title: string;
  content: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categoryId: ''
  });

  useEffect(() => {
    fetch('/api/forum/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(err => {
        console.error('Error loading categories:', err);
        setLoadingCategories(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (formData.title.length < 5) {
      setError('El título debe tener al menos 5 caracteres');
      return;
    }

    if (!formData.content.trim()) {
      setError('El contenido es requerido');
      return;
    }

    if (formData.content.length < 10) {
      setError('El contenido debe tener al menos 10 caracteres');
      return;
    }

    if (!formData.categoryId) {
      setError('Debes seleccionar una categoría');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el post');
      }

      const post = await response.json();
      
      // Encontrar el slug de la categoría
      const category = categories.find(c => c.id === formData.categoryId);
      
      // Redirigir a la categoría
      if (category) {
        router.push(`/dashboard/community/${category.slug}`);
      } else {
        router.push('/dashboard/community');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/dashboard/community"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la comunidad
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Post</h1>
          <p className="text-gray-600 mt-2">
            Comparte tu experiencia con la comunidad
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="¿De qué quieres hablar?"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={200}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/200 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Comparte tus pensamientos, experiencias o preguntas..."
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publicando...' : 'Publicar Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
