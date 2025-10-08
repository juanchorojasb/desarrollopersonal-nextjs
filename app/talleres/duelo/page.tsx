import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function TallerDueloPage() {
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
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🌊 Taller en Vivo • 2 Horas • Online
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Navegando las Olas del Duelo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Un Encuentro para Sanar y Crecer
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              El duelo es, quizás, el viaje más personal y, a menudo, el más solitario que emprendemos. 
              Es un mar de emociones intensas: olas de tristeza que llegan sin aviso, la niebla de la confusión 
              que no nos deja ver el horizonte, y una sensación de estar a la deriva mientras el mundo sigue girando.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="https://checkout.wompi.co/l/xnaPPY" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transform transition hover:scale-105">
                Inscribirme como Pionero • $20.000
              </a>
              <a href="#detalles" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-4 px-8 rounded-lg text-lg">
                Ver Detalles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* No Estás Solo */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              No Estás Solo en Este Camino
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Si estas palabras resuenan contigo, <strong>Dora Luz Betancourth</strong> y todo el equipo de 
                <strong className="text-blue-600"> desarrollopersonal.uno</strong> queremos decirte algo fundamental: 
                <span className="text-purple-600 font-semibold"> no estás solo y no tienes que navegar esta tormenta sin un faro.</span>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Con el corazón lleno de empatía y la solidez profesional que se requiere, hemos creado este encuentro especial. 
                Este no es simplemente un taller online. Es un <strong>refugio seguro</strong>, un espacio confidencial y cálido 
                diseñado para que puedas anclar tus emociones, ser escuchado sin juicios y, lo más importante, 
                <strong className="text-blue-600"> empezar a encontrar tu propio camino hacia la sanación.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tu Guía - Dora Luz */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tu Guía en Este Viaje
            </h2>
            <p className="text-xl text-gray-600">
              Experiencia y Calidez a tu Servicio
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-40 h-40 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-7xl">👩‍⚕️</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Dora Luz Betancourth</h3>
                  <p className="text-purple-100 font-medium">Psicóloga • Fundadora</p>
                </div>
              </div>
              
              <div className="md:w-3/5 p-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-700"><strong>Más de 15 años de experiencia</strong> acompañando procesos de duelo y transformación personal</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-700"><strong>Maestría en Discapacidad</strong> y formación especializada en procesos de pérdida</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-700">Fundadora de <strong>Psicognitiva</strong> en Manizales, con más de 10 años de práctica privada</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-700">Ha acompañado a <strong>cientos de personas</strong> en sus procesos más difíciles</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-gray-700 italic">
                    "Mi enfoque combina una profunda solidez profesional con una calidez humana que te hará 
                    sentir en un espacio seguro y verdaderamente acompañado."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta Exclusiva Pioneros */}
      <section id="detalles" className="py-12 sm:py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-white bg-opacity-20 px-6 py-3 rounded-full mb-6">
              <span className="text-xl font-bold">🚀 OFERTA EXCLUSIVA PIONEROS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Una Invitación Especial para Ser Pionero de tu Bienestar
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Este taller es la puerta de entrada a nuestra nueva comunidad de crecimiento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full mb-6">
                  <span className="text-5xl font-bold">$20.000 COP</span>
                  <span className="block text-sm mt-1">Primer Mes Completo</span>
                </div>
                <p className="text-xl text-gray-700 font-semibold">
                  Al inscribirte al taller, obtienes un mes completo de acceso a TODA la plataforma
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-purple-600 mb-4">✅ Incluye:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Acceso al taller "Navegando las Olas del Duelo"</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>TODOS los cursos grabados en video</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Dos (2) talleres EN VIVO al mes</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Comunidad y foros privados</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-purple-600 mb-4">💎 Beneficio Pionero:</h3>
                  <p className="text-lg mb-4">
                    Al continuar después del primer mes, asegurarás un <strong>precio especial PARA SIEMPRE</strong>
                  </p>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 line-through">$80.000/mes</span>
                      <span className="text-red-600 font-bold">Precio regular</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-purple-600">$49.000/mes</span>
                      <span className="text-green-600 font-bold">Tu precio pionero</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    Este precio especial se mantendrá para ti de por vida mientras mantengas tu suscripción activa
                  </p>
                </div>
              </div>

              <div className="text-center">
                <a href="https://checkout.wompi.co/l/xnaPPY" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl shadow-lg transform transition hover:scale-105">
                  Inscribirme Ahora como Pionero
                </a>
                <p className="text-sm text-gray-600 mt-4">
                  Plazas limitadas • Precio especial por tiempo limitado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles del Taller */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Detalles del Taller
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Duración</h3>
              <p className="text-gray-700">2 horas de contenido valioso y acompañamiento profesional</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modalidad</h3>
              <p className="text-gray-700">100% en línea a través de Google Meet desde cualquier lugar</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fecha y Hora</h3>
              <p className="text-gray-700 font-semibold">[Próximamente]</p>
              <p className="text-sm text-gray-600 mt-2">Se anunciará pronto</p>
            </div>
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              🌊 ¿Por qué este taller?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-2xl mr-3">💙</span>
                <p className="text-gray-700">Un espacio seguro y confidencial donde puedes ser tú mismo sin juicios</p>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🤝</span>
                <p className="text-gray-700">Acompañamiento profesional con más de 15 años de experiencia</p>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🌱</span>
                <p className="text-gray-700">Herramientas prácticas para navegar el duelo de forma saludable</p>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <p className="text-gray-700">Una comunidad que entiende tu proceso y camina contigo</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            No Dejes que las Olas te Arrastren
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Aprende a navegarlas, a encontrar la calma en medio de la tormenta y a descubrir la fortaleza que reside en ti.
            <span className="block mt-4 text-2xl font-semibold text-purple-300">
              Este es el momento de darte el permiso de sanar y crecer.
            </span>
          </p>
          <Link href="https://checkout.wompi.co/l/xnaPPY" className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-5 px-12 rounded-lg text-xl shadow-2xl transform transition hover:scale-105">
            Inscribirme como Pionero • $20.000
          </Link>
          <p className="text-gray-400 mt-6 text-sm">
            Plazas limitadas • Acceso inmediato a toda la plataforma
          </p>
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
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Planes
                  </Link>
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
