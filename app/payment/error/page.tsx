'use client';
import { useState, useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  XCircle,
  AlertTriangle,
  CreditCard,
  HelpCircle,
  RefreshCw,
  ArrowLeft,
  Loader
} from 'lucide-react';

interface PaymentError {
  transaction?: {
    id: string;
    referenceCode: string;
    status: string;
    responseMessage: string;
    amount: number;
    currency: string;
    formattedAmount: string;
  };
  error?: string;
  errorCode?: string;
}

const ERROR_MESSAGES: Record<string, { title: string; description: string; action: string }> = {
  'DECLINED': {
    title: 'Pago Rechazado',
    description: 'Tu banco o entidad financiera ha rechazado la transacción.',
    action: 'Verifica los datos de tu tarjeta o contacta a tu banco'
  },
  'INSUFFICIENT_FUNDS': {
    title: 'Fondos Insuficientes',
    description: 'No tienes suficiente saldo disponible para esta transacción.',
    action: 'Verifica el saldo de tu tarjeta o cuenta'
  },
  'EXPIRED_CARD': {
    title: 'Tarjeta Vencida',
    description: 'La tarjeta de crédito/débito ha vencido.',
    action: 'Utiliza una tarjeta vigente'
  },
  'INVALID_CARD': {
    title: 'Tarjeta Inválida',
    description: 'Los datos de la tarjeta son incorrectos o inválidos.',
    action: 'Verifica el número, fecha y código de seguridad'
  },
  'PROCESSING_ERROR': {
    title: 'Error de Procesamiento',
    description: 'Ocurrió un error técnico durante el procesamiento del pago.',
    action: 'Intenta nuevamente en unos minutos'
  },
  'TIMEOUT': {
    title: 'Tiempo Agotado',
    description: 'La transacción excedió el tiempo límite de respuesta.',
    action: 'Intenta realizar el pago nuevamente'
  },
  'DEFAULT': {
    title: 'Error en el Pago',
    description: 'No pudimos procesar tu pago en este momento.',
    action: 'Verifica los datos e intenta nuevamente'
  }
};

function PaymentErrorContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [errorData, setErrorData] = useState<PaymentError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const referenceCode = searchParams.get('referenceCode');
    const transactionId = searchParams.get('transactionId');
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('error');

    if (referenceCode || transactionId) {
      fetchPaymentStatus(referenceCode, transactionId);
    } else {
      setErrorData({
        error: errorMessage || 'Error desconocido en el pago',
        errorCode: errorCode || 'UNKNOWN'
      });
      setLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentStatus = async (referenceCode?: string | null, transactionId?: string | null) => {
    try {
      const params = new URLSearchParams();
      if (referenceCode) params.set('referenceCode', referenceCode);
      if (transactionId) params.set('transactionId', transactionId);

      const response = await fetch(`/api/payu/verify-payment?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        if (data.status === 'DECLINED' || data.status === 'ERROR') {
          setErrorData({
            transaction: {
              id: data.transactionId || transactionId || '',
              referenceCode: data.referenceCode || referenceCode || '',
              status: data.status,
              responseMessage: data.responseMessage || '',
              amount: data.amount || 0,
              currency: data.currency || 'COP',
              formattedAmount: data.formattedAmount || ''
            }
          });
        } else {
          // Si no es error, redirigir a success
          window.location.href = `/payment/success?referenceCode=${data.referenceCode}`;
          return;
        }
      } else {
        setErrorData({
          error: data.error || 'Error verificando el estado del pago'
        });
      }
    } catch (error) {
      setErrorData({
        error: 'Error conectando con el servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorInfo = () => {
    const errorCode = errorData?.transaction?.status || errorData?.errorCode || 'DEFAULT';
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.DEFAULT;
  };

  const retryPayment = () => {
    const planId = searchParams.get('planId') || 'premium';
    const cycle = searchParams.get('cycle') || 'monthly';
    window.location.href = `/payment/checkout?plan=${planId}&cycle=${cycle}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Verificando estado del pago...</h1>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-lg text-gray-600">
            {errorInfo.description}
          </p>
        </div>

        {/* Error Details */}
        {errorData?.transaction && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Detalles de la Transacción
            </h2>
            
            <div className="grid gap-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Monto:</span>
                <span className="font-semibold">
                  {errorData.transaction.formattedAmount || 
                   `${errorData.transaction.currency} ${errorData.transaction.amount}`}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Estado:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {errorData.transaction.status}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Código de Referencia:</span>
                <span className="font-mono text-sm">
                  {errorData.transaction.referenceCode}
                </span>
              </div>
              
              {errorData.transaction.responseMessage && (
                <div className="py-2">
                  <span className="text-gray-500 block mb-1">Mensaje del Banco:</span>
                  <span className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {errorData.transaction.responseMessage}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Acciones Recomendadas
          </h2>
          
          <div className="space-y-3 text-yellow-800">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                1
              </div>
              <div>
                <div className="font-medium">{errorInfo.action}</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                2
              </div>
              <div>
                <div className="font-medium">Intenta con otro método de pago</div>
                <div className="text-sm">Puedes usar otra tarjeta o método disponible</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                3
              </div>
              <div>
                <div className="font-medium">Contacta a tu banco si el problema persiste</div>
                <div className="text-sm">Ellos pueden darte más información sobre la transacción</div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Problemas Comunes
          </h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900">Datos incorrectos</div>
                <div className="text-gray-600">Verifica número de tarjeta, fecha de vencimiento y CVV</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900">Límites de transacción</div>
                <div className="text-gray-600">Tu banco puede tener límites diarios o por transacción</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900">Transacciones internacionales</div>
                <div className="text-gray-600">Algunas tarjetas requieren autorización para pagos online</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 mt-2"></div>
              <div>
                <div className="font-medium text-gray-900">Conexión de internet</div>
                <div className="text-gray-600">Una conexión lenta puede interrumpir el proceso</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={retryPayment}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Intentar Nuevamente
            </button>
            
            <Link
              href="/pricing"
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Planes
            </Link>
          </div>
          
          <div className="text-center">
            <Link
              href="/dashboard/ayuda"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              ¿Necesitas ayuda? Contacta a nuestro soporte
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Si continúas teniendo problemas, guarda el código de referencia:{' '}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {errorData?.transaction?.referenceCode || 'N/A'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando estado del pago...</p>
        </div>
      </div>
    }>
      <PaymentErrorContent />
    </Suspense>
  );
}