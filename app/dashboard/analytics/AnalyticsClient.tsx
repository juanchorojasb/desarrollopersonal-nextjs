'use client';

import ProgressChart from '@/components/analytics/ProgressChart';
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap';
import TimeDistribution from '@/components/analytics/TimeDistribution';
import { Calendar, TrendingUp, PieChart } from 'lucide-react';

interface Props {
  progressData: {
    labels: string[];
    points: number[];
  };
  activityHeatmap: {
    date: string;
    count: number;
  }[];
  timeDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
}

export default function AnalyticsClient({ 
  progressData, 
  activityHeatmap, 
  timeDistribution 
}: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Progreso de Puntos */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Progreso de Puntos</h3>
        </div>
        <ProgressChart data={progressData} />
      </div>

      {/* Distribución de Tiempo */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Distribución de Tiempo</h3>
        </div>
        {timeDistribution.length > 0 ? (
          <TimeDistribution data={timeDistribution} />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>No hay datos de tiempo registrados</p>
          </div>
        )}
      </div>

      {/* Calendario de Actividad */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">Calendario de Actividad</h3>
          <span className="text-sm text-gray-500 ml-auto">Últimos 12 semanas</span>
        </div>
        <ActivityHeatmap activities={activityHeatmap} />
      </div>
    </div>
  );
}
