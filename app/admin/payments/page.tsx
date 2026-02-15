import { prisma } from '@/lib/prisma';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';

async function getPaymentsData() {
  const [freeUsers, basicUsers, completeUsers, personalUsers] = await Promise.all([
    prisma.user.count({ where: { subscriptionStatus: 'free' } }),
    prisma.user.count({ where: { subscriptionStatus: 'basic' } }),
    prisma.user.count({ where: { subscriptionStatus: 'complete' } }),
    prisma.user.count({ where: { subscriptionStatus: 'personal' } }),
  ]);

  // Cálculo de ingresos mensuales estimados
  const monthlyRevenue = (basicUsers * 25000) + (completeUsers * 50000) + (personalUsers * 160000);

  return {
    freeUsers,
    basicUsers,
    completeUsers,
    personalUsers,
    monthlyRevenue,
    totalPaidUsers: basicUsers + completeUsers + personalUsers,
  };
}

export default async function AdminPaymentsPage() {
  const data = await getPaymentsData();

  const plans = [
    { name: 'Gratis', users: data.freeUsers, price: 0, color: 'bg-gray-100 text-gray-800' },
    { name: 'Básico', users: data.basicUsers, price: 25000, color: 'bg-blue-100 text-blue-800' },
    { name: 'Completo', users: data.completeUsers, price: 50000, color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Personal', users: data.personalUsers, price: 160000, color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes de Pagos</h1>
        <p className="text-gray-600 mt-2">Vista general de suscripciones e ingresos</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-sm font-medium">Mensual</span>
          </div>
          <p className="text-3xl font-bold">
            ${(data.monthlyRevenue / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-green-100">COP</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Usuarios</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.totalPaidUsers}</p>
          <p className="text-sm text-gray-500">De pago</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Tasa</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {data.freeUsers + data.totalPaidUsers > 0 
              ? ((data.totalPaidUsers / (data.freeUsers + data.totalPaidUsers)) * 100).toFixed(1)
              : 0}%
          </p>
          <p className="text-sm text-gray-500">Conversión</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Promedio</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${data.totalPaidUsers > 0 ? (data.monthlyRevenue / data.totalPaidUsers / 1000).toFixed(0) : 0}K
          </p>
          <p className="text-sm text-gray-500">Por usuario</p>
        </div>
      </div>

      {/* Plans Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución por Plan</h2>
        <div className="space-y-4">
          {plans.map((plan) => {
            const percentage = data.freeUsers + data.totalPaidUsers > 0
              ? (plan.users / (data.freeUsers + data.totalPaidUsers)) * 100
              : 0;
            const revenue = plan.users * plan.price;

            return (
              <div key={plan.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${plan.color}`}>
                      {plan.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${(plan.price / 1000).toFixed(0)}K COP/mes
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{plan.users} usuarios</p>
                    <p className="text-sm text-gray-500">
                      ${(revenue / 1000).toFixed(0)}K/mes
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% del total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
