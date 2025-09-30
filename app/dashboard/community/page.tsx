import { Suspense } from 'react';
import Link from 'next/link';

async function getForumData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://desarrollopersonal.uno'}/api/forum/categories`, {
      cache: 'no-store',
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const categories = await response.json();
    return { categories };
  } catch (error) {
    console.error('Error fetching forum data:', error);
    return { categories: [] };
  }
}

function CategoryCard({ category }: { category: any }) {
  return (
    <Link href={`/dashboard/community/${category.slug}`}>
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {category.postsCount} posts
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              {category.description}
            </p>
            
            <div className="text-xs text-gray-500">
              {category.lastPostAt 
                ? `Última actividad: ${new Date(category.lastPostAt).toLocaleDateString('es-ES')}`
                : 'Sin actividad reciente'
              }
            </div>
          </div>
          
          <div className="ml-4 text-2xl text-gray-400">
            {category.icon === 'Heart' && '❤️'}
            {category.icon === 'BookOpen' && '📚'}
            {category.icon === 'Trophy' && '🏆'}
            {category.icon === 'Briefcase' && '💼'}
            {category.icon === 'HelpCircle' && '❓'}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CommunityPage() {
  const { categories } = await getForumData();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comunidad</h1>
          <p className="text-gray-600 mt-1">
            Conecta, comparte y aprende junto a nuestra comunidad de desarrollo personal
          </p>
        </div>
        <Link href="/dashboard/community/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo Post
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              💬 Categorías del Foro
            </h2>
            
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category: any) => (
                  <CategoryCard key={category.id} category={category} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-gray-500">No hay categorías disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              👥 Bienvenido a la Comunidad
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>Únete a nuestra comunidad de desarrollo personal y conecta con personas que comparten tus intereses.</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Normas de la comunidad:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Sé respetuoso y constructivo</li>
                  <li>• Mantén el tema relacionado</li>
                  <li>• No spam ni autopromoción</li>
                  <li>• Respeta la privacidad</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Categorías activas</span>
                <span className="font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Posts totales</span>
                <span className="font-medium">{categories.reduce((acc: number, cat: any) => acc + cat.postsCount, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
