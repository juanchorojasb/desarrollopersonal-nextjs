import { Suspense } from 'react';
import Link from 'next/link';
import { MessageCircle, TrendingUp, Clock, Users } from 'lucide-react';

async function getForumData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/forum/categories`, {
      cache: 'no-store',
      next: { revalidate: 60 }
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
  const iconMap: Record<string, string> = {
    'Users': '👥',
    'Heart': '❤️',
    'BookOpen': '📚',
    'MapPin': '🧭',
    'Moon': '🌙',
    'Sprout': '🌱',
    'Scale': '⚖️',
    'Brain': '🧠',
    'Cloud': '☁️',
    'Video': '🎥',
    'HelpCircle': '❓',
    'Trophy': '🏆',
    'Briefcase': '💼'
  };

  return (
    <Link href={`/dashboard/community/${category.slug}`}>
      <div className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer bg-white">
        <div className="flex items-start gap-4">
          {/* Icono */}
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${category.color}15` }}
          >
            {iconMap[category.icon] || '💬'}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {category.name}
              </h3>
              <span className="flex-shrink-0 bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                {category.postsCount || 0} posts
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {category.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {category.lastPostAt ? (
                <>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(category.lastPostAt).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Activo</span>
                  </div>
                </>
              ) : (
                <span className="text-gray-400">Sin actividad</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CommunityPage() {
  const { categories } = await getForumData();

  // Separar por tipo
  const presentacion = categories.find((c: any) => c.slug === 'presentaciones');
  const cursos = categories.filter((c: any) => c.slug.includes('gestion-emociones') || c.slug.includes('habitos') || c.slug.includes('gps') || c.slug.includes('arquitectura') || c.slug.includes('depresion') || c.slug.includes('emociones-equilibrio') || c.slug.includes('neurocalma') || c.slug.includes('tormenta'));
  const otros = categories.filter((c: any) => c.slug === 'talleres-vivo' || c.slug === 'soporte');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Comunidad</h1>
              <p className="text-gray-600">
                Conecta, comparte y aprende junto a nuestra comunidad de desarrollo personal
              </p>
            </div>
            <Link href="/dashboard/community/new">
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg hover:shadow-xl">
                <MessageCircle className="w-5 h-5" />
                Crear Post
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categorías</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {categories.reduce((acc: number, cat: any) => acc + (cat.postsCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Posts Totales</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-pink-600 mb-1">
                {categories.filter((c: any) => c.lastPostAt).length}
              </div>
              <div className="text-sm text-gray-600">Activas</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                <Users className="w-6 h-6 inline" />
              </div>
              <div className="text-sm text-gray-600">Comunidad</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Presentación destacada */}
            {presentacion && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Comienza aquí
                </h2>
                <CategoryCard category={presentacion} />
              </div>
            )}

            {/* Foros por curso */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Foros de Cursos
              </h2>
              <div className="space-y-3">
                {cursos.length > 0 ? (
                  cursos.map((category: any) => (
                    <CategoryCard key={category.id} category={category} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-4">📚</div>
                    <p className="text-gray-500">No hay foros de cursos disponibles</p>
                  </div>
                )}
              </div>
            </div>

            {/* Otras categorías */}
            {otros.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  💡 Más Categorías
                </h2>
                <div className="space-y-3">
                  {otros.map((category: any) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bienvenida */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                👋 ¡Bienvenido!
              </h3>
              <p className="text-indigo-100 text-sm mb-4">
                Esta es tu comunidad de crecimiento personal. Comparte, aprende y conecta con personas en tu mismo camino.
              </p>
              <Link href="/dashboard/community/new">
                <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                  Crear mi primer post
                </button>
              </Link>
            </div>

            {/* Normas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                📋 Normas de la Comunidad
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Sé respetuoso y constructivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Mantén el tema relacionado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>No spam ni autopromoción</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Respeta la privacidad de otros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Reporta contenido inapropiado</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="text-lg font-semibold mb-3 text-amber-900">
                💡 Tips para participar
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• Comparte tus experiencias reales</li>
                <li>• Haz preguntas específicas</li>
                <li>• Sé empático con otros miembros</li>
                <li>• Agradece las respuestas útiles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
