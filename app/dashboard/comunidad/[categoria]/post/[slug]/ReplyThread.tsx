'use client';
import { useState } from 'react';
import ReplyForm from './ReplyForm';

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: {
    firstName: string | null;
    lastName: string | null;
  };
}

interface ReplyThreadProps {
  replies: Reply[];
  postId: string;
}

export default function ReplyThread({ replies, postId }: ReplyThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);

  function formatTimeAgo(date: Date | string) {
    const now = new Date();
    const replyDate = new Date(date);
    const diff = now.getTime() - replyDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'hace un momento';
    if (minutes < 60) return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    if (hours < 24) return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    if (days < 30) return `hace ${days} día${days !== 1 ? 's' : ''}`;
    
    return replyDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const handleReplySuccess = () => {
    setShowReplyForm(null);
    // Refresh the page to show new reply
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {replies.map((reply) => (
        <div key={reply.id} className="border-l-4 border-blue-200 pl-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {/* Avatar simple con iniciales */}
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                {reply.author.firstName?.[0] || reply.author.lastName?.[0] || '?'}
              </div>
              <span className="font-medium text-gray-900">
                {reply.author.firstName} {reply.author.lastName}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(reply.createdAt)}
              </span>
            </div>
            
            <button
              onClick={() => setShowReplyForm(showReplyForm === reply.id ? null : reply.id)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Responder
            </button>
          </div>
          
          <div className="text-gray-700 whitespace-pre-wrap ml-11 mb-3">
            {reply.content}
          </div>

          {/* Formulario de respuesta */}
          {showReplyForm === reply.id && (
            <div className="ml-11 mt-3">
              <ReplyForm
                postId={postId}
                onReplyAdded={handleReplySuccess}
              />
              <button
                onClick={() => setShowReplyForm(null)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
