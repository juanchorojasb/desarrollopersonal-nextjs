'use client'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useState } from 'react'
import { Menu, X, PlayCircle, Calendar, Users, Trophy, CheckCircle, Star, MessageCircle, BookOpen, Heart, Target, Zap, Award, Clock } from 'lucide-react'

function ResponsiveNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              DesarrolloPersonal.uno
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="https://psicognitiva.thinkific.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
              Curso Gratuito
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Precios
            </Link>
            <SignedOut>
              <Link href="/sign-in" className="text-gray-700 hover:text-blue-600 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Inscríbete Gratis
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Mi Dashboard
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          <div className="md:hidden flex items-center">
            <SignedIn>
              <div className="mr-2">
                <UserButton />
              </div>
            </SignedIn>
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMenu} />
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden">
              <div className="px-4 py-4 space-y-4">
                <Link
                  href="https://psicognitiva.thinkific.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={closeMenu}
                >
                  Curso Gratuito
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={closeMenu}
                >
                  Precios
                </Link>
                <SignedOut>
                  <div className="pt-2 border-t border-gray-200 space-y-4">
                    <Link
                      href="/sign-in"
                      className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                      onClick={closeMenu}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-center"
                      onClick={closeMenu}
                    >
                      Inscríbete Gratis
                    </Link>
                  </div>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-center"
                    onClick={closeMenu}
                  >
                    Mi Dashboard
                  </Link>
                </SignedIn>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Reconecta con tu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}potencial ilimitado{" "}
              </span>
              y vive más pleno
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Porque creemos firmemente que dentro de ti existe un potencial ilimitado para vivir 
              una vida más plena, consciente y feliz. Somos esa pausa, esa guía y esa chispa 
              que te ayuda a reconectar contigo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <SignedOut>
                <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 sm:px-8 rounded-lg transition-colors text-base sm:text-lg inline-flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Inscríbete Gratis
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="https://psicognitiva.thinkific.com/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 sm:px-8 rounded-lg transition-colors text-base sm:text-lg inline-flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Ver Curso Gratuito
                </Link>
              </SignedIn>
              <Link href="#planes" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 sm:px-8 rounded-lg transition-colors text-base sm:text-lg">
                Conocer Planes
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">1,200+</div>
                <div className="text-gray-600">Vidas Transformadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">7</div>
                <div className="text-gray-600">Colecciones de Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">97%</div>
                <div className="text-gray-600">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="py-16 sm:py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Colecciones Más Populares
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Descubre nuestras 7 colecciones diseñadas para transformar diferentes aspectos de tu vida. 
        Cada una contiene cursos especializados con metodología científica.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          id: 1,
          title: "Hábitos de estudio",
          items: 5,
          size: "6.17 GB",
          progress: 65,
          description: "Técnicas probadas para optimizar tu aprendizaje y productividad académica",
          category: "Productividad"
        },
        {
          id: 2,
          title: "GPS Salud mental",
          items: 4,
          size: "2.08 GB",
          progress: 30,
          description: "Navegación completa hacia el bienestar emocional y mental",
          category: "Bienestar"
        },
        {
          id: 3,
          title: "Arquitectura del sueño",
          items: 5,
          size: "5.94 GB",
          progress: 85,
          description: "Construye patrones de descanso que transformen tu vida",
          category: "Salud"
        },
        {
          id: 4,
          title: "Gestionando la depresión",
          items: 3,
          size: "1.89 GB",
          progress: 45,
          description: "Herramientas profesionales para superar momentos difíciles",
          category: "Salud Mental"
        },
        {
          id: 5,
          title: "Emociones en equilibrio",
          items: 9,
          size: "6.83 GB",
          progress: 20,
          description: "Domina el arte de la regulación emocional",
          category: "Inteligencia Emocional"
        },
        {
          id: 6,
          title: "Neurocalma",
          items: 9,
          size: "9.47 GB",
          progress: 75,
          description: "Técnicas neurocientíficas para encontrar la paz interior",
          category: "Neurociencia"
        },
        {
          id: 7,
          title: "Navegando la tormenta interior",
          items: 6,
          size: "2.83 GB",
          progress: 55,
          description: "Guía para superar crisis emocionales con fortaleza",
          category: "Resiliencia"
        }
      ].map((collection) => (
        <div key={collection.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                {collection.category}
              </span>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center space-x-4 text-white text-sm">
                <div className="flex items-center space-x-1">
                  <PlayCircle className="w-4 h-4" />
                  <span>{collection.items}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{collection.size}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {collection.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {collection.description}
            </p>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progreso</span>
                <span className="text-sm font-semibold text-gray-900">{collection.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${collection.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">4.9 (128 reseñas)</span>
              </div>
              <Link 
                href={`/courses/${collection.id}`}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                <span>Continuar</span>
                <PlayCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-12">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        <BookOpen className="w-5 h-5" />
        <span>Ver Todas las Colecciones</span>
      </Link>
    </div>
  </div>
</section>

<section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Talleres Programados
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Únete a nuestros talleres en vivo con la Dra. Dora Luz Betancourth. 
        Sesiones interactivas diseñadas para profundizar en temas específicos de desarrollo personal.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[
        {
          id: 1,
          title: "Taller de Duelo: \"Honrando el recuerdo, abrazando la vida\"",
          description: "Para personas que han vivido una pérdida significativa y desean transformar su proceso de duelo explorando emociones desde el amor y la memoria.",
          date: "15 de octubre, 2025",
          time: "19:00",
          duration: "2 horas",
          spots: 25,
          spotsLeft: 8,
          price: "Gratuito",
          category: "Duelo y Sanación",
          level: "Principiante"
        },
        {
          id: 2,
          title: "Formación Docentes: \"El docente que soy...\"",
          description: "Espacio de reflexión crítica sobre la práctica pedagógica para maestros y equipos educativos. Fortalece tu vocación y actualiza herramientas.",
          date: "22 de octubre, 2025",
          time: "18:00",
          duration: "3 horas",
          spots: 40,
          spotsLeft: 15,
          price: "$45.000 COP",
          category: "Educación",
          level: "Intermedio"
        },
        {
          id: 3,
          title: "Taller Hábitos de Estudio: \"Aprender con propósito\"",
          description: "Para estudiantes que buscan mejorar su rendimiento aprendiendo métodos prácticos de estudio, planificación y motivación.",
          date: "29 de octubre, 2025",
          time: "16:00",
          duration: "2.5 horas",
          spots: 30,
          spotsLeft: 12,
          price: "$35.000 COP",
          category: "Productividad",
          level: "Principiante"
        },
        {
          id: 4,
          title: "Taller Gestión Emocional: \"Emociones en equilibrio\"",
          description: "Aprende a escuchar y canalizar emociones si sientes que te desbordan. Logra dominio emocional, armonía y mejores decisiones.",
          date: "5 de noviembre, 2025",
          time: "19:30",
          duration: "2 horas",
          spots: 35,
          spotsLeft: 20,
          price: "$40.000 COP",
          category: "Inteligencia Emocional",
          level: "Intermedio"
        },
        {
          id: 5,
          title: "Taller de Asertividad: \"Decir lo que pienso sin miedo\"",
          description: "Fortalece tu comunicación y autoestima. Aprende técnicas para hablar con respeto y firmeza, sin culpa ni ansiedad.",
          date: "12 de noviembre, 2025",
          time: "18:30",
          duration: "2.5 horas",
          spots: 25,
          spotsLeft: 7,
          price: "$38.000 COP",
          category: "Comunicación",
          level: "Intermedio"
        },
        {
          id: 6,
          title: "Taller Orientación Vocacional: \"Mi brújula profesional\"",
          description: "Encuentra claridad explorando intereses, talentos y valores para diseñar un camino profesional alineado con tu propósito.",
          date: "19 de noviembre, 2025",
          time: "17:00",
          duration: "3 horas",
          spots: 20,
          spotsLeft: 5,
          price: "$50.000 COP",
          category: "Desarrollo Profesional",
          level: "Principiante"
        }
      ].map((workshop) => (
        <div key={workshop.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {workshop.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {workshop.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {workshop.title}
                </h3>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-blue-600">{workshop.price}</div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              {workshop.description}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{workshop.date}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{workshop.time} • {workshop.duration}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Dra. Dora Luz Betancourth</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Disponibilidad:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  workshop.spotsLeft <= 10 ? 'text-red-600 bg-red-50' : 
                  workshop.spotsLeft <= 20 ? 'text-orange-600 bg-orange-50' : 
                  'text-green-600 bg-green-50'
                }`}>
                  {workshop.spotsLeft} de {workshop.spots} cupos
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href={`/workshops/${workshop.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Inscribirme
              </Link>
              <Link 
                href={`/workshops/${workshop.id}`}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                <span>Detalles</span>
                <PlayCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-12">
      <Link 
        href="/workshops" 
        className="inline-flex items-center space-x-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        <Calendar className="w-5 h-5" />
        <span>Ver Calendario Completo</span>
      </Link>
    </div>
  </div>
</section>

      {/* Free Content Section */}
      <section id="contenido-gratuito" className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Curso Gratuito: Regulación de Emociones para Empresarios
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Desarrollado por <strong>Dora Luz Betancourth</strong>, Psicóloga Clínica con 12+ años de experiencia.
              Metodología científica validada para líderes y emprendedores.
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <Star className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="font-semibold">100% Gratuito • Acceso Inmediato • 5 Sesiones Completas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-300" />
                  Programa Completo Gratuito
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Sesión 1: Introducción</h4>
                      <p className="text-blue-100 text-sm">Regulación de Emociones para Empresarios • Ejercicios y Conclusión • Tabla de Emociones (Material descargable)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Sesión 2: Inteligencia Emocional</h4>
                      <p className="text-blue-100 text-sm">Desarrollo de competencias emocionales clave para líderes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Sesión 3: Habilidades Socio-Emocionales</h4>
                      <p className="text-blue-100 text-sm">Liderazgo emocional y comunicación efectiva en equipos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Sesión 4: Metamorfosis</h4>
                      <p className="text-blue-100 text-sm">Transformación profunda y cambio sostenido</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <div>
                      <h4 className="font-semibold">Sesión 5: Técnicas de Afrontamiento</h4>
                      <p className="text-blue-100 text-sm">Estrategias prácticas para situaciones empresariales complejas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Accede al Curso</h3>
                <p className="text-gray-600">Disponible en nuestra plataforma externa</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">5 sesiones completas en video</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Material descargable incluido</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Acceso inmediato</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Certificado de participación</span>
                </div>
              </div>

              <Link href="https://psicognitiva.thinkific.com/" target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all block text-center">
                Acceder al Curso Gratuito
              </Link>
              <p className="text-xs text-gray-500 text-center mt-3">
                * Curso disponible en plataforma externa • 100% Gratuito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="planes" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Elige el Camino que Resuene Contigo
            </h2>
            <p className="text-xl text-gray-600">
              Planes diseñados para cada etapa de tu viaje de crecimiento personal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Gratuito</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
                <p className="text-gray-600">Para empezar a explorar</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Acceso a cursos introductorios</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Meditaciones seleccionadas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Vista previa de la plataforma</span>
                </div>
              </div>

              <SignedOut>
                <Link href="/sign-up" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center">
                  Empieza Gratis
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center">
                  Ver Contenido
                </Link>
              </SignedIn>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Básico</h3>
                <div className="text-4xl font-bold text-blue-600 mb-1">$25.000</div>
                <p className="text-gray-600 text-sm">COP/mes</p>
                <p className="text-blue-600 font-semibold">$6 USD/mes</p>
                <p className="text-gray-600 text-sm mt-2">Para aprender a tu ritmo</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold">Acceso COMPLETO a TODOS los cursos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Descarga de materiales y guías</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Certificados de finalización</span>
                </div>
              </div>

              <Link href="/pricing" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center">
                Elegir Plan Básico
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-xl border-2 border-blue-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                  MÁS POPULAR
                </span>
              </div>
              
              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Plan Completo</h3>
                <div className="text-4xl font-bold mb-1">$80.000</div>
                <p className="text-blue-100 text-sm">COP/mes</p>
                <p className="text-white font-semibold">$20 USD/mes</p>
                <p className="text-blue-100 text-sm mt-2">Para transformar tu vida</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-semibold text-white">TODO lo del Plan Básico</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-semibold text-white">Talleres mensuales EN VIVO</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-white">Acceso a la Comunidad Premium</span>
                </div>
              </div>

              <Link href="/pricing" className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-semibold transition-colors block text-center">
                Unirme al Plan Completo
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Personal</h3>
                <div className="text-4xl font-bold text-purple-600 mb-1">$160.000</div>
                <p className="text-gray-600 text-sm">COP/mes</p>
                <p className="text-purple-600 font-semibold">$40 USD/mes</p>
                <p className="text-gray-600 text-sm mt-2">Para acelerar tu transformación</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold">TODO lo del Plan Completo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold">1 Sesión individual de 1 hora al mes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Acompañamiento personalizado</span>
                </div>
              </div>

              <Link href="/pricing" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors block text-center">
                Solicitar Plan Personal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-400 mb-4 block">
                DesarrolloPersonal.uno
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Tu plataforma completa de desarrollo personal. Reconecta con tu potencial ilimitado 
                y vive una vida más plena, consciente y feliz.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-3">
                <li><Link href="https://psicognitiva.thinkific.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Curso Gratuito</Link></li>
                <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Planes Premium</Link></li>
                <li><SignedIn><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Mi Dashboard</Link></SignedIn></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-3">
                <li><a href="mailto:soporte@desarrollopersonal.uno" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="/politica-privacidad" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400">
              © 2024 DesarrolloPersonal.uno. Todos los derechos reservados.
            </p>
            <SignedIn>
              <div className="mt-4">
                <Link
                  href="/dashboard/admin"
                  className="inline-block text-xs text-gray-600 hover:text-gray-400 transition-colors opacity-50 hover:opacity-100"
                  title="Panel de administración"
                >
                  •
                </Link>
              </div>
            </SignedIn>
          </div>
        </div>
      </footer>
    </div>
  )
}
