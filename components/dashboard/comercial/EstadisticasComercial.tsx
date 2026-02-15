'use client';

import { useEffect, useState } from 'react';

interface Estadisticas {
  usuariosActivos: number;
  totalUsuarios: number;
  cursosCompletados: number;
  usuariosNuevos: number;
  enrollmentsActivos: number;
  progresoPromedio: number;
  leccionesCompletadas: number;
  tasaConversion: number;
  promedioCalificacion: number;
}

export default function EstadisticasComercial() {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/comercial/estadisticas');
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios.toLocaleString(),
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Usuarios Activos',
      value: stats.usuariosActivos.toLocaleString(),
      subtitle: 'últimos 30 días',
      icon: '✨',
      color: 'bg-green-500',
    },
    {
      title: 'Usuarios Nuevos',
      value: stats.usuariosNuevos.toLocaleString(),
      subtitle: 'últimos 7 días',
      icon: '🎯',
      color: 'bg-purple-500',
    },
    {
      title: 'Enrollments Activos',
      value: stats.enrollmentsActivos.toLocaleString(),
      icon: '📚',
      color: 'bg-yellow-500',
    },
    {
      title: 'Cursos Completados',
      value: stats.cursosCompletados.toLocaleString(),
      subtitle: 'este mes',
      icon: '🎓',
      color: 'bg-indigo-500',
    },
    {
      title: 'Progreso Promedio',
      value: `${stats.progresoPromedio.toFixed(1)}%`,
      icon: '📈',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
        <p className="text-sm text-gray-600 mt-1">
          Métricas clave de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                )}
              </div>
              <div
                className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas Adicionales
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lecciones Completadas</span>
              <span className="font-semibold text-gray-900">
                {stats.leccionesCompletadas}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasa de Conversión</span>
              <span className="font-semibold text-gray-900">
                {(stats.tasaConversion * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Calificación Promedio</span>
              <span className="font-semibold text-gray-900">
                {stats.promedioCalificacion}/5.0
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • {stats.usuariosActivos} de {stats.totalUsuarios} usuarios han estado activos recientemente
            </p>
            <p>
              • {stats.enrollmentsActivos} estudiantes están actualmente tomando cursos
            </p>
            <p>
              • {stats.cursosCompletados} cursos completados este mes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
