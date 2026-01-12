'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Error de Autenticación
      </h2>
      <p className="text-gray-600 mb-6">
        {error === 'CredentialsSignin' 
          ? 'Credenciales inválidas. Verifica tu email y contraseña.'
          : 'Ocurrió un error al iniciar sesión. Por favor intenta nuevamente.'}
      </p>
      <Link
        href="/auth/signin"
        className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Volver a intentar
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="max-w-md w-full text-center">
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
