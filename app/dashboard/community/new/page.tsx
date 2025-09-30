'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  content: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Datos hardcodeados de categorías (podrías hacer fetch si necesitas datos actualizados)
const categories: Category[] = [
  { id: 'cmg35fn2j0000eeclksw2nzq8', name: 'Bienestar Personal', slug: 'bienestar' },
  { id: 'cmg35fn2v0001eecljwmsepsv', name: 'Estudios y Aprendizaje', slug: 'estudio' },
  { id: 'cmg35fn3d0002eeclnpsb9cgo', name: 'Motivación y Logros', slug: 'motivacion' },
  { id: 'cmg35fn3j0003eeclt3uj11ta', name: 'Desarrollo Profesional', slug: 'profesional' },
  { id: 'cmg35fn3r0004eeclg5moh8sf', name: 'Preguntas Generales', slug: 'preguntas' }
];

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categoryId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
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
      
      // Redireccionar al post creado o a la categoría
      router.push('/dashboard/community');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Limpiar error al escribir
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/community">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            ← Volver a la comunidad
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Post</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="¿Sobre qué quieres hablar?"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={200}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <textarea 
              placeholder="Comparte tus pensamientos, experiencias o preguntas..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={10000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length}/10,000 caracteres
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/dashboard/community">
              <button 
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
            </Link>
            <button 
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim() || !formData.categoryId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Publicando...' : 'Publicar Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
