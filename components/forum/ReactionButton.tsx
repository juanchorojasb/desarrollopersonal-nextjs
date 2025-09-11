'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Heart, ThumbsUp, Smile, Lightbulb, Brain } from 'lucide-react';

interface Reaction {
  type: string;
  count: number;
  users: { firstName: string; lastName: string }[];
}

interface ReactionButtonProps {
  postId?: string;
  replyId?: string;
  initialCount?: number;
  className?: string;
}

const REACTION_TYPES = [
  { type: 'like', icon: ThumbsUp, label: 'Me gusta', color: 'text-blue-600' },
  { type: 'love', icon: Heart, label: 'Me encanta', color: 'text-red-600' },
  { type: 'helpful', icon: Lightbulb, label: 'Útil', color: 'text-yellow-600' },
  { type: 'insightful', icon: Brain, label: 'Perspicaz', color: 'text-purple-600' },
  { type: 'laugh', icon: Smile, label: 'Divertido', color: 'text-green-600' }
];

export default function ReactionButton({ 
  postId, 
  replyId, 
  initialCount = 0, 
  className = '' 
}: ReactionButtonProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user } = useUser();

  // Load reactions on mount
  useEffect(() => {
    loadReactions();
  }, [postId, replyId]);

  const loadReactions = async () => {
    if (!postId && !replyId) return;

    try {
      const params = new URLSearchParams();
      if (postId) params.set('postId', postId);
      if (replyId) params.set('replyId', replyId);

      const response = await fetch(`/api/forum/reactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions || []);
        setTotalCount(data.total || 0);
        
        // Check if current user has reacted
        const userReactionType = data.reactions?.find((r: Reaction) => 
          r.users.some(u => u.firstName === user?.firstName && u.lastName === user?.lastName)
        )?.type;
        setUserReaction(userReactionType || null);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (type: string) => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/forum/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          postId,
          replyId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state based on action
        if (data.action === 'added') {
          setUserReaction(type);
          setTotalCount(prev => prev + 1);
        } else if (data.action === 'removed') {
          setUserReaction(null);
          setTotalCount(prev => Math.max(0, prev - 1));
        } else if (data.action === 'updated') {
          setUserReaction(type);
          // Count stays the same
        }
        
        // Reload full reaction data
        setTimeout(loadReactions, 500);
      }
    } catch (error) {
      console.error('Error reacting:', error);
    } finally {
      setLoading(false);
      setShowReactions(false);
    }
  };

  const getReactionSummary = () => {
    if (reactions.length === 0) return null;
    
    const topReactions = reactions
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
      
    return topReactions.map(reaction => {
      const reactionType = REACTION_TYPES.find(r => r.type === reaction.type);
      if (!reactionType) return null;
      
      const Icon = reactionType.icon;
      return (
        <div key={reaction.type} className="flex items-center gap-1">
          <Icon className={`w-3 h-3 ${reactionType.color}`} />
          <span className="text-xs text-gray-600">{reaction.count}</span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main reaction button */}
      <button
        onClick={() => setShowReactions(!showReactions)}
        disabled={!user || loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
      >
        {userReaction ? (
          <>
            {(() => {
              const reactionType = REACTION_TYPES.find(r => r.type === userReaction);
              if (!reactionType) return <ThumbsUp className="w-4 h-4" />;
              const Icon = reactionType.icon;
              return <Icon className={`w-4 h-4 ${reactionType.color}`} />;
            })()}
            <span>Reaccionaste</span>
          </>
        ) : (
          <>
            <ThumbsUp className="w-4 h-4" />
            <span>Reaccionar</span>
          </>
        )}
        
        {totalCount > 0 && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            {totalCount}
          </span>
        )}
      </button>

      {/* Reaction summary */}
      {reactions.length > 0 && (
        <div className="flex items-center gap-2 mt-1">
          {getReactionSummary()}
        </div>
      )}

      {/* Reaction picker */}
      {showReactions && user && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
          <div className="flex items-center gap-1">
            {REACTION_TYPES.map((reaction) => {
              const Icon = reaction.icon;
              const isSelected = userReaction === reaction.type;
              
              return (
                <button
                  key={reaction.type}
                  onClick={() => handleReaction(reaction.type)}
                  disabled={loading}
                  className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    isSelected ? 'bg-gray-100 ring-2 ring-indigo-500' : ''
                  }`}
                  title={reaction.label}
                >
                  <Icon className={`w-5 h-5 ${reaction.color} ${loading ? 'opacity-50' : ''}`} />
                </button>
              );
            })}
          </div>
          
          {reactions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
              {reactions.map((reaction, idx) => {
                const reactionType = REACTION_TYPES.find(r => r.type === reaction.type);
                if (!reactionType) return null;
                
                return (
                  <div key={reaction.type} className="flex items-center justify-between">
                    <span>{reactionType.label}</span>
                    <span>{reaction.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}