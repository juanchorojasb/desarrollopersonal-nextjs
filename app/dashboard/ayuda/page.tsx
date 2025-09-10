import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AyudaPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const faqItems = [
    {
      question: "¿Cómo puedo acceder a mis cursos?",
      answer: "Puedes acceder a todos tus cursos desde la sección 'Cursos' en el menú lateral del dashboard. Allí encontrarás tanto los cursos en progreso como los completados."
    },
    {
      question: "¿Puedo descargar el contenido de los cursos?",
      answer: "Sí, con tu suscripción Premium puedes descargar todos los materiales del curso, incluyendo PDFs, audios y recursos adicionales."
    },
    {
      question: "¿Cómo cancelo mi suscripción?",
      answer: "Puedes cancelar tu suscripción en cualquier momento desde la sección 'Suscripción' en tu dashboard. Mantendrás acceso hasta el final del período pagado."
    },
    {
      question: "¿Los certificados tienen validez oficial?",
      answer: "Nuestros certificados son de finalización del curso y están respaldados por nuestra institución. Son válidos para desarrollo profesional y personal."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda</h1>
          <p className="mt-2 text-gray-600">
            Encuentra respuestas y obtén el soporte que necesitas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar de Ayuda */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto Directo</h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-gray-600">soporte@desarrollopersonal.uno</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600 mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Chat en Vivo</div>
                    <div className="text-sm text-gray-600">Lun-Vie 9:00-18:00</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-purple-600 mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Teléfono</div>
                    <div className="text-sm text-gray-600">+34 900 123 456</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Iniciar Chat
              </button>
            </div>

            {/* Estado del Sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plataforma</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Videos</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pagos</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Búsqueda */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Buscar en la ayuda..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Buscar
                </button>
              </div>
            </div>

            {/* Categorías de Ayuda */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Categorías de Ayuda</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-3">📚</div>
                    <h3 className="font-medium text-gray-900">Cursos y Contenido</h3>
                  </div>
                  <p className="text-sm text-gray-600">Cómo acceder y navegar por los cursos</p>
                </a>
                
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-3">💳</div>
                    <h3 className="font-medium text-gray-900">Suscripciones y Pagos</h3>
                  </div>
                  <p className="text-sm text-gray-600">Gestionar tu plan y métodos de pago</p>
                </a>
                
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-3">👤</div>
                    <h3 className="font-medium text-gray-900">Cuenta y Perfil</h3>
                  </div>
                  <p className="text-sm text-gray-600">Configurar tu perfil y preferencias</p>
                </a>
                
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-3">🛠️</div>
                    <h3 className="font-medium text-gray-900">Problemas Técnicos</h3>
                  </div>
                  <p className="text-sm text-gray-600">Resolver problemas de la plataforma</p>
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preguntas Frecuentes</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between">
                      {item.question}
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="px-4 pb-3 text-sm text-gray-600">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todas las preguntas frecuentes →
              </button>
            </div>

            {/* Formulario de Contacto */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Enviar Consulta</h2>
              
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Problema técnico</option>
                      <option>Consulta sobre curso</option>
                      <option>Problema de pago</option>
                      <option>Sugerencia</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Baja</option>
                      <option>Media</option>
                      <option>Alta</option>
                      <option>Urgente</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Describe tu consulta con el mayor detalle posible..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 mr-2" />
                  <label className="text-sm text-gray-600">
                    Recibir copia del mensaje por email
                  </label>
                </div>
                
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Enviar Consulta
                </button>
              </form>
            </div>

            {/* Recursos Adicionales */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recursos Adicionales</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <a href="#" className="text-center p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                  <div className="text-2xl mb-2">📖</div>
                  <div className="text-sm font-medium text-gray-900">Guía de Usuario</div>
                </a>
                <a href="#" className="text-center p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                  <div className="text-2xl mb-2">🎥</div>
                  <div className="text-sm font-medium text-gray-900">Video Tutoriales</div>
                </a>
                <a href="#" className="text-center p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-sm font-medium text-gray-900">Comunidad</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}