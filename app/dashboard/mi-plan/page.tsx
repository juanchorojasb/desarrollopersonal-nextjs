'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Crown,
  Star,
  CheckCircle,
  X,
  CreditCard,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Zap,
  Shield,
  Users,
  BookOpen,
  Video,
  Award
} from 'lucide-react';

interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: PlanFeature[];
  popular: boolean;
  current?: boolean;
}

interface SubscriptionData {
  hasActiveSubscription: boolean;
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    plan: {
      id: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      billingPeriod: string;
    };
  } | null;
}

// Mock plans data - in production this would come from API
const availablePlans: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    description: 'Perfecto para comenzar tu viaje de desarrollo personal',
    price: 0,
    currency: 'COP',
    billingPeriod: 'mes',
    popular: false,
    features: [
      {
        id: '1',
        name: 'Acceso limitado a cursos',
        description: 'Solo cursos básicos y contenido gratuito',
        included: true
      },
      {
        id: '2',
        name: 'Videos introductorios',
        description: 'Contenido básico de cada tema',
        included: true
      },
      {
        id: '3',
        name: 'Comunidad básica',
        description: 'Acceso limitado al foro',
        included: true
      },
      {
        id: '4',
        name: 'Talleres premium',
        description: 'Sesiones en vivo con expertos',
        included: false
      },
      {
        id: '5',
        name: 'Certificados',
        description: 'Diplomas de finalización',
        included: false
      },
      {
        id: '6',
        name: 'Soporte prioritario',
        description: 'Atención personalizada',
        included: false
      }
    ]
  },
  {
    id: 'basic',
    name: 'Básico',
    description: 'Acceso completo a todos los cursos grabados',
    price: 25000,
    currency: 'COP',
    billingPeriod: 'mes',
    popular: false,
    features: [
      {
        id: '1',
        name: 'Acceso a todos los cursos',
        description: '7 cursos especializados completos',
        included: true
      },
      {
        id: '2',
        name: 'Videos HD sin límites',
        description: '39 sesiones de contenido premium',
        included: true
      },
      {
        id: '3',
        name: 'Progreso personalizado',
        description: 'Seguimiento de tu avance',
        included: true
      },
      {
        id: '4',
        name: 'Certificados',
        description: 'Diplomas de finalización',
        included: true
      },
      {
        id: '5',
        name: 'Acceso móvil',
        description: 'Descarga offline disponible',
        included: true
      },
      {
        id: '6',
        name: 'Talleres en vivo',
        description: 'Sesiones exclusivas con expertos',
        included: false
      }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Acceso completo para transformar tu vida',
    price: 80000,
    currency: 'COP',
    billingPeriod: 'mes',
    popular: true,
    features: [
      {
        id: '1',
        name: 'Acceso completo a cursos',
        description: 'Todos los cursos y contenido premium',
        included: true
      },
      {
        id: '2',
        name: 'Videos HD sin límites',
        description: 'Contenido en alta calidad',
        included: true
      },
      {
        id: '3',
        name: 'Comunidad VIP',
        description: 'Acceso completo al foro y grupos',
        included: true
      },
      {
        id: '4',
        name: 'Talleres en vivo',
        description: 'Sesiones exclusivas con expertos',
        included: true
      },
      {
        id: '5',
        name: 'Certificados oficiales',
        description: 'Diplomas verificables',
        included: true
      },
      {
        id: '6',
        name: 'Soporte VIP',
        description: 'Atención prioritaria 24/7',
        included: true
      }
    ]
  },
  {
    id: 'pro',
    name: 'Profesional',
    description: 'Para coaches y profesionales del desarrollo personal',
    price: 140000,
    currency: 'COP',
    billingPeriod: 'mes',
    popular: false,
    features: [
      {
        id: '1',
        name: 'Todo lo de Premium',
        description: 'Acceso completo a la plataforma',
        included: true
      },
      {
        id: '2',
        name: 'Recursos para coaches',
        description: 'Herramientas y plantillas profesionales',
        included: true
      },
      {
        id: '3',
        name: 'Sesiones 1:1',
        description: 'Mentorías personalizadas mensuales',
        included: true
      },
      {
        id: '4',
        name: 'Certificación oficial',
        description: 'Programa de certificación como coach',
        included: true
      },
      {
        id: '5',
        name: 'Red de profesionales',
        description: 'Acceso exclusivo a la red PRO',
        included: true
      },
      {
        id: '6',
        name: 'Revenue sharing',
        description: 'Oportunidades de monetización',
        included: true
      }
    ]
  }
];

