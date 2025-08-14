import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                DesarrolloPersonal.uno
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">
                Inicio
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-purple-600 font-medium">
                Planes
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-purple-600 font-medium">
                FAQ
              </Link>
              <SignedIn>
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium">
                  Mi Dashboard
                </Link>
              </SignedIn>
            </nav>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-purple-600 font-medium">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
                    Registrarse
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
              Navega tu <span className="text-purple-600">Tormenta Interior</span>
              <br />
              y Encuentra el <span className="text-blue-600">Camino hacia la Vida</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Te acompañamos con respeto, asertividad y empatía en tu proceso de 
              <strong> entrenamiento mental</strong> basado en Psicología Cognitivo-Conductual 
              y Neurociencia aplicada.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 max-w-4xl mx-auto">
              <p className="text-lg text-yellow-800">
                <strong>Importante:</strong> Nuestros programas de desarrollo personal no reemplazan 
                la terapia psicológica ni la medicación prescrita por profesionales de la salud. 
                Somos una <strong>voz de aliento, apoyo y comunidad</strong> en tu crecimiento personal.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                    Comienza tu Transformación
                  </button>
                </SignUpButton>
                <Link href="#curso-gratuito" className="w-full sm:w-auto inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                  Ver Curso Gratuito
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                  Continuar mi Entrenamiento
                </Link>
                <Link href="#curso-gratuito" className="w-full sm:w-auto inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                  Ver Curso Gratuito
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Curso Gratuito - Regulación de Emociones para Empresarios */}
      <section id="curso-gratuito" className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🎁 Curso Gratuito: Regulación Emocional para Empresarios
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Descubre cómo la neurociencia puede transformar tu liderazgo y productividad empresarial. 
              <strong> Acceso completamente gratuito</strong> para que experimentes nuestra metodología.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Lo que Aprenderás</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Identificar y gestionar el estrés empresarial desde la neurociencia</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Técnicas de regulación emocional para la toma de decisiones</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Cómo crear ambientes laborales emocionalmente inteligentes</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Herramientas prácticas para el liderazgo bajo presión</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <a 
                  href="https://psicognitiva.thinkific.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white hover:bg-gray-100 text-green-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  Acceder al Curso Gratuito →
                </a>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">100% Gratuito</h4>
                <p className="text-gray-600 mb-6">
                  Una muestra de nuestra metodología completa. Sin compromisos, 
                  sin pagos, solo conocimiento aplicable desde el primer día.
                </p>
                <div className="text-sm text-gray-500">
                  ⭐ Más de 500 empresarios capacitados
                  <br />
                  📊 95% reporta mejoras en su liderazgo
                  <br />
                  🧠 Basado en neurociencia aplicada
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Cursos Disponibles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestros Programas de Entrenamiento Mental
            </h2>
            <p className="text-xl text-gray-600">
              Cada curso está diseñado con metodología neurocientífica para resultados duraderos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Curso 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Arquitectura del Sueño: Neurobiología del Descanso
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprende la neurobiología del descanso reparador y optimiza tu sueño para un mejor bienestar mental. 
                  Explora la ciencia detrás del sueño y su impacto en la regulación emocional.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 font-medium">Neurociencia del Sueño</span>
                  <span className="text-sm text-gray-500">4 sesiones</span>
                </div>
              </div>
            </div>

            {/* Curso 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Emociones en Equilibrio: Neurociencia del Bienestar
                </h3>
                <p className="text-gray-600 mb-4">
                  Desarrolla inteligencia emocional a través de técnicas neurocientíficas. 
                  Aprende a regular tus emociones y crear patrones mentales más saludables.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 font-medium">Regulación Emocional</span>
                  <span className="text-sm text-gray-500">6 sesiones</span>
                </div>
              </div>
            </div>

            {/* Curso 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Gestionando la Depresión: Neuroplasticidad y Esperanza
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprende cómo tu cerebro puede cambiar y sanarse. Técnicas basadas en neuroplasticidad 
                  para navegar estados depresivos con esperanza y herramientas científicas.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">Neuroplasticidad</span>
                  <span className="text-sm text-gray-500">5 sesiones</span>
                </div>
              </div>
            </div>

            {/* Curso 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  NeuroCalma: Ciencia de la Regulación Emocional
                </h3>
                <p className="text-gray-600 mb-4">
                  Herramientas neurocientíficas para encontrar calma en el caos. 
                  Técnicas de respiración, mindfulness y regulación del sistema nervioso.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 font-medium">Mindfulness Científico</span>
                  <span className="text-sm text-gray-500">4 sesiones</span>
                </div>
              </div>
            </div>

            {/* Curso 5 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Navegando la Tormenta Interior: Un Camino hacia la Vida
                </h3>
                <p className="text-gray-600 mb-4">
                  Acompañamiento especializado para momentos de crisis existencial. 
                  Encuentra nuevamente tu sentido de vida con herramientas compasivas y científicas.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600 font-medium">Prevención y Esperanza</span>
                  <span className="text-sm text-gray-500">6 sesiones</span>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg overflow-hidden text-white">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">
                  ¿Listo para Comenzar?
                </h3>
                <p className="mb-4 text-purple-100">
                  Accede a todos estos cursos y más con nuestros planes de acompañamiento. 
                  Tu transformación comienza hoy.
                </p>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-6 rounded-lg transition-colors">
                      Comenzar Ahora
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="block w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-6 rounded-lg text-center transition-colors">
                    Ir a mis Cursos
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Por qué tu mente te miente? */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿Por qué tu Mente te Miente?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Cuando tu cerebro está en crisis, aparecen las <strong>distorsiones cognitivas</strong> - 
              pensamientos automáticos negativos que no son una verdad, sino un síntoma de que 
              algo está pasando. No te definen ni ponen un punto final a tu historia.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">El Cerebro Secuestrado</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <p className="text-gray-600">
                    <strong>La Amígdala:</strong> Tu sistema de alarma se enciende no solo con el fuego, 
                    sino también con el humo. Todo puede ser un motivo para detonar.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3"></div>
                  <p className="text-gray-600">
                    <strong>Corteza Prefrontal:</strong> La parte que planea, analiza y pone control 
                    queda desconectada durante las crisis.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                  <p className="text-gray-600">
                    <strong>Resultado:</strong> Visión de túnel donde solo se ve lo negativo, 
                    como si tu cerebro escaneara únicamente amenazas.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Lo que Realmente Buscas</h4>
              <p className="text-gray-700 mb-4">
                Cuando surgen pensamientos de "no sirvo para nada", "nunca me va a ir bien", 
                "nadie me ama", lo que realmente se está procurando es 
                <strong> terminar con el dolor, no con la vida.</strong>
              </p>
              <p className="text-gray-700">
                Nuestro entrenamiento mental te ayuda a reconocer que estos pensamientos 
                son temporales y modificables a través de técnicas neurocientíficas comprobadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de Acompañamiento */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Elige tu Nivel de Acompañamiento
            </h2>
            <p className="text-xl text-gray-600">
              Cada persona tiene su propio ritmo. Encuentra el plan que mejor se adapte a tus necesidades.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Entrenamiento Básico</h3>
              <div className="text-4xl font-bold text-purple-600 mb-6">
                $25.000
                <span className="text-lg text-gray-500 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso completo a todos los cursos en video
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Metodología neurocientífica estructurada
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Progreso a tu propio ritmo
                </li>
              </ul>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Comenzar Ahora
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/pricing" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
                  Seleccionar Plan
                </Link>
              </SignedIn>
            </div>

            {/* Plan Intermedio */}
            <div className="bg-white border-2 border-blue-500 rounded-lg p-8 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Más Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Acompañamiento Integral</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                $80.000
                <span className="text-lg text-gray-500 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Todo lo del plan básico
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  2 talleres sabatinos en vivo al mes
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Acceso a foros privados de la comunidad
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Interacción directa con facilitadores
                </li>
              </ul>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Unirme a la Comunidad
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/pricing" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
                  Seleccionar Plan
                </Link>
              </SignedIn>
            </div>

            {/* Plan Premium */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transformación Premium</h3>
              <div className="text-4xl font-bold text-green-600 mb-6">
                $140.000
                <span className="text-lg text-gray-500 font-normal">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Todo lo del plan integral
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 hora mensual de acompañamiento personal
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Sesiones virtuales con psicólogas expertas
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Plan personalizado de desarrollo
                </li>
              </ul>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Transformación Completa
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/pricing" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
                  Seleccionar Plan
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Estás a un Paso de Encontrar tu Camino
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            No estás solo en esta tormenta. Tenemos una comunidad esperándote, 
            herramientas comprobadas y el acompañamiento que necesitas para 
            redescubrir tu sentido de vida.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Comienza tu Proceso de Transformación
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="inline-block bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Continuar mi Entrenamiento Mental
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DesarrolloPersonal.uno</h3>
              <p className="text-gray-400">
                Plataforma de entrenamiento mental basada en neurociencia y psicología cognitivo-conductual.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing">Planes</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><a href="https://psicognitiva.thinkific.com/" target="_blank" rel="noopener noreferrer">Curso Gratuito</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li>Comunidad</li>
                <li>Talleres en Vivo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>juanchorojasb@gmail.com</li>
                <li>Soporte 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DesarrolloPersonal.uno. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
