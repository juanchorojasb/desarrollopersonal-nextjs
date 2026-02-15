'use client';

import { useState } from 'react';
import { CheckCircle, Trophy, Star } from 'lucide-react';
import AchievementUnlockedToast from './AchievementUnlockedToast';
import LevelUpToast from './LevelUpToast';

interface LessonPlayerProps {
  lessonId: string;
  videoUrl: string;
  title: string;
  isCompleted?: boolean;
  onComplete?: () => void;
}

export default function LessonPlayer({ 
  lessonId, 
  videoUrl, 
  title, 
  isCompleted = false,
  onComplete 
}: LessonPlayerProps) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const [showAchievements, setShowAchievements] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  const handleMarkComplete = async () => {
    if (completed || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setCompleted(true);
        
        // Mostrar notificaciones de gamificación
        if (data.gamification) {
          // Mostrar logros desbloqueados
          if (data.gamification.newAchievements?.length > 0) {
            setShowAchievements(data.gamification.newAchievements);
          }

          // Mostrar subida de nivel
          if (data.gamification.newLevel) {
            setShowLevelUp(data.gamification.newLevel);
          }
        }

        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowFullScreen
        />
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {completed && (
            <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
              <CheckCircle className="w-4 h-4" />
              <span>Completada</span>
            </div>
          )}
        </div>

        {!completed && (
          <button
            onClick={handleMarkComplete}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Marcar como Completada
              </>
            )}
          </button>
        )}
      </div>

      {/* Notificaciones de Logros */}
      {showAchievements.map((achievement, index) => (
        <AchievementUnlockedToast
          key={achievement.id}
          achievement={achievement}
          onClose={() => {
            setShowAchievements(prev => prev.filter((_, i) => i !== index));
          }}
        />
      ))}

      {/* Notificación de Level Up */}
      {showLevelUp && (
        <LevelUpToast
          level={showLevelUp}
          onClose={() => setShowLevelUp(null)}
        />
      )}
    </div>
  );
}
