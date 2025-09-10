export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifica tu Email
            </h1>
            <p className="text-gray-600">
              Te hemos enviado un email de verificación
            </p>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-blue-900 font-medium mb-1">Email Enviado</h3>
                  <p className="text-blue-800 text-sm">
                    Hemos enviado un enlace de verificación a tu dirección de email. 
                    Haz clic en el enlace para activar tu cuenta.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2"><strong>¿No ves el email?</strong> Revisa estas carpetas:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Bandeja de entrada</li>
                <li>Carpeta de spam o correo no deseado</li>
                <li>Carpeta de promociones (Gmail)</li>
                <li>Carpeta de actualizaciones (Gmail)</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Reenviar Email de Verificación
            </button>
            
            <div className="text-center">
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                Cambiar dirección de email
              </button>
            </div>
          </div>

          {/* Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda?</p>
              <a 
                href="mailto:soporte@desarrollopersonal.uno" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Contacta con soporte
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-3 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-yellow-900 font-medium text-sm mb-1">Importante</h3>
              <p className="text-yellow-800 text-sm">
                El enlace de verificación expira en 24 horas. Si no verificas tu email 
                antes de este tiempo, deberás solicitar un nuevo enlace.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Próximos Pasos</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <span className="text-sm text-gray-600">Busca el email de verificación</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 text-xs font-bold">2</span>
              </div>
              <span className="text-sm text-gray-600">Haz clic en el enlace de verificación</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 text-xs font-bold">3</span>
              </div>
              <span className="text-sm text-gray-600">¡Tu cuenta estará lista para usar!</span>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}