#!/bin/bash
# Script para actualizar la homepage con recursos gratuitos

echo "🚀 Actualizando homepage de DesarrolloPersonal.uno"
echo "=================================================="

cd /var/www/desarrollopersonal-nextjs

# Backup
echo "📦 Creando backup..."
cp app/page.tsx app/page.tsx.backup-$(date +%Y%m%d-%H%M%S)

# Crear el archivo nuevo
echo "📝 Generando nuevo archivo..."
cat > app/page.tsx << 'EOF'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-lg sm:text-2xl font-bold text-blue-600">
              DesarrolloPersonal.uno
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <SignedOut>
                <Link href="/sign-in" className="text-gray-700 hover:text-blue-600 text-sm hidden sm:block">Entrar</Link>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg text-sm">Registrarse</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm">Dashboard</Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Transforma tu vida con<span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Desarrollo Personal</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Plataforma liderada por psicólogas expertas. Cursos, talleres y comunidad en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <SignedOut>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg">Comenzar Gratis</Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg">Ir a Dashboard</Link>
              </SignedIn>
              <Link href="#planes" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg">Ver Planes</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">75+</div>
                <div className="text-xs sm:text-sm text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">10</div>
                <div className="text-xs sm:text-sm text-gray-600">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">2</div>
                <div className="text-xs sm:text-sm text-gray-600">Talleres Grabados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">22 Nov</div>
                <div className="text-xs sm:text-sm text-gray-600">Próximo Taller</div>
              </div>
            </div>
          </div>
        </div>
      </section>
EOF

echo "✅ Archivo base creado, continuando..."

# Continuar con el resto del archivo (recursos gratuitos)
cat >> app/page.tsx << 'EOF'

      <section className="py-12 sm:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Recursos Gratuitos para Comenzar</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">Explora nuestro contenido gratuito y da el primer paso en tu viaje de desarrollo personal</p>
          </div>
          <div className="mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Videos de Introducción</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600">
                  <iframe src="https://iframe.mediadelivery.net/play/476857/223f7db8-6c19-41ed-b6a5-993cfa6aff76" className="absolute inset-0 w-full h-full" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-600">15 min</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Gratuito</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Bienvenida al Desarrollo Personal</h4>
                  <p className="text-gray-600 text-sm">Introducción y fundamentos básicos para iniciar tu transformación</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative aspect-video bg-gradient-to-br from-green-500 to-blue-600">
                  <iframe src="https://iframe.mediadelivery.net/play/476857/299f95cc-dbf6-4b91-929b-f274e93d4dd1" className="absolute inset-0 w-full h-full" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-600">15 min</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Gratuito</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Herramientas para el Autoconocimiento</h4>
                  <p className="text-gray-600 text-sm">Aprende técnicas fundamentales de autoconocimiento</p>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-pink-600">
                  <iframe src="https://iframe.mediadelivery.net/play/476857/12461bd8-b645-4733-b9d5-839196711c0c" className="absolute inset-0 w-full h-full" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-600">15 min</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Gratuito</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Primeros Pasos hacia el Cambio</h4>
                  <p className="text-gray-600 text-sm">Comienza tu transformación personal hoy mismo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Podcasts de Psicognitiva</h3>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 sm:p-8 shadow-lg border border-green-100">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Escucha Nuestros Podcasts</h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-6">Reflexiones, herramientas y conversaciones sobre desarrollo personal, bienestar emocional y crecimiento. Disponible en Spotify.</p>
                  <a href="https://open.spotify.com/episode/6usKPGp3I9FPPgiGSEdim2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                    Escuchar en Spotify
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">¿Listo para más?</h3>
            <p className="text-lg sm:text-xl mb-8 opacity-90">Accede a más de 10 cursos completos, talleres en vivo y una comunidad de apoyo</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base">Crear Cuenta Gratuita</Link>
              <Link href="/pricing" className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors border-2 border-white text-sm sm:text-base">Ver Planes</Link>
            </div>
          </div>
        </div>
      </section>
EOF

echo "✅ Sección de recursos gratuitos agregada"

# Copiar el resto desde el backup
tail -n +155 app/page.tsx.backup >> app/page.tsx

echo "✅ Archivo completo generado"
echo ""
echo "🔨 Construyendo aplicación..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    echo ""
    echo "🔄 Reiniciando aplicación..."
    pm2 restart desarrollopersonal
    
    echo ""
    echo "📊 Estado de la aplicación:"
    pm2 list
    
    echo ""
    echo "✅ Deploy completado exitosamente!"
    echo ""
    echo "🌐 Verifica en: https://desarrollopersonal.uno"
else
    echo ""
    echo "❌ Error en el build"
    echo "Restaurando backup..."
    cp app/page.tsx.backup app/page.tsx
    exit 1
fi
