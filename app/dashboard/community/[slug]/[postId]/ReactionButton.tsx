'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  postId: string;
  reactionCount: number;
  userHasReacted: boolean;
}

export default function ReactionButton({ postId, reactionCount, userHasReacted }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasReacted, setHasReacted] = useState(userHasReacted);
  const [count, setCount] = useState(reactionCount);

  const handleReaction = async () => {
    if (loading) return;

    setLoading(true);
    const newReactionState = !hasReacted;

    // Optimistic update
    setHasReacted(newReactionState);
    setCount(prev => newReactionState ? prev + 1 : prev - 1);

    try {
      const response = await fetch('/api/forum/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId,
          type: 'like'
        })
      });

      if (!response.ok) {
        throw new Error('Error al reaccionar');
      }

      router.refresh();
    } catch (err) {
      // Revertir optimistic update
      setHasReacted(!newReactionState);
      setCount(prev => newReactionState ? prev - 1 : prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReaction}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        hasReacted
          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Heart className={`w-5 h-5 ${hasReacted ? 'fill-pink-600' : ''}`} />
      <span className="font-medium">{count}</span>
    </button>
  );
}
