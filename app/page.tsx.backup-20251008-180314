import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-lg sm:text-2xl font-bold text-blue-600">
              DesarrolloPersonal.uno
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <SignedOut>
                <Link href="/sign-in" className="text-gray-700 hover:text-blue-600 text-sm hidden sm:block">
                  Entrar
                </Link>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg text-sm">
                  Registrarse
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm">
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Transforma tu vida con
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Desarrollo Personal
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Plataforma liderada por psicólogas expertas. Cursos, talleres y comunidad en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <SignedOut>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg">
                  Comenzar Gratis
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg">
                  Ir a Dashboard
                </Link>
              </SignedIn>
              <Link href="#planes" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg">
                Ver Planes
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">1500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">35+</div>
                <div className="text-xs sm:text-sm text-gray-600">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">95%</div>
                <div className="text-xs sm:text-sm text-gray-600">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Comunidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Nuestros Cursos Más Valorados
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Cursos que han transformado miles de vidas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 sm:p-6 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Más Popular</span>
                <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Arquitectura del Sueño
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Técnicas científicas para mejorar la calidad del sueño.
              </p>
              <div className="flex justify-between text-xs text-gray-600 mb-3">
                <span>5 sesiones</span>
                <span>4.9/5 (340)</span>
              </div>
              <p className="text-xs italic text-gray-600">
                "Mi calidad de sueño mejoró drásticamente" - María S.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 sm:p-6 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">Alta Demanda</span>
                <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Emociones en Equilibrio
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Aprende a gestionar tus emociones efectivamente.
              </p>
              <div className="flex justify-between text-xs text-gray-600 mb-3">
                <span>9 sesiones</span>
                <span>4.8/5 (287)</span>
              </div>
              <p className="text-xs italic text-gray-600">
                "Herramientas invaluables para la ansiedad" - Carlos M.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 sm:p-6 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">Innovador</span>
                <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Neurocalma
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Técnicas neurocientíficas para reducir el estrés.
              </p>
              <div className="flex justify-between text-xs text-gray-600 mb-3">
                <span>9 sesiones</span>
                <span>4.9/5 (195)</span>
              </div>
              <p className="text-xs italic text-gray-600">
                "Un enfoque científico que funciona" - Ana R.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Talleres */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Próximos Talleres en Vivo
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Todos los sábados de 9:00 AM a 11:00 AM
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 sm:p-4 text-white">
                <div className="text-xs sm:text-sm font-medium">Próximo</div>
                <div className="text-base sm:text-lg font-bold">4 Oct, 9:00 AM</div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Taller de Duelo
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Honrando el recuerdo. Para personas que han vivido una pérdida.
                </p>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-600 font-semibold">15 cupos</span>
                  <span className="text-gray-500">2 horas</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 text-white">
                <div className="text-xs sm:text-sm font-medium">Siguiente</div>
                <div className="text-base sm:text-lg font-bold">18 Oct, 9:00 AM</div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Formación Docentes
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Reflexión sobre práctica pedagógica para maestros.
                </p>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-600 font-semibold">12 cupos</span>
                  <span className="text-gray-500">2 horas</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 sm:p-4 text-white">
                <div className="text-xs sm:text-sm font-medium">Después</div>
                <div className="text-base sm:text-lg font-bold">1 Nov, 9:00 AM</div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Hábitos de Estudio
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Métodos prácticos para mejorar rendimiento académico.
                </p>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-green-600 font-semibold">20 cupos</span>
                  <span className="text-gray-500">2 horas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comunidad */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Únete a Nuestra Comunidad
            </h2>
            <p className="text-base sm:text-lg text-purple-100">
              Conecta con personas en tu mismo viaje de crecimiento
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Conexiones Reales</h3>
              <p className="text-sm sm:text-base text-purple-100">
                Forma conexiones auténticas que duran
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Apoyo Continuo</h3>
              <p className="text-sm sm:text-base text-purple-100">
                Nunca estarás solo en tu camino
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Crecimiento Compartido</h3>
              <p className="text-sm sm:text-base text-purple-100">
                Celebra logros juntos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      <section id="planes" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Elige el Plan Perfecto para Ti
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Desde contenido gratuito hasta acompañamiento personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Plan Gratuito */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-50 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Gratuito</h3>
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">$0</div>
                <div className="text-xs sm:text-sm text-gray-600">Para siempre</div>
              </div>
              <div className="p-4 sm:p-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Curso en Thinkific
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Podcasts semanales
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Acceso a comunidad
                  </li>
                </ul>
                <SignedOut>
                  <Link href="/sign-up" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg text-center block text-sm">
                    Comenzar Gratis
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="w-full bg-gray-100 text-gray-500 font-semibold py-2 sm:py-3 px-4 rounded-lg text-center text-sm">
                    Plan Actual
                  </div>
                </SignedIn>
              </div>
            </div>

            {/* Plan Básico */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-50 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Básico</h3>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">$25.000</div>
                <div className="text-xs sm:text-sm text-gray-600">por mes</div>
              </div>
              <div className="p-4 sm:p-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Todo del gratuito
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    5 cursos especializados
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Talleres grupales
                  </li>
                </ul>
                <Link href="/pricing" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg text-center block text-sm">
                  Seleccionar Plan
                </Link>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-purple-200 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
              </div>
              <div className="bg-purple-50 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Premium</h3>
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">$80.000</div>
                <div className="text-xs sm:text-sm text-gray-600">por mes</div>
              </div>
              <div className="p-4 sm:p-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Todo del básico
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Todos los cursos (35+)
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Mindfulness
                  </li>
                </ul>
                <Link href="/pricing" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg text-center block text-sm">
                  Seleccionar Plan
                </Link>
              </div>
            </div>

            {/* Plan VIP */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">VIP</h3>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">$160.000</div>
                <div className="text-xs sm:text-sm text-yellow-100">por mes</div>
              </div>
              <div className="p-4 sm:p-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Todo del premium
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Acompañamiento 1:1
                  </li>
                  <li className="flex items-center text-xs sm:text-sm">
                    <svg className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Sesiones con psicólogas
                  </li>
                </ul>
                <Link href="/pricing" className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg text-center block text-sm">
                  Seleccionar Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 block">
                DesarrolloPersonal.uno
              </Link>
              <p className="text-gray-400 mb-4 text-sm sm:text-base max-w-md">
                Transformamos vidas a través del desarrollo personal profesional.
              </p>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Plataforma</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Videos Gratuitos
                  </Link>
                </li>
                <li>
                  <a href="https://psicognitiva.thinkific.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Cursos Thinkific
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 DesarrolloPersonal.uno. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
