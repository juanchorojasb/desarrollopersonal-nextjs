'use client';

import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  icon: string;
  points: number;
  tier: string;
}

interface Props {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlockedToast({ achievement, onClose }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-gradient-to-br ${getTierColor(achievement.tier)} text-white rounded-xl shadow-2xl p-6 max-w-sm`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            <div className="font-bold text-lg">¡Logro Desbloqueado!</div>
          </div>
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="text-4xl">{achievement.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1">{achievement.title}</h3>
            <p className="text-sm text-white/90 mb-2">{achievement.description}</p>
            <div className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
              +{achievement.points} puntos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