export default function MiPlanPage() {
  const { user } = useUser();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscriptions/check');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId);
    // In production, this would make an API call to change the plan
    // For now, just redirect to pricing page
    window.location.href = '/pricing';
  };

  const handleCancelSubscription = async () => {
    try {
      // In production, this would make an API call to cancel
      setShowCancelModal(false);
      // Show success message and refresh data
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const currentPlan = availablePlans.find(plan => {
    if (!subscriptionData?.hasActiveSubscription) return plan.id === 'free';
    return plan.name.toLowerCase() === subscriptionData.subscription?.plan.name.toLowerCase();
  }) || availablePlans[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Plan</h1>
          <p className="text-gray-600">
            Administra tu suscripción y explora opciones de actualización
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {currentPlan.id === 'free' ? (
                <Star className="w-8 h-8 text-gray-400 mr-3" />
              ) : (
                <Crown className="w-8 h-8 text-yellow-500 mr-3" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Plan {currentPlan.name}
                </h2>
                <p className="text-gray-600">{currentPlan.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(currentPlan.price, currentPlan.currency)}
              </div>
              {currentPlan.price > 0 && (
                <div className="text-sm text-gray-600">por {currentPlan.billingPeriod}</div>
              )}
            </div>
          </div>

          {subscriptionData?.hasActiveSubscription && subscriptionData.subscription && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className="ml-2 font-medium text-green-600">Activo</span>
                </div>
                <div>
                  <span className="text-gray-600">Próximo cobro:</span>
                  <span className="ml-2 font-medium">
                    {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Comparison */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comparar Planes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${
                  plan.id === currentPlan.id
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : plan.popular
                    ? 'border-yellow-300'
                    : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                      Más Popular
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {plan.id === currentPlan.id && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Plan Actual
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 ml-1">/{plan.billingPeriod}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <div key={feature.id} className="flex items-start">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div>
                  {plan.id === currentPlan.id ? (
                    <div className="w-full text-center py-2 text-indigo-600 font-medium">
                      Plan Actual
                    </div>
                  ) : plan.price > currentPlan.price ? (
                    <button
                      onClick={() => handlePlanChange(plan.id)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Actualizar a {plan.name}
                    </button>
                  ) : plan.price < currentPlan.price ? (
                    <button
                      onClick={() => handlePlanChange(plan.id)}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cambiar a {plan.name}
                    </button>
                  ) : (
                    <Link
                      href="/pricing"
                      className="w-full block text-center bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Comenzar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Por qué actualizar a Premium?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Acceso ilimitado a todos los cursos</span>
              </div>
              <div className="flex items-center">
                <Video className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Talleres en vivo exclusivos</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Certificados oficiales</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Comunidad VIP</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Soporte prioritario</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gestión de Suscripción
            </h3>
            <div className="space-y-4">
              <Link
                href="/billing"
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Método de Pago</div>
                  <div className="text-sm text-gray-600">Actualizar tarjeta y datos de facturación</div>
                </div>
              </Link>

              <Link
                href="/billing/history"
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Historial de Pagos</div>
                  <div className="text-sm text-gray-600">Ver facturas y recibos</div>
                </div>
              </Link>

              {subscriptionData?.hasActiveSubscription && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center w-full p-3 border border-red-200 rounded-md hover:bg-red-50 transition-colors text-left"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-red-900">Cancelar Suscripción</div>
                    <div className="text-sm text-red-600">Terminar suscripción actual</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Cancelar Suscripción?
              </h3>
              <p className="text-gray-600 mb-6">
                Al cancelar tu suscripción, perderás acceso a los beneficios premium al final del período actual.
                ¿Estás seguro de que quieres continuar?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Mantener Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}