'use client';

import { useState } from 'react';

interface ProgressButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export default function ProgressButton({ lessonId, isCompleted }: ProgressButtonProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lessonId,
          completed: !completed,
        }),
      });

      if (response.ok) {
        setCompleted(!completed);
        // Reload page to update progress elsewhere
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error('Error updating progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleComplete}
      disabled={loading}
      className={`px-4 py-2 rounded-lg transition-colors ${
        completed
          ? 'bg-green-600 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Actualizando...' : completed ? '✓ Completada' : 'Marcar como Completada'}
    </button>
  );
}