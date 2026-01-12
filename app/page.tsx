import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  Video, 
  Award,
  ArrowRight,
  CheckCircle,
  Podcast,
  Play
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforma tu Vida con
              <span className="block mt-2">Desarrollo Personal</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Cursos de psicología, talleres en vivo y acompañamiento personal para tu crecimiento emocional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curso Gratuito */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎁 Curso Gratuito
            </h2>
            <p className="text-xl text-gray-600">
              Comienza tu transformación hoy mismo
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="w-20 h-20 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Gestión de Emociones</h3>
                  <p className="text-indigo-100">5 lecciones en video</p>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Aprende a gestionar tus emociones
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Identifica y comprende tus emociones</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Técnicas de regulación emocional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Manejo de emociones difíciles</span>
                  </li>
                </ul>
                <Link
                  href="/auth/signup"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Acceder Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podcast */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎙️ Nuestro Podcast
            </h2>
            <p className="text-xl text-gray-600">
              Escucha episodios sobre desarrollo personal y bienestar emocional
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-8 text-white text-center">
                  <Podcast className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Desarrollo Personal</h3>
                  <p className="text-sm text-green-100 mt-2">En Spotify</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Episodios semanales para tu crecimiento
                </h3>
                <p className="text-gray-600 mb-6">
                  Conversaciones profundas sobre emociones, relaciones, bienestar mental y herramientas prácticas para tu vida diaria.
                </p>
                <a
                
                  href="https://open.spotify.com/episode/6usKPGp3I9FPPgiGSEdim2?si=RskK0ZKvRJypxwpYfTiGKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Escuchar en Spotify
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué DesarrolloPersonal.uno?
            </h2>
            <p className="text-xl text-gray-600">
              Tu plataforma completa de crecimiento personal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cursos en Video
              </h3>
              <p className="text-gray-600">
                8 cursos especializados en desarrollo personal, salud mental y bienestar emocional
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Talleres en Vivo
              </h3>
              <p className="text-gray-600">
                Sesiones interactivas cada mes para profundizar tu aprendizaje
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Acompañamiento Personal
              </h3>
              <p className="text-gray-600">
                Sesiones 1:1 con psicóloga profesional para tu crecimiento personalizado
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Planes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elige el Plan Perfecto para Ti
            </h2>
            <p className="text-xl text-gray-600">
              Planes diseñados para cada etapa de tu crecimiento personal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Plan Gratuito */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-indigo-500 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">Para comenzar</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Curso Gestión de Emociones</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Acceso al Podcast</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="w-full block text-center px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Plan Básico */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-500">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full mb-2">
                  Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$25,000</div>
                <p className="text-gray-600">por mes</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">10 cursos en video</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Curso nuevo cada semana</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Acceso al Podcast</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="w-full block text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Comenzar Ahora
              </Link>
            </div>

            {/* Plan Completo */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-500">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full mb-2">
                  Recomendado
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Completo</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$49,000</div>
                <p className="text-gray-600">por mes</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">2 talleres en vivo al mes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">10 cursos en video + nuevos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Comunidad privada (foros)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Acceso al Podcast</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="w-full block text-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Comenzar Ahora
              </Link>
            </div>

            {/* Plan Personal */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur text-white text-sm font-semibold rounded-full mb-2">
                  Premium
                </div>
                <h3 className="text-2xl font-bold mb-2">Personal</h3>
                <div className="text-4xl font-bold mb-2">$160,000</div>
                <p className="text-pink-100">por mes</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>1 sesión personal 1:1 (1h)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Con psicóloga experta</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>2 talleres en vivo al mes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>10 cursos + nuevos cada semana</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Comunidad privada (foros)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acceso al Podcast</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="w-full block text-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comienza tu transformación hoy
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Únete a cientos de personas que ya están transformando sus vidas
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            Crear Cuenta Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
