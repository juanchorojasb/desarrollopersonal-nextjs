import { requirePremiumAccess } from '@/lib/forum-access';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReplyForm from './ReplyForm';
import ReactionButtons from './ReactionButtons';

const prisma = new PrismaClient();

async function getPostWithReplies(slug: string, userId?: string) {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        replies: {
          include: {
            author: true,
            reactions: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        reactions: {
          include: {
            user: true
          }
        }
      }
    });

    if (!post) return null;

    // Agrupar reacciones por tipo
    const reactionGroups: Record<string, { type: string; count: number; userReacted: boolean }> = {};
    
    post.reactions.forEach((reaction: { type: string; user: { clerkUserId: string } }) => {
      if (!reactionGroups[reaction.type]) {
        reactionGroups[reaction.type] = {
          type: reaction.type,
          count: 0,
          userReacted: false
        };
      }
      reactionGroups[reaction.type].count++;
      if (reaction.user.clerkUserId === userId) {
        reactionGroups[reaction.type].userReacted = true;
      }
    });

    // Asegurar que todos los tipos de reacción estén presentes
    const allReactionTypes = ['like', 'love', 'helpful', 'insightful', 'laugh'];
    allReactionTypes.forEach(type => {
      if (!reactionGroups[type]) {
        reactionGroups[type] = { type, count: 0, userReacted: false };
      }
    });

    return {
      ...post,
      reactionsSummary: Object.values(reactionGroups)
    };
  } catch (error) {
    console.error('Error fetching post:', error);
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
    slug: string;
  }>;
}

export default async function PostPage({ params }: PageProps) {
  const { categoria, slug } = await params;
  
  const { hasAccess, user, upgradeMessage } = await requirePremiumAccess();
  
  if (!hasAccess) {
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

  const post = await getPostWithReplies(slug, user.id);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/comunidad" className="hover:text-blue-600">Comunidad</Link>
            <span>/</span>
            <Link 
              href={`/dashboard/comunidad/${categoria}`}
              className="hover:text-blue-600 capitalize"
            >
              {categoria.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </div>
        </nav>

        {/* Post Principal */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">{post.author.firstName} {post.author.lastName}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(new Date(post.createdAt))}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {post.category.name}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>

            <ReactionButtons 
              postId={post.id} 
              initialReactions={post.reactionsSummary}
            />
          </div>
        </div>

        {/* Respuestas */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Respuestas ({post.replies.length})
            </h3>
            
            {post.replies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Sé el primero en responder a esta publicación</p>
              </div>
            ) : (
              <div className="space-y-6">
                {post.replies.map((reply: { id: string; content: string; createdAt: Date; author: { firstName: string | null; lastName: string | null } }) => (
                  <div key={reply.id} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900">
                        {reply.author.firstName} {reply.author.lastName}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(new Date(reply.createdAt))}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {reply.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Formulario de Respuesta */}
        <ReplyForm postId={post.id} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostWithReplies(slug);
  
  if (!post) {
    return {
      title: 'Post no encontrado | DesarrolloPersonal.uno'
    };
  }

  return {
    title: `${post.title} | Comunidad DesarrolloPersonal.uno`,
    description: post.content.substring(0, 160) + '...'
  };
}
