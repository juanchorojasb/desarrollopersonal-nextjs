import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar del Perfil */}
          <div className="lg:col-span-1">
            {/* Avatar y Info Básica */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name?.split(' ')[0]?.[0] || 'U'}{user.name?.split(' ')[1]?.[0] || ''}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name?.split(' ')[0]} {user.name?.split(' ')[1]}
                </h3>
                <p className="text-sm text-gray-600">
                  {user.email}
                </p>
                <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                  Cambiar foto
                </button>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cursos completados</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Horas de estudio</span>
                  <span className="font-semibold text-gray-900">24h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certificados</span>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nivel actual</span>
                  <span className="font-semibold text-purple-600">Intermedio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Editar
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="text-gray-900">
                    {user.name?.split(' ')[0]} {user.name?.split(' ')[1]}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="text-gray-900">
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="text-gray-900">
                    +34 600 000 000
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de nacimiento
                  </label>
                  <div className="text-gray-900">
                    15/03/1990
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <div className="text-gray-900">
                    Madrid, España
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesión
                  </label>
                  <div className="text-gray-900">
                    Marketing Digital
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <div className="text-gray-900">
                    Apasionado del crecimiento personal y el desarrollo profesional. 
                    Siempre en busca de nuevas herramientas y técnicas para mejorar mi bienestar y productividad.
                  </div>
                </div>
              </div>
            </div>

            {/* Objetivos de Desarrollo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Objetivos de Desarrollo</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Gestión del Estrés</h3>
                    <span className="text-sm text-green-600">En progreso</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aprender técnicas de mindfulness y relajación para manejar mejor las situaciones de estrés.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Liderazgo</h3>
                    <span className="text-sm text-blue-600">Planificado</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Desarrollar habilidades de liderazgo y comunicación efectiva para mi crecimiento profesional.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Productividad Personal</h3>
                    <span className="text-sm text-purple-600">Completado</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Implementar sistemas y herramientas para optimizar mi tiempo y aumentar mi productividad.
                  </p>
                </div>
              </div>
              
              <button className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                Añadir Objetivo
              </button>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Completaste el curso "Gestión del Tiempo"</p>
                    <p className="text-xs text-gray-500">Hace 2 días</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">🏆</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Obtuviste el logro "Estudiante Dedicado"</p>
                    <p className="text-xs text-gray-500">Hace 5 días</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">📚</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Iniciaste el curso "Mindfulness Avanzado"</p>
                    <p className="text-xs text-gray-500">Hace 1 semana</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">⭐</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Alcanzaste el nivel Intermedio</p>
                    <p className="text-xs text-gray-500">Hace 2 semanas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificados y Logros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Certificados y Logros</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">🎓</span>
                    </div>
                    <h3 className="font-medium text-gray-900">Gestión del Tiempo</h3>
                  </div>
                  <p className="text-sm text-gray-600">Certificado obtenido el 20/09/2024</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Descargar certificado
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">🎓</span>
                    </div>
                    <h3 className="font-medium text-gray-900">Mindfulness Básico</h3>
                  </div>
                  <p className="text-sm text-gray-600">Certificado obtenido el 15/09/2024</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Descargar certificado
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 text-sm">🏆</span>
                    </div>
                    <h3 className="font-medium text-gray-900">Estudiante Dedicado</h3>
                  </div>
                  <p className="text-sm text-gray-600">Logro obtenido el 10/09/2024</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-yellow-600 text-sm">⭐</span>
                    </div>
                    <h3 className="font-medium text-gray-900">Nivel Intermedio</h3>
                  </div>
                  <p className="text-sm text-gray-600">Logro obtenido el 01/09/2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}