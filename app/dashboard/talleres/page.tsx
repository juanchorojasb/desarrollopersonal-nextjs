'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import WorkshopCalendar from '@/components/workshops/WorkshopCalendar';
import WorkshopModal from '@/components/workshops/WorkshopModal';
import {
  Calendar,
  Clock,
  Users,
  Video,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Search,
  MapPin,
  Crown
} from 'lucide-react';

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  enrolled: number;
  price: number;
  isLive: boolean;
  isPremium: boolean;
  category: string;
  status: 'upcoming' | 'live' | 'completed';
  meetingUrl?: string;
  recordingUrl?: string;
  materials?: string[];
}

// Mock data for workshops - in production this would come from API
const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'Meditación para Principiantes',
    description: 'Aprende las técnicas básicas de meditación mindfulness para reducir el estrés y mejorar tu bienestar mental.',
    instructor: 'Dra. María González',
    instructorBio: 'Psicóloga clínica especializada en mindfulness con 10+ años de experiencia',
    date: '2025-01-15',
    startTime: '19:00',
    endTime: '20:30',
    duration: 90,
    capacity: 50,
    enrolled: 32,
    price: 0,
    isLive: false,
    isPremium: false,
    category: 'Mindfulness',
    status: 'upcoming',
    meetingUrl: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Gestión Avanzada del Tiempo',
    description: 'Técnicas profesionales para maximizar tu productividad y alcanzar tus metas más rápido.',
    instructor: 'Carlos Rodriguez',
    instructorBio: 'Coach ejecutivo y consultor en productividad empresarial',
    date: '2025-01-12',
    startTime: '20:00',
    endTime: '21:00',
    duration: 60,
    capacity: 30,
    enrolled: 28,
    price: 25000,
    isLive: true,
    isPremium: true,
    category: 'Productividad',
    status: 'live',
    meetingUrl: 'https://zoom.us/j/123456789'
  },
  {
    id: '3',
    title: 'Inteligencia Emocional en el Trabajo',
    description: 'Desarrolla habilidades emocionales para mejorar tus relaciones laborales y liderazgo.',
    instructor: 'Ana Patricia Silva',
    instructorBio: 'Psicóloga organizacional con especialización en liderazgo emocional',
    date: '2025-01-18',
    startTime: '18:00',
    endTime: '19:30',
    duration: 90,
    capacity: 40,
    enrolled: 15,
    price: 35000,
    isLive: false,
    isPremium: true,
    category: 'Desarrollo Personal',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Hábitos que Transforman tu Vida',
    description: 'Masterclass sobre cómo crear y mantener hábitos positivos que generen cambios duraderos.',
    instructor: 'Dr. Luis Mendoza',
    date: '2025-01-08',
    startTime: '19:00',
    endTime: '20:00',
    duration: 60,
    capacity: 100,
    enrolled: 85,
    price: 0,
    isLive: false,
    isPremium: false,
    category: 'Hábitos',
    status: 'completed',
    recordingUrl: 'https://vimeo.com/recording/12345'
  }
];

export default function TalleresPage() {
  const { user } = useUser();
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [searchTerm, selectedCategory, selectedStatus, workshops]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscriptions/check');
      if (response.ok) {
        const data = await response.json();
        setHasActiveSubscription(data.hasActiveSubscription);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkshops = () => {
    let filtered = workshops;

    if (searchTerm) {
      filtered = filtered.filter(workshop =>
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(workshop => workshop.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(workshop => workshop.status === selectedStatus);
    }

    setFilteredWorkshops(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const getStatusBadge = (status: string, isLive: boolean) => {
    if (isLive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-1 animate-pulse"></div>
          En Vivo
        </span>
      );
    }

    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-3 h-3 mr-1" />
            Próximo
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Finalizado
          </span>
        );
      default:
        return null;
    }
  };

  const canAccessWorkshop = (workshop: Workshop) => {
    if (!workshop.isPremium) return true;
    return hasActiveSubscription;
  };

  const categories = Array.from(new Set(workshops.map(w => w.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Talleres en Vivo</h1>
          <p className="text-gray-600">
            Participa en sesiones interactivas con expertos en desarrollo personal
          </p>
        </div>

        {/* Subscription Notice */}
        {!hasActiveSubscription && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Crown className="w-5 h-5 text-yellow-600 mr-2" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">Acceso Premium</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Algunos talleres requieren suscripción premium. 
                  <Link href="/pricing" className="font-medium underline ml-1">
                    Ver planes disponibles
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vista Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vista Calendario
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar talleres..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="upcoming">Próximos</option>
              <option value="live">En vivo</option>
              <option value="completed">Completados</option>
            </select>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'calendar' ? (
          <WorkshopCalendar
            workshops={filteredWorkshops}
            hasActiveSubscription={hasActiveSubscription}
            onWorkshopClick={setSelectedWorkshop}
          />
        ) : (
          /* Workshops Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <div
              key={workshop.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {workshop.title}
                    </h3>
                    {getStatusBadge(workshop.status, workshop.isLive)}
                  </div>
                  {workshop.isPremium && (
                    <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {workshop.description}
                </p>

                {/* Instructor */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900">{workshop.instructor}</p>
                  {workshop.instructorBio && (
                    <p className="text-xs text-gray-600 mt-1">{workshop.instructorBio}</p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(workshop.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {workshop.startTime} - {workshop.endTime} ({workshop.duration} min)
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {workshop.enrolled}/{workshop.capacity} participantes
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(workshop.price)}
                  </span>
                  {workshop.isPremium && !hasActiveSubscription && (
                    <span className="text-xs text-orange-600 ml-2">Requiere suscripción</span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {workshop.status === 'live' && canAccessWorkshop(workshop) && (
                    <a
                      href={workshop.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Unirse Ahora
                    </a>
                  )}
                  
                  {workshop.status === 'upcoming' && canAccessWorkshop(workshop) && (
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
                      <Calendar className="w-4 h-4 mr-2" />
                      Registrarse
                    </button>
                  )}
                  
                  {workshop.status === 'completed' && workshop.recordingUrl && canAccessWorkshop(workshop) && (
                    <a
                      href={workshop.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Ver Grabación
                    </a>
                  )}
                  
                  {!canAccessWorkshop(workshop) && (
                    <Link
                      href="/pricing"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-800 font-medium rounded-md hover:bg-yellow-200 transition-colors"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Actualizar Plan
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {filteredWorkshops.length === 0 && viewMode === 'grid' && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron talleres</h3>
            <p className="text-gray-600 mb-4">
              No hay talleres que coincidan con tus criterios de búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Mostrar todos los talleres
            </button>
          </div>
        )}

        {/* Workshop Modal */}
        <WorkshopModal
          workshop={selectedWorkshop}
          hasActiveSubscription={hasActiveSubscription}
          onClose={() => setSelectedWorkshop(null)}
          onRegister={(workshopId) => {
            console.log('Register for workshop:', workshopId);
            // In production, make API call to register
            setSelectedWorkshop(null);
          }}
          onJoin={(workshopId) => {
            console.log('Join workshop:', workshopId);
            // In production, redirect to meeting URL
            if (selectedWorkshop?.meetingUrl) {
              window.open(selectedWorkshop.meetingUrl, '_blank');
            }
            setSelectedWorkshop(null);
          }}
        />
      </div>
    </div>
  );
}