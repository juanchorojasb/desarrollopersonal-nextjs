'use client';
import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Crown,
  Calendar,
  CreditCard,
  ArrowRight,
  Download,
  Mail,
  Loader
} from 'lucide-react';
import { geolocationService } from '@/lib/geolocation';

interface PaymentData {
  transaction: {
    id: string;
    referenceCode: string;
    status: string;
    amount: number;
    currency: string;
    country: string;
    formattedAmount: string;
    paymentMethod: string;
    processedAt: string;
  };
  subscription: {
    id: string;
    status: string;
    plan: {
      name: string;
      description: string;
    };
    currentPeriodEnd: string;
  };
}

function PaymentSuccessContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const referenceCode = searchParams.get('referenceCode');
    const transactionId = searchParams.get('transactionId');

    if (referenceCode || transactionId) {
      verifyPayment(referenceCode, transactionId);
    } else {
      setError('No se encontraron datos de pago');
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (referenceCode?: string | null, transactionId?: string | null) => {
    try {
      const params = new URLSearchParams();
      if (referenceCode) params.set('referenceCode', referenceCode);
      if (transactionId) params.set('transactionId', transactionId);

      const response = await fetch(`/api/payu/create-payment?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPaymentData(data);
      } else {
        setError(data.error || 'Error verificando el pago');
      }
    } catch (error) {
      setError('Error conectando con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Verificando tu pago...</h1>
          <p className="text-gray-600">Por favor espera mientras confirmamos tu suscripción</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Error de Verificación</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                href="/dashboard/mi-plan"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors inline-block"
              >
                Verificar Estado de Suscripción
              </Link>
              <Link
                href="/dashboard/ayuda"
                className="block text-indigo-600 hover:text-indigo-700 text-sm"
              >
                Contactar Soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron datos de pago</h1>
          <Link href="/pricing" className="text-indigo-600 hover:text-indigo-700">
            Ver planes disponibles
          </Link>
        </div>
      </div>
    );
  }

  const isActive = paymentData.transaction.status === 'APPROVED' && paymentData.subscription.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isActive ? '¡Pago Exitoso!' : 'Pago Procesado'}
          </h1>
          <p className="text-lg text-gray-600">
            {isActive 
              ? 'Tu suscripción ha sido activada exitosamente'
              : 'Tu pago está siendo procesado'
            }
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Detalles del Pago
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Monto</div>
                <div className="font-semibold text-lg">
                  {paymentData.transaction.formattedAmount}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Método de Pago</div>
                <div className="font-medium">
                  {paymentData.transaction.paymentMethod || 'PayU Latam'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Estado</div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isActive ? 'Aprobado' : 'Procesando'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Código de Referencia</div>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {paymentData.transaction.referenceCode}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Fecha de Procesamiento</div>
                <div className="font-medium">
                  {formatDate(paymentData.transaction.processedAt)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">ID de Transacción</div>
                <div className="font-mono text-sm text-gray-600">
                  {paymentData.transaction.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        {paymentData.subscription && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Tu Suscripción
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Plan Activado</div>
                <div className="font-semibold text-lg mb-2">
                  {paymentData.subscription.plan.description || paymentData.subscription.plan.name}
                </div>
                <div className="text-gray-600">
                  {paymentData.subscription.plan.description}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Válido hasta</div>
                <div className="font-semibold text-lg mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                  {formatDate(paymentData.subscription.currentPeriodEnd)}
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  paymentData.subscription.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {paymentData.subscription.status === 'ACTIVE' ? 'Activo' : 'Procesando'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-indigo-900 mb-4">¿Qué sigue?</h2>
          
          <div className="space-y-4">
            {isActive ? (
              <>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-indigo-900">Accede a tu dashboard</div>
                    <div className="text-indigo-700 text-sm">
                      Explora todos los cursos y talleres disponibles en tu plan
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-indigo-900">Revisa tu email</div>
                    <div className="text-indigo-700 text-sm">
                      Te hemos enviado la confirmación y detalles de facturación
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-indigo-900">Comienza tu transformación</div>
                    <div className="text-indigo-700 text-sm">
                      Empieza con los cursos recomendados para tu nivel
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-indigo-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-indigo-900">Confirmación en proceso</div>
                  <div className="text-indigo-700 text-sm">
                    Te notificaremos por email una vez que se confirme tu pago. 
                    Esto puede tomar unos minutos.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isActive ? (
            <>
              <Link
                href="/dashboard/cursos"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Explorar Cursos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                href="/dashboard/mi-plan"
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Ver Mi Plan
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Ir al Dashboard
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Verificar Estado
              </button>
            </>
          )}
        </div>

        {/* Receipt Download */}
        <div className="text-center mt-8">
          <button className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center mx-auto">
            <Download className="w-4 h-4 mr-1" />
            Descargar Comprobante
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}