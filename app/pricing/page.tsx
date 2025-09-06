import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function PricingPage() {
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
              <Link href="/pricing" className="text-purple-600 font-medium border-b-2 border-purple-600">
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
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encuentra tu Nivel de 
            <span className="text-purple-600"> Acompañamiento</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Cada persona tiene su propio ritmo de transformación. Elige el plan que mejor 
            se adapte a tu proceso de <strong>entrenamiento mental</strong> y crecimiento personal.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 max-w-3xl mx-auto">
            <p className="text-lg text-yellow-800">
              <strong>Metodología:</strong> Todos nuestros planes están basados en 
              Psicología Cognitivo-Conductual y Neurociencia aplicada. No son terapia clínica, 
              sino <strong>entrenamiento mental</strong> para el desarrollo personal.
            </p>
          </div>
        </div>
      </section>

      {/* Planes de Acompañamiento */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Entrenamiento Básico</h3>
                <p className="text-gray-600 mb-6">
                  Perfecto para quienes prefieren aprender a su propio ritmo con contenido estructurado.
                </p>
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  $25.000
                </div>
                <span className="text-lg text-gray-500">por mes</span>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <strong>Acceso completo a todos los cursos en video</strong>
                    <p className="text-gray-600 text-sm">26 lecciones en 5 programas de entrenamiento mental</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <strong>Metodología neurocientífica estructurada</strong>
                    <p className="text-gray-600 text-sm">Técnicas basadas en neuroplasticidad y regulación emocional</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <strong>Progreso a tu propio ritmo</strong>
                    <p className="text-gray-600 text-sm">Sin presión de tiempo, acceso 24/7</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <strong>Videos en alta calidad</strong>
                    <p className="text-gray-600 text-sm">Streaming optimizado desde Bunny CDN</p>
                  </div>
                </div>
              </div>
              
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                    Comenzar Ahora
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                  Seleccionar Plan Básico
                </button>
              </SignedIn>
            </div>

            {/* Plan Intermedio */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 text-center relative transform scale-105 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  ⭐ Más Popular
                </span>
              </div>
              
              <div className="mb-8 mt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Acompañamiento Integral</h3>
                <p className="text-gray-600 mb-6">
                  La experiencia completa con comunidad y sesiones en vivo para un crecimiento acelerado.
                </p>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  $80.000
                </div>
                <span className="text-lg text-gray-500">por mes</span>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <strong>Todo lo del plan básico</strong>
                    <p className="text-gray-600 text-sm">Acceso completo a todos los videos y metodología</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <div>
                    <strong>2 talleres sabatinos en vivo al mes</strong>
                    <p className="text-gray-600 text-sm">Sesiones grupales interactivas con facilitadores</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <div>
                    <strong>Acceso a foros privados de la comunidad</strong>
                    <p className="text-gray-600 text-sm">Espacio seguro para compartir y hacer preguntas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <div>
                    <strong>Interacción directa con facilitadores</strong>
                    <p className="text-gray-600 text-sm">Preguntas y respuestas en tiempo real</p>
                  </div>
                </div>
              </div>
              
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                    Unirme a la Comunidad
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                  Seleccionar Plan Integral
                </button>
              </SignedIn>
            </div>

            {/* Plan Premium */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center hover:border-green-300 transition-colors">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Transformación Premium</h3>
                <p className="text-gray-600 mb-6">
                  La experiencia más completa con acompañamiento personal de psicólogas expertas.
                </p>
                <div className="text-5xl font-bold text-green-600 mb-2">
                  $140.000
                </div>
                <span className="text-lg text-gray-500">por mes</span>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <strong>Todo lo del plan integral</strong>
                    <p className="text-gray-600 text-sm">Videos + Talleres + Comunidad</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <strong>1 hora mensual de acompañamiento personal</strong>
                    <p className="text-gray-600 text-sm">Sesión individual 1:1 cada mes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <strong>Sesiones virtuales con psicólogas expertas</strong>
                    <p className="text-gray-600 text-sm">Profesionales especializadas en desarrollo personal</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <div>
                    <strong>Plan personalizado de desarrollo</strong>
                    <p className="text-gray-600 text-sm">Estrategia adaptada a tus necesidades específicas</p>
                  </div>
                </div>
              </div>
              
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                    Transformación Completa
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                  Seleccionar Plan Premium
                </button>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      {/* Comparación de Planes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comparación Detallada de Planes
            </h2>
            <p className="text-xl text-gray-600">
              Encuentra el nivel de acompañamiento que mejor se adapte a tu proceso
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Características</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-purple-600">Básico</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-blue-600">Integral</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-green-600">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Acceso a todos los cursos en video</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">26 lecciones estructuradas</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Metodología neurocientífica</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Talleres sabatinos en vivo</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅ (2/mes)</td>
                  <td className="px-6 py-4 text-center">✅ (2/mes)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Foros privados de comunidad</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Interacción con facilitadores</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Acompañamiento personal 1:1</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅ (1h/mes)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Sesiones con psicólogas expertas</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Plan personalizado</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes sobre Planes */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes sobre los Planes
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-gray-600">
                Sí, puedes actualizar o cambiar tu plan cuando lo necesites. Los cambios se aplicarán 
                en tu próximo período de facturación.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué pasa si no estoy satisfecho con mi plan?
              </h3>
              <p className="text-gray-600">
                Ofrecemos una garantía de satisfacción. Si no estás conforme en los primeros 7 días, 
                puedes solicitar un reembolso completo o cambiar a otro plan.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Las sesiones personales son realmente con psicólogas expertas?
              </h3>
              <p className="text-gray-600">
                Sí, todas nuestras psicólogas están licenciadas y especializadas en desarrollo personal 
                y metodologías neurocientíficas. No son sesiones de terapia clínica, sino acompañamiento 
                en tu crecimiento personal.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cómo funcionan los talleres sabatinos?
              </h3>
              <p className="text-gray-600">
                Son sesiones en vivo de 90 minutos cada sábado (2 por mes), donde profundizamos en 
                técnicas específicas, resolvemos dudas y practicamos ejercicios en grupo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para Comenzar tu Transformación?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Únete a cientos de personas que ya están navegando su tormenta interior 
            y encontrando su camino hacia una vida más plena.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                  Comenzar Ahora
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto inline-block bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Ir a mi Dashboard
              </Link>
            </SignedIn>
            <Link href="/faq" className="w-full sm:w-auto inline-block border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              Ver FAQ Completo
            </Link>
          </div>
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
