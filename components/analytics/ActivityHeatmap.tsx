'use client';

import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  activities: {
    date: string;
    count: number;
  }[];
}

export default function ActivityHeatmap({ activities }: Props) {
  const today = new Date();
  const weeks = 12;
  const days = weeks * 7;

  // Crear mapa de actividades
  const activityMap = new Map(
    activities.map(a => [a.date, a.count])
  );

  // Generar grid de últimos 84 días (12 semanas)
  const grid: { date: Date; count: number }[][] = [];
  let currentWeek: { date: Date; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = activityMap.get(dateStr) || 0;

    currentWeek.push({ date, count });

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    grid.push(currentWeek);
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 10) return 'bg-green-600';
    return 'bg-green-800';
  };

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        {/* Labels de días */}
        <div className="flex flex-col gap-1 justify-around pr-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-xs text-gray-500 h-3 flex items-center">
              {day}
            </div>
          ))}
        </div>

        {/* Grid de actividad */}
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-all hover:ring-2 hover:ring-indigo-500`}
                title={`${format(day.date, 'PP', { locale: es })}: ${day.count} actividades`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <div className="w-3 h-3 bg-green-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-800 rounded-sm" />
        </div>
        <span>Más</span>
      </div>
    </div>
  );
}
