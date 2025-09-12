'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface ReactionButtonsProps {
  postId: string;
  initialReactions: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
}

export default function ReactionButtons({ postId, initialReactions }: ReactionButtonsProps) {
  const { user } = useUser();
  const [reactions, setReactions] = useState(initialReactions);
  const [loading, setLoading] = useState(false);

  const handleReaction = async (type: string) => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/forum/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, type })
      });

      if (response.ok) {
        const updatedReaction = await response.json();
        setReactions(prev => prev.map(r => 
          r.type === type ? updatedReaction : r
        ));
      }
    } catch (error) {
      console.error('Error al procesar reacción:', error);
    } finally {
      setLoading(false);
    }
  };

  const reactionEmojis = {
    like: '👍',
    love: '❤️', 
    helpful: '💡',
    insightful: '🎯',
    laugh: '😄'
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {reactions.map(reaction => (
        <button
          key={reaction.type}
          onClick={() => handleReaction(reaction.type)}
          disabled={loading}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            reaction.userReacted 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <span>{reactionEmojis[reaction.type as keyof typeof reactionEmojis]}</span>
          <span>{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}
