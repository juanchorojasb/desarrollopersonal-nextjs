'use client';
import { useState } from 'react';
import { 
  Gift,
  Play,
  Clock,
  Users,
  Star,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Heart
} from 'lucide-react';

export default function CursoGratuitoPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccessCourse = () => {
    setIsLoading(true);
    // Abrir en nueva pestaña
    window.open('https://psicognitiva.thinkific.com/', '_blank');
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const features = [
    'Acceso completo sin restricciones',
    'Contenido de alta calidad',
    'Certificado de finalización',
    'Disponible 24/7',
    'Videos HD con subtítulos',
    'Material descargable'
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Estudiante',
      content: 'Un curso increíble que me ayudó a entender mejor mi bienestar mental.',
      rating: 5
    },
    {
      name: 'Carlos Mendoza',
      role: 'Profesional',
      content: 'Contenido muy valioso y aplicable en mi día a día.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Gift className="h-4 w-4 mr-2" />
            Completamente Gratuito
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Curso Gratuito de 
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Bienestar Mental
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre herramientas prácticas para mejorar tu bienestar mental y emocional. 
            Un curso completo sin costo alguno, diseñado para transformar tu vida.
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              2+ horas de contenido
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              +1,000 estudiantes
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              4.9/5 valoración
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAccessCourse}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Abriendo...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-3" />
                Acceder al Curso Gratuito
                <ExternalLink className="h-5 w-5 ml-3" />
              </>
            )}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Course Preview */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Qué aprenderás?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Técnicas de mindfulness y relajación</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Manejo del estrés y la ansiedad</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Desarrollo de inteligencia emocional</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Construcción de hábitos saludables</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-8">
              <div className="text-center">
                <BookOpen className="h-24 w-24 text-purple-600 mx-auto mb-4" />
                <p className="text-purple-700 font-medium">Contenido estructurado</p>
                <p className="text-purple-600 text-sm">Módulos fáciles de seguir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros estudiantes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            ¡Comienza tu transformación hoy!
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            No esperes más para invertir en tu bienestar. Este curso gratuito es el primer paso 
            hacia una vida más plena y equilibrada.
          </p>
          <button
            onClick={handleAccessCourse}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                Abriendo...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-3" />
                Acceder Ahora
                <ExternalLink className="h-5 w-5 ml-3" />
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Al hacer clic serás redirigido a nuestra plataforma educativa externa en Thinkific
          </p>
        </div>
      </div>
    </div>
  );
}