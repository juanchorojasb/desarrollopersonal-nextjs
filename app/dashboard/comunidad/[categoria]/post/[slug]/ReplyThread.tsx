'use client';

import { useState } from 'react';
import { MessageSquare, Calendar, Reply } from 'lucide-react';
import { ForumReplyWithAuthor } from '@/lib/forum';
import ReplyForm from './ReplyForm';
import ReactionButton from '@/components/forum/ReactionButton';

interface ReplyThreadProps {
  reply: ForumReplyWithAuthor;
  postId: string;
  categorySlug: string;
  postSlug: string;
  currentUserId: string | null;
  level?: number;
}

export default function ReplyThread({ 
  reply, 
  postId, 
  categorySlug, 
  postSlug, 
  currentUserId,
  level = 0 
}: ReplyThreadProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  
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

  const maxLevel = 3; // Maximum nesting level
  const canReply = currentUserId && level < maxLevel;
  const hasChildren = reply.children && reply.children.length > 0;

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Author Avatar */}
          <div className="flex-shrink-0">
            {reply.author.imageUrl ? (
              <img
                src={reply.author.imageUrl}
                alt={`${reply.author.firstName} ${reply.author.lastName}`}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {reply.author.firstName?.[0]}{reply.author.lastName?.[0]}
                </span>
              </div>
            )}
          </div>

          {/* Reply Content */}
          <div className="flex-1 min-w-0">
            {/* Author and timestamp */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-medium text-gray-900">
                {reply.author.firstName} {reply.author.lastName}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <time 
                  dateTime={reply.createdAt.toISOString()}
                  title={formatFullDate(reply.createdAt)}
                >
                  {formatTimeAgo(reply.createdAt)}
                </time>
              </div>
            </div>

            {/* Reply content */}
            <div className="prose prose-sm max-w-none mb-3">
              <div className="whitespace-pre-wrap break-words text-gray-700">
                {reply.content}
              </div>
            </div>

            {/* Reply actions */}
            <div className="flex items-center gap-4">
              <ReactionButton 
                replyId={reply.id} 
                initialCount={reply.reactionsCount}
                className="text-xs"
              />
              
              {canReply && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Responder
                </button>
              )}
              
              {hasChildren && (
                <button
                  onClick={() => setShowChildren(!showChildren)}
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {showChildren ? 'Ocultar' : 'Mostrar'} respuestas ({reply.children!.length})
                </button>
              )}
            </div>

            {/* Reply form */}
            {isReplying && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <ReplyForm
                  postId={postId}
                  categorySlug={categorySlug}
                  postSlug={postSlug}
                  parentId={reply.id}
                  placeholder={`Respondiendo a ${reply.author.firstName}...`}
                  onSuccess={() => setIsReplying(false)}
                  onCancel={() => setIsReplying(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {hasChildren && showChildren && (
        <div className="space-y-0">
          {reply.children!.map((childReply) => (
            <ReplyThread
              key={childReply.id}
              reply={childReply}
              postId={postId}
              categorySlug={categorySlug}
              postSlug={postSlug}
              currentUserId={currentUserId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}