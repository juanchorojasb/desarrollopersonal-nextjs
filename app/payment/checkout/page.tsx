'use client';
import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  Shield,
  Globe,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { geolocationService } from '@/lib/geolocation';

interface Plan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  features: string[];
  pricing: {
    monthly: { COP: number; USD: number };
    quarterly: { COP: number; USD: number };
  };
}

const AVAILABLE_PLANS: Record<string, Plan> = {
  basic: {
    id: 'basic',
    name: 'basic',
    displayName: 'Plan Básico',
    description: 'Perfecto para comenzar tu viaje de desarrollo personal',
    features: [
      'Acceso a cursos básicos grabados',
      'Biblioteca de recursos descargables',
      'Acceso a la comunidad',
      'Certificados básicos'
    ],
    pricing: {
      monthly: { COP: 19900, USD: 5.99 },
      quarterly: { COP: 53730, USD: 16.17 } // 10% discount
    }
  },
  premium: {
    id: 'premium',
    name: 'premium',
    displayName: 'Plan Premium',
    description: 'Acceso completo para transformar tu vida',
    features: [
      'Acceso completo a todos los cursos',
      'Talleres en vivo exclusivos',
      'Sesiones de coaching grupal',
      'Certificados oficiales',
      'Soporte prioritario',
      'Recursos premium'
    ],
    pricing: {
      monthly: { COP: 39900, USD: 11.99 },
      quarterly: { COP: 107730, USD: 32.37 } // 10% discount
    }
  },
  premiumPlus: {
    id: 'premiumPlus',
    name: 'premiumPlus',
    displayName: 'Plan Premium Plus',
    description: 'Para profesionales del desarrollo personal',
    features: [
      'Todo lo del Plan Premium',
      'Consultoría 1:1 mensual',
      'Acceso a herramientas de coaching',
      'Certificación como coach',
      'Red de profesionales exclusiva',
      'Oportunidades de revenue sharing'
    ],
    pricing: {
      monthly: { COP: 59900, USD: 17.99 },
      quarterly: { COP: 161730, USD: 48.57 } // 10% discount
    }
  }
};

function CheckoutContent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { country, countryInfo, currency, loading: geoLoading, setCountry } = useGeolocation();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCountrySelector, setShowCountrySelector] = useState(false);

  useEffect(() => {
    const planId = searchParams.get('plan') || 'premium';
    const cycle = searchParams.get('cycle') || 'monthly';
    
    setSelectedPlan(AVAILABLE_PLANS[planId] || AVAILABLE_PLANS.premium);
    setBillingCycle(cycle as 'monthly' | 'quarterly');
  }, [searchParams]);

  const handleCountryChange = (countryCode: string) => {
    setCountry(countryCode);
    setShowCountrySelector(false);
  };

  const getCurrentPrice = () => {
    if (!selectedPlan) return { amount: 0, formatted: '$0' };
    
    const amount = selectedPlan.pricing[billingCycle][currency as 'COP' | 'USD'];
    const formatted = geolocationService.formatCurrency(amount, currency);
    
    return { amount, formatted };
  };

  const getSavingsText = () => {
    if (!selectedPlan || billingCycle !== 'quarterly') return null;
    
    const monthlyPrice = selectedPlan.pricing.monthly[currency as 'COP' | 'USD'];
    const quarterlyPrice = selectedPlan.pricing.quarterly[currency as 'COP' | 'USD'];
    const monthlyTotal = monthlyPrice * 3;
    const savings = monthlyTotal - quarterlyPrice;
    
    return `Ahorras ${geolocationService.formatCurrency(savings, currency)}`;
  };

  const handleCheckout = async () => {
    if (!user || !selectedPlan) {
      router.push('/sign-in?redirect=/payment/checkout');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payu/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.name,
          billingCycle: billingCycle,
          country: country
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error creando el pago');
      }

      // Redirigir a PayU
      window.location.href = data.payment.checkoutUrl;

    } catch (error) {
      console.error('Error creating payment:', error);
      setError(error instanceof Error ? error.message : 'Error procesando el pago');
    } finally {
      setProcessing(false);
    }
  };

  if (geoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Detectando tu ubicación...</p>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Plan no encontrado</h1>
          <Link href="/pricing" className="text-indigo-600 hover:text-indigo-700">
            Ver planes disponibles
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = getCurrentPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pricing" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Planes
            </Link>
            <div className="text-sm text-gray-500">
              Checkout Seguro <Shield className="w-4 h-4 inline ml-1" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
              <p className="text-gray-600">
                Estás a un paso de transformar tu vida con {selectedPlan.displayName}
              </p>
            </div>

            {/* Country & Currency Selector */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                País y Moneda
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowCountrySelector(!showCountrySelector)}
                  className="w-full flex items-center justify-between p-3 border rounded-md hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{countryInfo.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{countryInfo.name}</div>
                      <div className="text-sm text-gray-500">
                        Pagos en {countryInfo.currency}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>

                {showCountrySelector && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                    {Object.values(geolocationService.getSupportedCountries()).map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryChange(country.code)}
                        className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-2xl mr-3">{country.flag}</span>
                        <div className="text-left">
                          <div className="font-medium">{country.name}</div>
                          <div className="text-sm text-gray-500">
                            Pagos en {country.currency}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del Plan</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedPlan.displayName}</h4>
                    <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg text-gray-900">
                      {currentPrice.formatted}
                    </div>
                    <div className="text-sm text-gray-500">
                      /{billingCycle === 'monthly' ? 'mes' : 'trimestre'}
                    </div>
                  </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="billing"
                        checked={billingCycle === 'monthly'}
                        onChange={() => setBillingCycle('monthly')}
                        className="mr-2"
                      />
                      <span>Mensual</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="billing"
                        checked={billingCycle === 'quarterly'}
                        onChange={() => setBillingCycle('quarterly')}
                        className="mr-2"
                      />
                      <span>Trimestral</span>
                      {getSavingsText() && (
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          ({getSavingsText()})
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Incluye:</h5>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium text-gray-900">Total a Pagar</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {currentPrice.formatted}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Facturación {billingCycle === 'monthly' ? 'mensual' : 'trimestral'} • 
                Cancela cuando quieras
              </p>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-6">
            {/* User Info */}
            {user && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.fullName || user.emailAddresses[0]?.emailAddress}
                    </div>
                    <div className="text-sm text-gray-600">
                      {user.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Método de Pago
              </h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium">PayU Latam</span>
                    </div>
                    <span className="text-sm text-gray-500">Seguro</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Tarjetas de crédito/débito, PSE, efectivo y más
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <img src="/images/visa.png" alt="Visa" className="h-6" />
                    <img src="/images/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="/images/pse.png" alt="PSE" className="h-6" />
                    <span className="text-xs text-gray-500">+más</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-start">
                    <Shield className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Pago 100% seguro con encriptación SSL</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Activación inmediata tras confirmación de pago</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Procesamiento local en {countryInfo.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-800">Error en el pago</div>
                    <div className="text-sm text-red-600 mt-1">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  Proceder al Pago • {currentPrice.formatted}
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              Al proceder, aceptas nuestros{' '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-700">
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}