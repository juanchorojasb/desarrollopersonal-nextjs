import { requirePremiumAccess } from '@/lib/forum-access';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CreatePostForm from './CreatePostForm';
import PremiumUpgradeNotification from '@/components/ui/PremiumUpgradeNotification';

const prisma = new PrismaClient();

async function getCategoryWithPosts(slug: string) {
  try {
    return await prisma.forumCategory.findUnique({
      where: { slug },
      include: {
        posts: {
          include: {
            author: true,
            replies: true,
            reactions: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'hace un momento';
  if (minutes < 60) return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  if (hours < 24) return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  if (days < 30) return `hace ${days} día${days !== 1 ? 's' : ''}`;

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

interface PageProps {
  params: Promise<{
    categoria: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { categoria } = await params;

  const { hasAccess, user, upgradeMessage } = await requirePremiumAccess();

  // Permitir acceso para usuarios free pero mostrar notificación
  if (!hasAccess && user?.plan !== 'free') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comunidad Premium</h2>
            <p className="text-gray-600">{upgradeMessage}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/pricing"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
            >
              Ver Planes Premium
            </Link>
            <Link
              href="/dashboard"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">No se pudo obtener la información del usuario.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const category = await getCategoryWithPosts(categoria);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Premium Upgrade Notification for free users */}
        {user.plan === 'free' && (
          <PremiumUpgradeNotification userPlan={user.plan} context="forum" />
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              <Link
                href="/dashboard/comunidad"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver a Comunidad
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-2 space-y-4">
            {category.posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay publicaciones aún
                </h3>
                <p className="text-gray-600 mb-4">
                  Sé el primero en iniciar una conversación en esta categoría
                </p>
              </div>
            ) : (
              category.posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <Link
                      href={`/dashboard/comunidad/${categoria}/post/${post.slug}`}
                      className="block"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content.substring(0, 200)}...
                      </p>
                    </Link>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>
                          Por <span className="font-medium">{post.author.firstName} {post.author.lastName}</span>
                        </span>
                        <span>{formatTimeAgo(new Date(post.createdAt))}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{post.replies.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>👍</span>
                          <span>{post.reactions.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nueva Publicación</h3>
              <CreatePostForm categoryId={category.id} userPlan={user.plan} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicaciones</span>
                  <span className="font-medium">{category.posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Respuestas</span>
                  <span className="font-medium">
                    {category.posts.reduce((acc: number, post) => acc + post.replies.length, 0)}
                  </span>
                </div>
                {user.plan === 'free' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">
                        Como usuario gratuito tienes acceso limitado
                      </p>
                      <Link
                        href="/pricing"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Actualizar a Premium
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { categoria } = await params;
  const category = await getCategoryWithPosts(categoria);

  if (!category) {
    return {
      title: 'Categoría no encontrada | DesarrolloPersonal.uno'
    };
  }

  return {
    title: `${category.name} | Comunidad DesarrolloPersonal.uno`,
    description: category.description
  };
}
