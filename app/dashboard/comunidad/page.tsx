import Link from 'next/link';
import PlanGate from '@/components/auth/PlanGate';
import { getForumCategories } from '@/lib/forum';
import { MessageCircle, Users, TrendingUp } from 'lucide-react';
import * as Icons from 'lucide-react';

export default async function ComunidadPage() {
  const categories = await getForumCategories();
  
  const totalPosts = categories.reduce((sum, cat) => sum + cat.postsCount, 0);
  const activeCategories = categories.filter(cat => cat.postsCount > 0).length;

  const getIcon = (iconName: string | null) => {
    if (!iconName) return MessageCircle;
    const Icon = (Icons as any)[iconName];
    return Icon || MessageCircle;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `hace ${minutes} minutos`;
    if (hours < 24) return `hace ${hours} horas`;
    return `hace ${days} días`;
  };

  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Comunidad</h1>
            <p className="text-gray-600">Conecta con otros estudiantes y comparte tu experiencia de crecimiento</p>
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalPosts}</div>
            <div className="text-gray-600">Discusiones Totales</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{activeCategories}</div>
            <div className="text-gray-600">Categorías Activas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-gray-600">Temas Disponibles</div>
          </div>
        </div>

        {/* Forum Categories */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Categorías del Foro</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {categories.map((category) => {
              const Icon = getIcon(category.icon);
              return (
                <Link
                  key={category.id}
                  href={`/dashboard/comunidad/${category.slug}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-lg"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: category.color }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {category.postsCount} posts
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                      )}
                      
                      {/* Last Post Info */}
                      {category.lastPost ? (
                        <div className="text-xs text-gray-500">
                          Último post: "{category.lastPost.title}" por{' '}
                          {category.lastPost.author.firstName} {category.lastPost.author.lastName}{' '}
                          {formatTimeAgo(new Date(category.lastPost.createdAt))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          No hay posts aún - ¡Sé el primero en participar!
                        </div>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {category.postsCount}
                      </div>
                      <div className="text-xs text-gray-500">Discusiones</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">¿Nuevo en la comunidad?</h3>
          <div className="text-sm text-gray-600 mb-4">
            Comienza participando in las discusiones existentes o crea un nuevo tema para compartir tus experiencias.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/comunidad/bienestar"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              Explorar Bienestar
            </Link>
            <Link
              href="/dashboard/comunidad/estudio"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              Ver Estudios
            </Link>
            <Link
              href="/dashboard/comunidad/motivacion"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              Motivación
            </Link>
          </div>
        </div>
      </div>
    </PlanGate>
  );
}