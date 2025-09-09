'use client';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Crown, 
  Video, 
  ExternalLink,
  User,
  Star,
  CheckCircle,
  AlertCircle
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

interface WorkshopModalProps {
  workshop: Workshop | null;
  hasActiveSubscription: boolean;
  onClose: () => void;
  onRegister?: (workshopId: string) => void;
  onJoin?: (workshopId: string) => void;
}

export default function WorkshopModal({
  workshop,
  hasActiveSubscription,
  onClose,
  onRegister,
  onJoin
}: WorkshopModalProps) {
  if (!workshop) return null;

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

  const canAccess = !workshop.isPremium || hasActiveSubscription;
  const spotsLeft = workshop.capacity - workshop.enrolled;

  const getActionButton = () => {
    if (!canAccess) {
      return (
        <button className="w-full bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg font-medium hover:bg-yellow-200 transition-colors flex items-center justify-center">
          <Crown className="w-5 h-5 mr-2" />
          Requiere Suscripción Premium
        </button>
      );
    }

    switch (workshop.status) {
      case 'live':
        return (
          <button 
            onClick={() => onJoin && onJoin(workshop.id)}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
          >
            <Video className="w-5 h-5 mr-2" />
            Unirse al Taller en Vivo
          </button>
        );
      case 'upcoming':
        if (spotsLeft === 0) {
          return (
            <button 
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Taller Lleno
            </button>
          );
        }
        return (
          <button 
            onClick={() => onRegister && onRegister(workshop.id)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Registrarse al Taller
          </button>
        );
      case 'completed':
        return workshop.recordingUrl ? (
          <a
            href={workshop.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Video className="w-5 h-5 mr-2" />
            Ver Grabación
          </a>
        ) : (
          <button 
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center"
          >
            Taller Finalizado
          </button>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    if (workshop.isLive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
          En Vivo
        </span>
      );
    }

    switch (workshop.status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-4 h-4 mr-1" />
            Próximo
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Finalizado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900 mr-3">{workshop.title}</h2>
              {workshop.isPremium && <Crown className="w-6 h-6 text-yellow-500" />}
            </div>
            <div className="flex items-center space-x-4 mb-3">
              {getStatusBadge()}
              <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                {workshop.category}
              </span>
            </div>
            <div className="text-lg font-semibold text-indigo-600">
              {formatPrice(workshop.price)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Workshop Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Detalles del Taller</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>{formatDate(workshop.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{workshop.startTime} - {workshop.endTime} ({workshop.duration} min)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>{workshop.enrolled}/{workshop.capacity} participantes</span>
                </div>
                {spotsLeft > 0 && spotsLeft <= 5 && (
                  <div className="flex items-center text-orange-600">
                    <AlertCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Solo {spotsLeft} cupos disponibles</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Instructor</h3>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{workshop.instructor}</h4>
                  {workshop.instructorBio && (
                    <p className="text-sm text-gray-600 mt-1">{workshop.instructorBio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{workshop.description}</p>
          </div>

          {/* Materials */}
          {workshop.materials && workshop.materials.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Materiales Incluidos</h3>
              <ul className="space-y-2">
                {workshop.materials.map((material, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Capacity Warning */}
          {!canAccess && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Crown className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">Taller Premium</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Este taller requiere una suscripción premium activa para participar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Cupos ocupados</span>
              <span className="text-sm text-gray-500">
                {workshop.enrolled}/{workshop.capacity}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          {getActionButton()}

          {/* Additional Links */}
          {!canAccess && (
            <div className="mt-4 text-center">
              <a
                href="/pricing"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Ver Planes de Suscripción →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}