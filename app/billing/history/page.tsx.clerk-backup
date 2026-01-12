import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function BillingHistoryPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const billingHistory = [
    {
      id: 'INV-2024-012',
      fecha: '10 Sep 2024',
      concepto: 'Suscripción Premium - Septiembre 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-011',
      fecha: '10 Ago 2024',
      concepto: 'Suscripción Premium - Agosto 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-010',
      fecha: '10 Jul 2024',
      concepto: 'Suscripción Premium - Julio 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-009',
      fecha: '10 Jun 2024',
      concepto: 'Suscripción Premium - Junio 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-008',
      fecha: '10 May 2024',
      concepto: 'Suscripción Premium - Mayo 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-007',
      fecha: '10 Abr 2024',
      concepto: 'Suscripción Premium - Abril 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'PayPal',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-006',
      fecha: '10 Mar 2024',
      concepto: 'Suscripción Premium - Marzo 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2024-005',
      fecha: '10 Feb 2024',
      concepto: 'Suscripción Premium - Febrero 2024',
      estado: 'Fallida',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: null
    },
    {
      id: 'INV-2024-004',
      fecha: '10 Ene 2024',
      concepto: 'Suscripción Premium - Enero 2024',
      estado: 'Pagada',
      monto: 36.29,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    },
    {
      id: 'INV-2023-012',
      fecha: '10 Dec 2023',
      concepto: 'Suscripción Premium - Diciembre 2023',
      estado: 'Pagada',
      monto: 34.99,
      metodo: 'Visa •••• 4242',
      facturaUrl: '#'
    }
  ]

  const totalPagado = billingHistory
    .filter(item => item.estado === 'Pagada')
    .reduce((sum, item) => sum + item.monto, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historial de Facturación</h1>
          <p className="mt-2 text-gray-600">
            Historial completo de todos tus pagos y transacciones
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalPagado.toFixed(2)}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Facturas</p>
                <p className="text-2xl font-semibold text-gray-900">{billingHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagos Exitosos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {billingHistory.filter(item => item.estado === 'Pagada').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Próximo Pago</p>
                <p className="text-2xl font-semibold text-gray-900">10 Oct</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="all">Todos</option>
                  <option value="paid">Pagadas</option>
                  <option value="failed">Fallidas</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="all">Todos</option>
                  <option value="card">Tarjeta</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Transferencia</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                Filtrar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Exportar PDF
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Exportar Excel
              </button>
            </div>
          </div>
        </div>

        {/* Billing History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Historial Detallado</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.fecha}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.concepto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.metodo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.estado === 'Pagada' 
                          ? 'bg-green-100 text-green-800'
                          : item.estado === 'Fallida'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">€{item.monto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Ver</button>
                        {item.facturaUrl && (
                          <button className="text-blue-600 hover:text-blue-700">Descargar</button>
                        )}
                        {item.estado === 'Fallida' && (
                          <button className="text-red-600 hover:text-red-700">Reintentar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
            <span className="font-medium">{billingHistory.length}</span> resultados
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50" disabled>
              Anterior
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</span>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
              Siguiente
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Información Importante</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Las facturas se conservan durante 7 años para fines fiscales</li>
                <li>• Puedes descargar facturas en formato PDF en cualquier momento</li>
                <li>• Los reembolsos aparecerán como créditos en futuras facturas</li>
                <li>• Para cambios en datos de facturación, contacta con soporte</li>
                <li>• Los impuestos se calculan según la legislación vigente en tu país</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}