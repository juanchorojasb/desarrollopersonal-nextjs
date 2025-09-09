'use client';
import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  Crown,
  Video,
  Star
} from 'lucide-react';

interface Workshop {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  instructor: string;
  isPremium: boolean;
  isLive: boolean;
  enrolled: number;
  capacity: number;
}

interface WorkshopCalendarProps {
  workshops: Workshop[];
  hasActiveSubscription: boolean;
  onWorkshopClick: (workshop: Workshop) => void;
}

export default function WorkshopCalendar({ 
  workshops, 
  hasActiveSubscription, 
  onWorkshopClick 
}: WorkshopCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the first day of the month and how many days it has
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Create calendar grid
  const calendarDays = useMemo(() => {
    const days = [];

    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
      });
    }

    // Current month's days
    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        isCurrentMonth: true,
        fullDate: new Date(currentYear, currentMonth, date)
      });
    }

    // Next month's leading days to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth + 1, date)
      });
    }

    return days;
  }, [currentMonth, currentYear, firstDayOfMonth, daysInMonth, daysInPrevMonth]);

  // Get workshops for a specific date
  const getWorkshopsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workshops.filter(workshop => workshop.date === dateStr);
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
          >
            Hoy
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayWorkshops = getWorkshopsForDate(day.fullDate);
            const hasWorkshops = dayWorkshops.length > 0;
            
            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-gray-100 rounded-md ${
                  !day.isCurrentMonth 
                    ? 'bg-gray-50 text-gray-400' 
                    : isToday(day.fullDate)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white hover:bg-gray-50'
                } ${hasWorkshops ? 'cursor-pointer' : ''} transition-colors`}
                onClick={() => hasWorkshops && dayWorkshops.length === 1 && onWorkshopClick(dayWorkshops[0])}
              >
                <div className="text-sm font-medium mb-1">
                  {day.date}
                </div>
                
                {/* Workshop indicators */}
                <div className="space-y-1">
                  {dayWorkshops.slice(0, 2).map((workshop) => (
                    <div
                      key={workshop.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkshopClick(workshop);
                      }}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${
                        workshop.isPremium
                          ? hasActiveSubscription
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-500'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                      title={workshop.title}
                    >
                      <div className="flex items-center space-x-1">
                        {workshop.isPremium && <Crown className="w-3 h-3" />}
                        {workshop.isLive && <Video className="w-3 h-3" />}
                        <span className="truncate">{workshop.title}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{workshop.startTime}</span>
                      </div>
                    </div>
                  ))}
                  
                  {dayWorkshops.length > 2 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayWorkshops.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span className="text-gray-600">Talleres Gratuitos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
            <Crown className="w-3 h-3 text-yellow-600 mr-1" />
            <span className="text-gray-600">Talleres Premium</span>
          </div>
          <div className="flex items-center">
            <Video className="w-3 h-3 text-red-500 mr-2" />
            <span className="text-gray-600">En Vivo</span>
          </div>
          {!hasActiveSubscription && (
            <div className="ml-auto text-xs text-orange-600">
              * Los talleres premium requieren suscripción activa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}