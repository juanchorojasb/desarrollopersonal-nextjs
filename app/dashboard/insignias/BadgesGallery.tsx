'use client';

import { useEffect, useState } from 'react';
import { Star, Lock } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  color: string;
  unlocked: boolean;
  unlockedAt: string | null;
  isFavorite: boolean;
}

export default function BadgesGallery() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState({ total: 0, unlocked: 0, progress: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/badges');
      const data = await response.json();
      setBadges(data.badges);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (badgeId: string) => {
    try {
      const response = await fetch(`/api/badges/${badgeId}/favorite`, {
        method: 'POST'
      });
      const data = await response.json();
      
      setBadges(prev => prev.map(b => 
        b.id === badgeId ? { ...b, isFavorite: data.isFavorite } : b
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getRarityLabel = (rarity: string) => {
    const labels: Record<string, string> = {
      common: 'Común',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Legendario'
    };
    return labels[rarity] || rarity;
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-600'
    };
    return colors[rarity] || 'from-gray-400 to-gray-600';
  };

  const categories = [
    { id: 'all', name: 'Todas', icon: '🎯' },
    { id: 'skill', name: 'Habilidades', icon: '⚡' },
    { id: 'milestone', name: 'Hitos', icon: '🏆' },
    { id: 'special', name: 'Especiales', icon: '🌟' },
    { id: 'seasonal', name: 'Temporada', icon: '🎊' }
  ];

  const filteredBadges = filter === 'all' 
    ? badges 
    : badges.filter(b => b.category === filter);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-600 mb-2">
              {stats.unlocked}/{stats.total}
            </div>
            <div className="text-sm text-gray-600">Insignias Desbloqueadas</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <div className="text-center">
            <div className="text-5xl mb-2">🏆</div>
            <div className="text-2xl font-bold">{stats.progress}%</div>
            <div className="text-sm text-yellow-100">Colección Completa</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
          <div className="text-center">
            <div className="text-5xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-purple-600">
              {badges.filter(b => b.isFavorite).length}
            </div>
            <div className="text-sm text-gray-600">Favoritas</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filter === cat.id
                ? 'bg-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-400'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map(badge => (
          <div
            key={badge.id}
            className={`rounded-xl p-6 transition-all ${
              badge.unlocked
                ? 'bg-white border-2 hover:shadow-xl'
                : 'bg-gray-100 border-2 border-gray-200 opacity-60'
            }`}
            style={{
              borderColor: badge.unlocked ? badge.color : undefined
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`text-6xl ${!badge.unlocked && 'grayscale'}`}>
                {badge.icon}
              </div>
              {badge.unlocked ? (
                <button
                  onClick={() => toggleFavorite(badge.id)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      badge.isFavorite 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <h3 className={`text-lg font-bold mb-2 ${
              badge.unlocked ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {badge.name}
            </h3>

            <p className={`text-sm mb-4 ${
              badge.unlocked ? 'text-gray-600' : 'text-gray-500'
            }`}>
              {badge.description}
            </p>

            <div className="flex items-center justify-between">
              <span 
                className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}
              >
                {getRarityLabel(badge.rarity)}
              </span>

              {badge.unlocked && badge.unlockedAt && (
                <span className="text-xs text-gray-500">
                  {new Date(badge.unlockedAt).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏅</div>
          <p className="text-gray-500">No hay insignias en esta categoría</p>
        </div>
      )}
    </div>
  );
}
