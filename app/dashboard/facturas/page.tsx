import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function FacturasPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const facturas = [
    {
      id: 'INV-2024-009',
      fecha: '15 Sep 2024',
      concepto: 'Suscripción Premium - Septiembre 2024',
      estado: 'Pagada',
      monto: 29.99,
      metodo: 'Visa •••• 4242'
    },
    {
      id: 'INV-2024-008',
      fecha: '15 Ago 2024',
      concepto: 'Suscripción Premium - Agosto 2024',
      estado: 'Pagada',
      monto: 29.99,
      metodo: 'Visa •••• 4242'
    },
    {
      id: 'INV-2024-007',
      fecha: '15 Jul 2024',
      concepto: 'Suscripción Premium - Julio 2024',
      estado: 'Pagada',
      monto: 29.99,
      metodo: 'Visa •••• 4242'
    },
    {
      id: 'INV-2024-006',
      fecha: '15 Jun 2024',
      concepto: 'Suscripción Premium - Junio 2024',
      estado: 'Pagada',
      monto: 29.99,
      metodo: 'Visa •••• 4242'
    },
    {
      id: 'INV-2024-005',
      fecha: '15 May 2024',
      concepto: 'Suscripción Premium - Mayo 2024',
      estado: 'Pagada',
      monto: 29.99,
      metodo: 'Visa •••• 4242'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facturas y Pagos</h1>
          <p className="mt-2 text-gray-600">
            Historial completo de tus facturas y pagos
          </p>
        </div>

        {/* Resumen de Facturación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Facturación</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">€149.95</div>
              <div className="text-sm text-gray-600">Total pagado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Facturas pagadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">€29.99</div>
              <div className="text-sm text-gray-600">Próximo pago</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15 Oct</div>
              <div className="text-sm text-gray-600">Fecha próximo pago</div>
            </div>
          </div>
        </div>

        {/* Filtros y Acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Todos los estados</option>
                <option>Pagadas</option>
                <option>Pendientes</option>
                <option>Vencidas</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Último año</option>
                <option>Últimos 6 meses</option>
                <option>Últimos 3 meses</option>
                <option>Este mes</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Descargar Todas
            </button>
          </div>
        </div>

        {/* Lista de Facturas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Historial de Facturas</h2>
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
                {facturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{factura.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{factura.fecha}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{factura.concepto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{factura.metodo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">€{factura.monto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Ver</button>
                        <button className="text-blue-600 hover:text-blue-700">Descargar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Información de Facturación</h3>
              <div className="text-sm text-blue-700 mt-1">
                <p>• Las facturas se generan automáticamente el día 15 de cada mes</p>
                <p>• Puedes descargar tus facturas en formato PDF</p>
                <p>• Para cambios en la información de facturación, contacta con soporte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}