import { getCurrentUser } from '@/lib/server-auth'
import { redirect } from 'next/navigation'

export default async function AdminPaymentsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Mock data for admin dashboard
  const paymentStats = {
    totalRevenue: 125486.50,
    monthlyRevenue: 15230.00,
    activeSubscriptions: 342,
    churnRate: 2.8,
    avgRevenuePerUser: 29.99,
    refundRate: 0.5
  }

  const recentPayments = [
    {
      id: 'TXN-2024-1001',
      user: 'María González',
      email: 'maria.gonzalez@email.com',
      plan: 'Premium',
      amount: 36.29,
      status: 'Completado',
      date: '10 Sep 2024 14:30',
      method: 'Visa •••• 4242',
      country: 'España'
    },
    {
      id: 'TXN-2024-1000',
      user: 'Carlos Ruiz',
      email: 'carlos.ruiz@email.com',
      plan: 'Pro',
      amount: 96.89,
      status: 'Completado',
      date: '10 Sep 2024 12:15',
      method: 'PayPal',
      country: 'México'
    },
    {
      id: 'TXN-2024-999',
      user: 'Ana Martín',
      email: 'ana.martin@email.com',
      plan: 'Premium',
      amount: 36.29,
      status: 'Fallido',
      date: '10 Sep 2024 10:45',
      method: 'Visa •••• 1234',
      country: 'Argentina'
    },
    {
      id: 'TXN-2024-998',
      user: 'Luis García',
      email: 'luis.garcia@email.com',
      plan: 'Premium',
      amount: 36.29,
      status: 'Procesando',
      date: '10 Sep 2024 09:20',
      method: 'MasterCard •••• 5678',
      country: 'Colombia'
    },
    {
      id: 'TXN-2024-997',
      user: 'Sofia López',
      email: 'sofia.lopez@email.com',
      plan: 'Pro',
      amount: 96.89,
      status: 'Completado',
      date: '09 Sep 2024 18:30',
      method: 'Visa •••• 9876',
      country: 'España'
    }
  ]

  const subscriptionsByPlan = [
    { plan: 'Básico', count: 1234, percentage: 65.2, color: 'bg-gray-500' },
    { plan: 'Premium', count: 543, percentage: 28.7, color: 'bg-blue-500' },
    { plan: 'Pro', count: 116, percentage: 6.1, color: 'bg-purple-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Pagos Admin</h1>
              <p className="mt-2 text-gray-600">
                Gestión y monitoreo de pagos y suscripciones
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                Exportar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Refrescar
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">€{paymentStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12.5% mes anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-semibold text-gray-900">€{paymentStats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-blue-600">Meta: €18,000</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suscripciones</p>
                <p className="text-2xl font-semibold text-gray-900">{paymentStats.activeSubscriptions}</p>
                <p className="text-sm text-purple-600">+8.2% este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ARPU</p>
                <p className="text-2xl font-semibold text-gray-900">€{paymentStats.avgRevenuePerUser}</p>
                <p className="text-sm text-yellow-600">Promedio por usuario</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{paymentStats.churnRate}%</p>
                <p className="text-sm text-red-600">-0.3% vs mes anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2v1a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 00-2 2v6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refunds</p>
                <p className="text-2xl font-semibold text-gray-900">{paymentStats.refundRate}%</p>
                <p className="text-sm text-orange-600">Normal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Payments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Pagos Recientes</h2>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 rounded-lg px-2 py-1">
                    <option>Todos</option>
                    <option>Completados</option>
                    <option>Fallidos</option>
                    <option>Procesando</option>
                  </select>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Ver todos</button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{payment.id}</td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                          <div className="text-xs text-gray-600">{payment.email}</div>
                          <div className="text-xs text-gray-500">{payment.country}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{payment.plan}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">€{payment.amount}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'Completado' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'Fallido'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">Ver</button>
                          {payment.status === 'Fallido' && (
                            <button className="text-red-600 hover:text-red-700">Reembolso</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Distribución por Plan</h2>
            
            <div className="space-y-4">
              {subscriptionsByPlan.map((plan, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{plan.plan}</span>
                    <span className="text-sm font-semibold text-gray-900">{plan.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${plan.color}`}
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{plan.percentage}%</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Total Activas:</span>
                <span className="font-semibold text-gray-900">
                  {subscriptionsByPlan.reduce((sum, plan) => sum + plan.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros y Búsqueda</h2>
          
          <div className="grid lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Todos</option>
                <option>Completado</option>
                <option>Fallido</option>
                <option>Procesando</option>
                <option>Reembolsado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Todos</option>
                <option>Básico</option>
                <option>Premium</option>
                <option>Pro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Todos</option>
                <option>España</option>
                <option>México</option>
                <option>Argentina</option>
                <option>Colombia</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Aplicar Filtros
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Usuario</label>
            <input 
              type="text" 
              placeholder="Buscar por email, nombre o ID de transacción..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          
          <div className="grid lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900 mb-1">Generar Reporte</h3>
              <p className="text-sm text-gray-600">Reporte mensual de pagos</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-2xl mb-2">💳</div>
              <h3 className="font-medium text-gray-900 mb-1">Pagos Fallidos</h3>
              <p className="text-sm text-gray-600">Revisar y procesar</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-2xl mb-2">↩️</div>
              <h3 className="font-medium text-gray-900 mb-1">Reembolsos</h3>
              <p className="text-sm text-gray-600">Gestionar solicitudes</p>
            </button>
            
            <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-medium text-gray-900 mb-1">Configuración</h3>
              <p className="text-sm text-gray-600">Ajustes de pagos</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}