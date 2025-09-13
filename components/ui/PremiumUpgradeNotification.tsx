'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Crown, Star, MessageSquare, Users } from 'lucide-react';

interface PremiumUpgradeNotificationProps {
  userPlan: string;
  context?: 'forum' | 'courses' | 'general';
  onClose?: () => void;
}

export default function PremiumUpgradeNotification({ 
  userPlan, 
  context = 'general',
  onClose 
}: PremiumUpgradeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || userPlan === 'completo' || userPlan === 'personal') {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getContextMessage = () => {
    switch (context) {
      case 'forum':
        return {
          title: 'Acceso Limitado al Foro',
          message: 'Tienes acceso básico, pero los miembros premium pueden crear posts ilimitados y acceder a categorías exclusivas.',
          features: ['Posts ilimitados', 'Categorías exclusivas', 'Respuestas prioritarias', 'Sin anuncios']
        };
      case 'courses':
        return {
          title: 'Desbloquea Todos los Cursos',
          message: 'Accede a nuestra biblioteca completa de cursos premium y contenido exclusivo.',
          features: ['Todos los cursos', 'Contenido exclusivo', 'Certificados', 'Soporte personalizado']
        };
      default:
        return {
          title: 'Mejora tu Experiencia',
          message: 'Desbloquea todo el potencial de tu desarrollo personal con nuestros planes premium.',
          features: ['Contenido exclusivo', 'Comunidad premium', 'Soporte personalizado', 'Sin limitaciones']
        };
    }
  };

  const contextInfo = getContextMessage();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {contextInfo.title}
            </h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Plan {userPlan}
            </span>
          </div>

          <p className="text-gray-600 mb-3">
            {contextInfo.message}
          </p>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {contextInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              <Crown className="w-4 h-4 mr-2" />
              Ver Planes Premium
            </Link>
            <Link
              href="/dashboard/mi-plan"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Comparar Planes
            </Link>
          </div>
        </div>
      </div>

      {/* Progress indicator for free users */}
      {userPlan === 'free' && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tu progreso hacia premium:</span>
            <span className="text-blue-600 font-medium">25% completado</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-1/4"></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Sigue explorando para desbloquear más beneficios
          </p>
        </div>
      )}
    </div>
  );
}
