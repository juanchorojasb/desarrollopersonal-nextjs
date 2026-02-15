import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Clock, User, Heart } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/server-auth';
import ReplyForm from './ReplyForm';
import ReactionButton from './ReactionButton';

async function getPostWithReplies(postId: string) {
  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        }
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          reactions: true,
        },
        orderBy: { createdAt: 'asc' }
      },
      reactions: true,
    }
  });

  return post;
}

export default async function PostDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; postId: string }> 
}) {
  const { slug, postId } = await params;
  const user = await getCurrentUser();
  const post = await getPostWithReplies(postId);

  if (!post) {
    notFound();
  }

  const userReaction = user ? post.reactions.find(r => r.userId === user.id) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href={`/dashboard/community/${slug}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a {post.category.name}
          </Link>
        </div>

        {/* Post Principal */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700">
                {post.user.name || post.user.email.split('@')[0]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Reacciones */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <ReactionButton 
              postId={post.id}
              reactionCount={post.reactions.length}
              userHasReacted={!!userReaction}
            />
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span>{post.replies.length} respuestas</span>
            </div>
          </div>
        </div>

        {/* Respuestas */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Respuestas ({post.replies.length})
          </h2>

          <div className="space-y-4">
            {post.replies.map((reply) => {
              const replyUserReaction = user ? reply.reactions.find(r => r.userId === user.id) : null;
              
              return (
                <div key={reply.id} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {reply.user.name || reply.user.email.split('@')[0]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-14">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-pink-600 transition-colors">
                      <Heart className={`w-4 h-4 ${replyUserReaction ? 'fill-pink-600 text-pink-600' : ''}`} />
                      <span className="text-sm">{reply.reactions.length}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulario de Respuesta */}
        {user && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Escribe una respuesta
            </h3>
            <ReplyForm postId={post.id} categorySlug={slug} />
          </div>
        )}

        {!user && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              Inicia sesión para participar en la conversación
            </p>
            <Link href="/auth/signin">
              <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Iniciar Sesión
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
