import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth, getUserId } from '@/lib/server-auth';
import PlanGate from '@/components/auth/PlanGate';
import { getForumPostBySlug, incrementPostViews } from '@/lib/forum';
import { MessageCircle, ArrowLeft, Eye, MessageSquare, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';
import ReplyForm from './ReplyForm';
import ReplyThread from './ReplyThread';
import ReactionButton from '@/components/forum/ReactionButton';

interface Props {
  params: Promise<{ categoria: string; slug: string }>;
}

export default async function ForumPostPage({ params }: Props) {
  const userId = await getUserId();
  const { categoria, slug } = await params;
  const post = await getForumPostBySlug(categoria, slug);
  
  if (!post) {
    notFound();
  }

  // Increment view count
  await incrementPostViews(post.id);

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

  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const CategoryIcon = getIcon(post.category.name);

  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/dashboard/comunidad"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Comunidad
          </Link>
          <span className="text-gray-500">›</span>
          <Link
            href={`/dashboard/comunidad/${post.category.slug}`}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {post.category.name}
          </Link>
          <span className="text-gray-500">›</span>
          <span className="text-gray-900 font-medium">{post.title}</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/dashboard/comunidad/${post.category.slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a {post.category.name}
          </Link>
        </div>

        {/* Post Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                {post.author.imageUrl ? (
                  <img
                    src={post.author.imageUrl}
                    alt={`${post.author.firstName} ${post.author.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {post.author.firstName} {post.author.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.createdAt.toISOString()}>
                      {formatFullDate(post.createdAt)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.viewsCount + 1} vistas
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.repliesCount} respuestas
                  </div>
                </div>

                {/* Post Content */}
                <div className="prose prose-sm max-w-none mb-4">
                  <div className="whitespace-pre-wrap break-words">
                    {post.content}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <ReactionButton 
                    postId={post.id} 
                    initialCount={post.reactionsCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Respuestas ({post.repliesCount})
            </h2>
          </div>

          {/* Reply Form */}
          {userId && (
            <div className="p-6 border-b bg-gray-50">
              <ReplyForm postId={post.id} categorySlug={post.category.slug} postSlug={post.slug} />
            </div>
          )}

          {/* Replies List */}
          {post.replies && post.replies.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {post.replies.map((reply) => (
                <ReplyThread
                  key={reply.id}
                  reply={reply}
                  postId={post.id}
                  categorySlug={post.category.slug}
                  postSlug={post.slug}
                  currentUserId={userId}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aún no hay respuestas
              </h3>
              <p className="text-gray-600">
                {userId 
                  ? '¡Sé el primero en responder a esta discusión!'
                  : 'Inicia sesión para participar en la discusión.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </PlanGate>
  );
}