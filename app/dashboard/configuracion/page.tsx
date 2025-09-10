import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ConfiguracionPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tu cuenta y preferencias
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar de Configuración */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#cuenta" className="block px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                    Cuenta
                  </a>
                </li>
                <li>
                  <a href="#notificaciones" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    Notificaciones
                  </a>
                </li>
                <li>
                  <a href="#privacidad" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#seguridad" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    Seguridad
                  </a>
                </li>
                <li>
                  <a href="#preferencias" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    Preferencias
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Información de Cuenta */}
            <div id="cuenta" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Información de Cuenta</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Guardar Cambios
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input 
                    type="text" 
                    defaultValue={user.firstName || ''} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input 
                    type="text" 
                    defaultValue={user.lastName || ''} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    defaultValue={user.emailAddresses[0]?.emailAddress || ''} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Cuéntanos un poco sobre ti..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Configuración de Notificaciones */}
            <div id="notificaciones" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notificaciones</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Notificaciones por Email</div>
                    <div className="text-sm text-gray-600">Recibe updates sobre cursos y talleres</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Recordatorios de Talleres</div>
                    <div className="text-sm text-gray-600">Alertas 24h antes de talleres en vivo</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Newsletter Semanal</div>
                    <div className="text-sm text-gray-600">Resumen semanal de progreso y contenido nuevo</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Promociones</div>
                    <div className="text-sm text-gray-600">Ofertas especiales y descuentos</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Configuración de Privacidad */}
            <div id="privacidad" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacidad</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Perfil Público</div>
                    <div className="text-sm text-gray-600">Permite que otros usuarios vean tu perfil</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Mostrar Progreso</div>
                    <div className="text-sm text-gray-600">Mostrar tu progreso en la comunidad</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Analytics</div>
                    <div className="text-sm text-gray-600">Ayúdanos a mejorar con datos anónimos</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Configuración de Seguridad */}
            <div id="seguridad" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguridad</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cambiar Contraseña</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input 
                      type="password" 
                      placeholder="Contraseña actual"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input 
                      type="password" 
                      placeholder="Nueva contraseña"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Actualizar Contraseña
                  </button>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Autenticación de Dos Factores</div>
                      <div className="text-sm text-gray-600">Agrega una capa extra de seguridad</div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                      Activar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferencias */}
            <div id="preferencias" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferencias</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="ca">Català</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Horaria
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    <option value="Europe/London">London (GMT+0)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Fecha
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Zona de Peligro */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Zona de Peligro</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-red-900">Eliminar Cuenta</div>
                      <div className="text-sm text-red-700">Esta acción no se puede deshacer</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Eliminar Cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}