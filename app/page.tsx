import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                DesarrolloPersonal.uno
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/videos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contenido Gratuito
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Precios
              </Link>
              <SignedOut>
                <Link href="/sign-in" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Registrarse
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Mi Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforma tu vida con
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Desarrollo Personal{" "}
              </span>
              Profesional
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Únete a miles de personas que están transformando sus vidas con nuestra plataforma 
              liderada por psicólogas expertas. Cursos, talleres, mindfulness y comunidad en un solo lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <SignedOut>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
                  Comienza tu Transformación Gratuita
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
                  Ir a Mi Dashboard
                </Link>
              </SignedIn>
              <Link href="#cursos-gratuitos" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
                Ver Contenido Gratuito
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Estudiantes Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
                <div className="text-gray-600">Cursos Especializados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Courses Section */}
      <section id="cursos-gratuitos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cursos Gratuitos de Gestión de Emociones
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comienza tu viaje de transformación con nuestros cursos gratuitos diseñados 
              por psicólogas expertas para ayudarte a gestionar mejor tus emociones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-6xl">🧘‍♀️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Fundamentos de Inteligencia Emocional
                </h3>
                <p className="text-gray-600 mb-4">
                  Aprende a reconocer, entender y gestionar tus emociones de manera efectiva.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">GRATUITO</span>
                  <Link href="/videos" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Ver Curso
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <div className="text-white text-6xl">🌱</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Técnicas de Mindfulness
                </h3>
                <p className="text-gray-600 mb-4">
                  Descubre el poder de la atención plena para reducir el estrés y la ansiedad.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">GRATUITO</span>
                  <Link href="/videos" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Ver Curso
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-white text-6xl">💪</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Resiliencia y Autoestima
                </h3>
                <p className="text-gray-600 mb-4">
                  Fortalece tu confianza y capacidad para superar los desafíos de la vida.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">GRATUITO</span>
                  <Link href="/videos" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Ver Curso
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Podcasts de Desarrollo Personal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escucha conversaciones profundas con expertos en psicología y desarrollo personal. 
              Contenido que puedes disfrutar en cualquier momento y lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  🎧
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Mentes en Equilibrio</h3>
                  <p className="text-sm text-gray-600">Episodio semanal</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Estrategias prácticas para mantener tu salud mental en el día a día.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>45 min</span>
                <span className="mx-2">•</span>
                <span>Nuevo episodio</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  🎤
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Historias de Transformación</h3>
                  <p className="text-sm text-gray-600">Bi-semanal</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Testimonios reales de personas que han transformado sus vidas.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>30 min</span>
                <span className="mx-2">•</span>
                <span>Inspirador</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">
                  🧠
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Psicología Práctica</h3>
                  <p className="text-sm text-gray-600">Mensual</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Análisis profundo de temas psicológicos con expertos invitados.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>60 min</span>
                <span className="mx-2">•</span>
                <span>Expertos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Miles de personas han transformado sus vidas con nuestra plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">MG</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">María García</p>
                  <p className="text-sm text-gray-600">Estudiante activa</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Los cursos de gestión emocional me han ayudado enormemente a manejar mi ansiedad. 
                El contenido es muy práctico y las psicólogas explican todo de manera muy clara."
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">JL</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Juan López</p>
                  <p className="text-sm text-gray-600">Empresario</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "La plataforma me ha dado herramientas increíbles para mejorar mi liderazgo 
                y gestionar mejor el estrés del trabajo. Altamente recomendado."
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">AR</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Ana Rodríguez</p>
                  <p className="text-sm text-gray-600">Madre de familia</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Gracias a los cursos de mindfulness he aprendido a estar más presente 
                con mi familia y a manejar mejor las situaciones difíciles del día a día."
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para transformar tu vida?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Únete a nuestra comunidad y accede a cursos exclusivos, talleres en vivo, 
            sesiones de mindfulness y mucho más. Tu transformación personal comienza hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link href="/sign-up" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
                Registrarse Gratis
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
                Ir a Mi Dashboard
              </Link>
            </SignedIn>
            <Link href="/pricing" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-colors text-lg">
              Ver Planes
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 block">
                DesarrolloPersonal.uno
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                La plataforma más completa de desarrollo personal en español. 
                Cursos, talleres, mindfulness y comunidad para tu crecimiento.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-3">
                <li><Link href="/videos" className="text-gray-300 hover:text-white transition-colors">Contenido Gratuito</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Precios</Link></li>
                <li><SignedIn><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Mi Dashboard</Link></SignedIn></li>
                <li><Link href="/academia" className="text-gray-300 hover:text-white transition-colors">Academia</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                <li><Link href="/dashboard/ayuda" className="text-gray-300 hover:text-white transition-colors">Centro de Ayuda</Link></li>
                <li><a href="mailto:soporte@desarrollopersonal.uno" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="/politica-privacidad" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 DesarrolloPersonal.uno. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
