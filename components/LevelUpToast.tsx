'use client';

import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';

interface Props {
  level: number;
  onClose: () => void;
}

export default function LevelUpToast({ level, onClose }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getLevelEmoji = (level: number) => {
    if (level >= 50) return '👑';
    if (level >= 25) return '⭐⭐⭐';
    if (level >= 10) return '⭐⭐';
    if (level >= 5) return '⭐';
    return '🌱';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Leyenda';
    if (level >= 25) return 'Maestro';
    if (level >= 10) return 'Experto';
    if (level >= 5) return 'Aprendiz';
    return 'Principiante';
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-2xl p-6 max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6" />
            <div className="font-bold text-lg">¡Subiste de Nivel!</div>
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
        
        <div className="text-center">
          <div className="text-6xl mb-3">{getLevelEmoji(level)}</div>
          <div className="text-3xl font-bold mb-2">Nivel {level}</div>
          <div className="text-lg text-white/90">{getLevelTitle(level)}</div>
        </div>
      </div>
    </div>
  );
}
