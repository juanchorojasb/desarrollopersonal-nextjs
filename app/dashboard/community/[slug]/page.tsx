import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Clock, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

async function getCategoryWithPosts(slug: string) {
  const category = await prisma.forumCategory.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          _count: {
            select: {
              replies: true,
              reactions: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!category) {
    return null;
  }

  return category;
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const category = await getCategoryWithPosts(slug);

  if (!category) {
    notFound();
  }

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link 
            href="/dashboard/community"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la comunidad
          </Link>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${category.color}15` }}
              >
                {iconMap[category.icon || 'MessageCircle'] || '💬'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-600 mt-1">{category.description}</p>
              </div>
            </div>
            <Link href="/dashboard/community/new">
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Nuevo Post
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{category.posts.length} posts</span>
          </div>
        </div>

        <div className="space-y-4">
          {category.posts.length > 0 ? (
            category.posts.map((post) => (
              <Link 
                key={post.id}
                href={`/dashboard/community/${category.slug}/${post.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.user.name || post.user.email.split('@')[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post._count.replies} respuestas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aún no hay posts en esta categoría
              </h3>
              <p className="text-gray-600 mb-6">
                ¡Sé el primero en compartir algo!
              </p>
              <Link href="/dashboard/community/new">
                <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                  Crear Primer Post
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
