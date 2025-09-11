import Link from 'next/link';
import { notFound } from 'next/navigation';
import PlanGate from '@/components/auth/PlanGate';
import { getForumCategoryBySlug, getForumPostsByCategory } from '@/lib/forum';
import { MessageCircle, Plus, Pin, Lock, Eye, MessageSquare } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ForumCategoryPage({ params, searchParams }: Props) {
  const { categoria } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getForumCategoryBySlug(categoria);
  
  if (!category) {
    notFound();
  }

  const page = parseInt(pageParam || '1', 10);
  const { posts, total, hasMore } = await getForumPostsByCategory(category.id, page);

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

  const Icon = getIcon(category.icon);

  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/comunidad"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver a Comunidad
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: category.color }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </div>
            </div>
          </div>
          
          <Link
            href={`/dashboard/comunidad/${category.slug}/nuevo`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Tema
          </Link>
        </div>

        {/* Category Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Discusiones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.repliesCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Respuestas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.viewsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Vistas</div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Discusiones</h2>
              <div className="text-sm text-gray-600">
                Página {page} de {Math.ceil(total / 20)}
              </div>
            </div>
          </div>
          
          {posts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/dashboard/comunidad/${category.slug}/post/${post.slug}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <div className="flex-shrink-0">
                      {post.author.imageUrl ? (
                        <img
                          src={post.author.imageUrl}
                          alt={`${post.author.firstName} ${post.author.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-indigo-600" />
                        )}
                        {post.isLocked && (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                        <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        por {post.author.firstName} {post.author.lastName} •{' '}
                        {formatTimeAgo(new Date(post.createdAt))}
                        {post.lastReply && (
                          <>
                            {' • '} última respuesta por {post.lastReply.author.firstName} {post.lastReply.author.lastName}{' '}
                            {formatTimeAgo(new Date(post.lastReply.createdAt))}
                          </>
                        )}
                      </div>

                      {/* Truncated content preview */}
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {post.content.substring(0, 200)}
                        {post.content.length > 200 && '...'}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 text-right space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        {post.viewsCount}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        {post.repliesCount}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aún no hay discusiones
              </h3>
              <p className="text-gray-600 mb-4">
                ¡Sé el primero en comenzar una conversación en esta categoría!
              </p>
              <Link
                href={`/dashboard/comunidad/${category.slug}/nuevo`}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Primera Discusión
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Mostrando {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} de {total} discusiones
            </div>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/comunidad/${category.slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Anterior
                </Link>
              )}
              {hasMore && (
                <Link
                  href={`/dashboard/comunidad/${category.slug}?page=${page + 1}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </PlanGate>
  );
}