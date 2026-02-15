'use client';

import { useEffect, useState } from 'react';
import { Trophy, Lock, Flame, BookOpen, Users, Star, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  tier: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface Stats {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievementStats, setAchievementStats] = useState({ total: 0, unlocked: 0, progress: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    Promise.all([
      fetch('/api/gamification/achievements').then(r => r.json()),
      fetch('/api/gamification/stats').then(r => r.json())
    ]).then(([achData, statsData]) => {
      setAchievements(achData.achievements);
      setAchievementStats(achData.stats);
      setStats(statsData);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading data:', err);
      setLoading(false);
    });
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'courses': return <BookOpen className="w-5 h-5" />;
      case 'streak': return <Flame className="w-5 h-5" />;
      case 'community': return <Users className="w-5 h-5" />;
      case 'level': return <Star className="w-5 h-5" />;
      case 'special': return <Zap className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: Trophy },
    { id: 'courses', name: 'Cursos', icon: BookOpen },
    { id: 'streak', name: 'Rachas', icon: Flame },
    { id: 'community', name: 'Comunidad', icon: Users },
    { id: 'level', name: 'Niveles', icon: Star },
    { id: 'special', name: 'Especiales', icon: Zap },
  ];

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Mis Logros
          </h1>
          <p className="text-gray-600">
            Desbloquea logros completando cursos, manteniendo rachas y participando en la comunidad
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-1">
                {achievementStats.unlocked}/{achievementStats.total}
              </div>
              <div className="text-sm text-gray-600">Logros Desbloqueados</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${achievementStats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">
                {stats?.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Puntos Totales</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
            <div className="text-center">
              <div className="text-4xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-orange-600">{stats?.currentStreak} días</div>
              <div className="text-sm text-gray-600">Racha Actual</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-200">
            <div className="text-center">
              <div className="text-4xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-green-600">Nivel {stats?.level}</div>
              <div className="text-sm text-gray-600">Tu Nivel</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filter === cat.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-6 transition-all ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${getTierColor(achievement.tier)} text-white shadow-lg`
                  : 'bg-white border-2 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                {achievement.unlocked ? (
                  <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                    +{achievement.points} pts
                  </div>
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-900'}`}>
                {achievement.title}
              </h3>
              
              <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                {achievement.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  achievement.unlocked 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {achievement.tier.toUpperCase()}
                </span>
                
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="text-xs text-white/80">
                    {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay logros en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
