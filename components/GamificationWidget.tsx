'use client';

import { useEffect, useState } from 'react';
import { Trophy, Flame, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  coursesCompleted: number;
  lessonsCompleted: number;
  levelProgress: {
    currentLevel: number;
    nextLevel: number;
    pointsForNext: number;
    progress: number;
  };
}

export default function GamificationWidget() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gamification/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white animate-pulse">
        <div className="h-20 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!stats) return null;

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
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{getLevelEmoji(stats.level)}</div>
            <div>
              <div className="text-sm text-purple-100">Tu Nivel</div>
              <div className="text-2xl font-bold">Nivel {stats.level}</div>
              <div className="text-sm text-purple-200">{getLevelTitle(stats.level)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Number(stats.totalPoints).toLocaleString()}</div>
            <div className="text-sm text-purple-100">Puntos</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-100">Nivel {stats.levelProgress.nextLevel}</span>
            <span className="text-purple-100">{stats.levelProgress.pointsForNext} pts</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.levelProgress.progress)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Racha</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</div>
              <div className="text-sm text-gray-600">Cursos</div>
            </div>
          </div>
        </div>
      </div>

      <Link href="/dashboard/achievements">
        <button className="w-full bg-white border-2 border-indigo-200 hover:border-indigo-400 text-indigo-600 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>Ver Mis Logros</span>
          </div>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  );
}
