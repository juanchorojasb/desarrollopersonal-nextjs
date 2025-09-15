export const dynamic = "force-dynamic";
import { requireAdminAccess } from '@/lib/admin-access';

// Datos simulados de códigos promocionales
const mockPromoCodes = [
  {
    id: '1',
    code: 'PRUEBA',
    description: 'Mes gratis para nuevos usuarios',
    discount: 100,
    type: 'percentage',
    uses: 15,
    maxUses: 100,
    active: true,
    expiresAt: new Date('2024-12-31')
  }
];

export default async function PromocionesPage() {
  const { hasAccess } = await requireAdminAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para gestionar promociones.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Códigos Promocionales</h1>
        <p className="text-gray-600">Gestiona descuentos y promociones</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Códigos Activos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPromoCodes.map((promo) => (
                <tr key={promo.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{promo.code}</div>
                      <div className="text-sm text-gray-500">{promo.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{promo.discount}%</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{promo.uses}/{promo.maxUses}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
