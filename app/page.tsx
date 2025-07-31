import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Despierta tu
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Potencial{" "}
            </span>
            en Comunidad
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a DesarrolloPersonal.uno - La comunidad de crecimiento personal 
            liderada por psicólogas expertas con videos HD y herramientas de transformación.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Comienza tu Transformación
            </Link>
            <Link href="/videos" className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-8 rounded-lg transition-colors">
              Ver Videos Gratuitos
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚀 ¡Aplicación funcionando perfectamente!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">✅ Configurado:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Next.js 15 funcionando</li>
                  <li>• MySQL propio (puerto 3307)</li>
                  <li>• Clerk autenticación</li>
                  <li>• Bunny.net CDN</li>
                  <li>• Prisma configurado</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">🎯 Siguiente:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Video player personalizado</li>
                  <li>• Sistema de suscripciones</li>
                  <li>• Páginas de onboarding</li>
                  <li>• Panel de administración</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
