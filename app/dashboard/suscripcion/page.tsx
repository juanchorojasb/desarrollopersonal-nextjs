'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Star,
  Crown
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  isActive: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  plan: SubscriptionPlan;
}

interface SubscriptionData {
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
  message?: string;
}

export default function SuscripcionPage() {
  const { user } = useUser();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions/check');
      
      if (!response.ok) {
        throw new Error('Error al cargar información de suscripción');
      }
      
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchSubscriptionData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Suscripción</h1>
          <p className="text-gray-600">Gestiona tu plan y beneficios de DesarrolloPersonal.uno</p>
        </div>

        {/* Current Subscription Status */}
        <div className="grid gap-6 mb-8">
          {subscriptionData?.hasActiveSubscription ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Crown className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Plan Activo</h2>
                    <p className="text-gray-600">Tu suscripción está activa</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Activo
                </span>
              </div>
              
              {subscriptionData.subscription && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        {subscriptionData.subscription.plan.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {subscriptionData.subscription.plan.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio:</span>
                          <span className="font-semibold">
                            {formatPrice(
                              subscriptionData.subscription.plan.price,
                              subscriptionData.subscription.plan.currency
                            )}
                            /{subscriptionData.subscription.plan.billingPeriod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Período actual:</span>
                          <span className="font-semibold">
                            {formatDate(subscriptionData.subscription.currentPeriodStart)} - {formatDate(subscriptionData.subscription.currentPeriodEnd)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Próximo cobro:</span>
                          <span className="font-semibold">
                            {formatDate(subscriptionData.subscription.currentPeriodEnd)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Beneficios Incluidos</h4>
                      <ul className="space-y-2">
                        {subscriptionData.subscription.plan.features?.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        )) || [
                          <li key="default1" className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Acceso completo a todos los cursos</span>
                          </li>,
                          <li key="default2" className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Talleres en vivo exclusivos</span>
                          </li>,
                          <li key="default3" className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Certificados de finalización</span>
                          </li>,
                          <li key="default4" className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">Soporte prioritario</span>
                          </li>
                        ]}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin Suscripción Activa</h2>
                <p className="text-gray-600 mb-6">
                  Actualmente no tienes una suscripción activa. Suscríbete para acceder a todos los cursos y beneficios premium.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Ver Planes Disponibles
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/dashboard/cursos"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Mis Cursos</h3>
            <p className="text-sm text-gray-600">Accede a tu biblioteca de cursos</p>
          </Link>

          <Link
            href="/dashboard/talleres"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Talleres en Vivo</h3>
            <p className="text-sm text-gray-600">Próximos talleres y eventos</p>
          </Link>

          <Link
            href="/billing"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Historial de Pagos</h3>
            <p className="text-sm text-gray-600">Revisa tus facturas y pagos</p>
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">¿Necesitas Ayuda?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Gestión de Suscripción</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cambiar plan de suscripción</li>
                <li>• Actualizar método de pago</li>
                <li>• Cancelar suscripción</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Soporte Técnico</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Problemas de acceso a cursos</li>
                <li>• Dificultades con pagos</li>
                <li>• Dudas sobre beneficios</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/ayuda"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Contactar Soporte
              <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}