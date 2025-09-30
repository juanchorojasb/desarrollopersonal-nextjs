import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCategoryData(slug: string) {
  try {
    // Mapeo de slugs a nombres para mostrar
    const categoryNames: Record<string, string> = {
      'bienestar': 'Bienestar Personal',
      'estudio': 'Estudios y Aprendizaje', 
      'motivacion': 'Motivación y Logros',
      'profesional': 'Desarrollo Profesional',
      'preguntas': 'Preguntas Generales'
    };

    const categoryName = categoryNames[slug];
    
    if (!categoryName) {
      return null;
    }

    // Por ahora devolvemos datos básicos, después conectaremos con la API
    return {
      name: categoryName,
      slug,
      description: `Discusiones sobre ${categoryName.toLowerCase()}`,
      postsCount: 0
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/community">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            ← Volver a la comunidad
          </button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            {category.postsCount} posts en esta categoría
          </p>
        </div>
        
        <Link href="/dashboard/community/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo Post
          </button>
        </Link>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay posts aún en esta categoría
          </h3>
          <p className="text-gray-500 mb-4">
            Sé el primero en iniciar una conversación sobre {category.name.toLowerCase()}
          </p>
          <Link href="/dashboard/community/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Crear Primer Post
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
