import Link from 'next/link';
import LandingNavbar from '@/components/LandingNavbar';
import {
  BookOpen,
  Users,
  Video,
  Award,
  ArrowRight,
  CheckCircle,
  Podcast,
  Play,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <LandingNavbar />
      
      {/* Espaciador para el navbar fijo */}
      <div className="h-16"></div>

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

      {/* Video de Muestra */}
      <section id="cursos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎥 Video de Muestra
            </h2>
            <p className="text-xl text-gray-600">
              Descubre cómo nuestros cursos transforman vidas
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-video bg-gray-900">
                <iframe
                  src="https://iframe.mediadelivery.net/embed/476857/223f7db8-6c19-41ed-b6a5-993cfa6aff76?autoplay=false&loop=false&muted=false&preload=true"
                  loading="lazy"
                  className="w-full h-full border-0"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Gestión de Emociones para Empresarios
                </h3>
                <p className="text-gray-600 mb-4">
                  Aprende técnicas prácticas para regular tus emociones en el entorno empresarial y tomar mejores decisiones bajo presión.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>26 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Nivel: Intermedio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>5 lecciones</span>
                  </div>
                </div>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Acceder al Curso Completo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Cursos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📚 Nuestros Cursos
            </h2>
            <p className="text-xl text-gray-600">
              8 cursos completos diseñados por psicólogos profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Gestión de Emociones',
                description: 'Aprende a identificar, comprender y regular tus emociones para mejorar tu bienestar.',
                lessons: 5,
                duration: '2h 30min',
                level: 'Intermedio',
                icon: '😊'
              },
              {
                title: 'Hábitos de Estudio',
                description: 'Desarrolla técnicas efectivas para optimizar tu aprendizaje y rendimiento.',
                lessons: 3,
                duration: '1h 45min',
                level: 'Básico',
                icon: '📖'
              },
              {
                title: 'GPS Salud Mental',
                description: 'Una guía práctica para navegar tu salud mental con herramientas basadas en neurociencia.',
                lessons: 4,
                duration: '1h 20min',
                level: 'Básico',
                icon: '🧭'
              },
              {
                title: 'Arquitectura del Sueño',
                description: 'Descubre los secretos del sueño reparador para una vida más saludable.',
                lessons: 5,
                duration: '2h 15min',
                level: 'Básico',
                icon: '😴'
              },
              {
                title: 'Gestionando la Depresión',
                description: 'Herramientas basadas en evidencia para comprender y manejar la depresión.',
                lessons: 3,
                duration: '1h 30min',
                level: 'Intermedio',
                icon: '🌱'
              },
              {
                title: 'Emociones en Equilibrio',
                description: 'Mantén el equilibrio emocional en tu vida cotidiana con técnicas prácticas.',
                lessons: 7,
                duration: '3h 15min',
                level: 'Intermedio',
                icon: '⚖️'
              },
              {
                title: 'Neurocalma',
                description: 'Técnicas neurocientíficas para gestionar el estrés y la ansiedad.',
                lessons: 9,
                duration: '4h 10min',
                level: 'Intermedio',
                icon: '🧠'
              },
              {
                title: 'Navegando la Tormenta Interior',
                description: 'Atraviesa los momentos difíciles de la vida con resiliencia.',
                lessons: 5,
                duration: '2h 5min',
                level: 'Avanzado',
                icon: '⛈️'
              }
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {course.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>{course.lessons} lecciones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Nivel: {course.level}</span>
                  </div>
                </div>
                <Link
                  href="/auth/signup"
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ver Curso
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talleres en Vivo */}
      <section id="talleres" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎓 Talleres en Vivo
            </h2>
            <p className="text-xl text-gray-600">
              Sesiones interactivas mensuales con psicóloga profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-xl p-8">
              <Calendar className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Sesiones Mensuales</h3>
              <p className="text-purple-100 mb-4">
                Dos talleres interactivos cada mes sobre temas de desarrollo personal y salud mental.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Grupos reducidos (máx. 20 personas)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Sesiones de 90 minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Ejercicios prácticos en vivo</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-purple-200">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Próximos Talleres</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="text-sm text-gray-500 mb-1">Febrero 2026</div>
                  <div className="font-semibold text-gray-900">Manejo del Estrés Laboral</div>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <div className="text-sm text-gray-500 mb-1">Marzo 2026</div>
                  <div className="font-semibold text-gray-900">Inteligencia Emocional</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="text-sm text-gray-500 mb-1">Abril 2026</div>
                  <div className="font-semibold text-gray-900">Resiliencia y Adaptación</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              Reservar Mi Lugar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Podcast */}
      <section id="podcast" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="md:flex items-center">
              <div className="md:w-1/2 p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Podcast className="w-12 h-12 text-white" />
                  <span className="text-white text-lg font-semibold">Podcast Semanal</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Desarrollo Personal en tu Día a Día
                </h2>
                <p className="text-pink-100 text-lg mb-6">
                  Episodios semanales con tips prácticos, entrevistas y reflexiones sobre crecimiento personal.
                </p>
                <ul className="space-y-3 mb-8 text-white">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Episodios de 20-30 minutos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Contenido exclusivo para suscriptores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Disponible en todas las plataformas</span>
                  </li>
                </ul>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Escuchar Ahora
                  <Play className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-1/2 bg-white/10 backdrop-blur p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎙️</div>
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-pink-100">Episodios Disponibles</div>
                </div>
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
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cursos en Video de Calidad
              </h3>
              <p className="text-gray-600">
                Contenido profesional creado por psicólogos certificados
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Talleres Interactivos
              </h3>
              <p className="text-gray-600">
                Sesiones en vivo cada mes para profundizar tu aprendizaje
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
                Sesiones 1:1 con psicóloga profesional para tu crecimiento
              </p>
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
