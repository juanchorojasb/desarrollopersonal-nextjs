'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Receipt,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Filter,
  Calendar,
  Search,
  ExternalLink,
  ArrowUpDown
} from 'lucide-react';
import { geolocationService } from '@/lib/geolocation';

interface PaymentTransaction {
  id: string;
  referenceCode: string;
  amount: number;
  currency: string;
  country: string;
  status: string;
  paymentMethod?: string;
  description?: string;
  createdAt: string;
  processedAt?: string;
  confirmedAt?: string;
  subscription?: {
    id: string;
    plan: {
      name: string;
      description: string;
    };
  };
}

interface PaymentHistory {
  transactions: PaymentTransaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function FacturasPage() {
  const { user } = useUser();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchPaymentHistory();
  }, [filters, sortBy, sortOrder]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Since we don't have a payment history endpoint yet, let's create mock data
      // In production, this would be: const response = await fetch('/api/payments/history');
      
      const mockTransactions: PaymentTransaction[] = [
        {
          id: '1',
          referenceCode: 'DP_user123_premium_1234567890',
          amount: 3990000, // COP in centavos
          currency: 'COP',
          country: 'CO',
          status: 'APPROVED',
          paymentMethod: 'Visa ****1234',
          description: 'Plan Premium - Mensual',
          createdAt: '2025-01-08T10:30:00Z',
          processedAt: '2025-01-08T10:32:15Z',
          confirmedAt: '2025-01-08T10:32:15Z',
          subscription: {
            id: 'sub1',
            plan: {
              name: 'premium',
              description: 'Plan Premium'
            }
          }
        },
        {
          id: '2',
          referenceCode: 'DP_user123_basic_1234567891',
          amount: 1990000, // COP in centavos
          currency: 'COP',
          country: 'CO',
          status: 'DECLINED',
          paymentMethod: 'Mastercard ****5678',
          description: 'Plan Básico - Mensual',
          createdAt: '2025-01-05T15:20:00Z',
          processedAt: '2025-01-05T15:22:30Z',
          subscription: {
            id: 'sub2',
            plan: {
              name: 'basic',
              description: 'Plan Básico'
            }
          }
        },
        {
          id: '3',
          referenceCode: 'DP_user123_premium_1234567892',
          amount: 10773000, // COP in centavos (quarterly)
          currency: 'COP',
          country: 'CO',
          status: 'PENDING',
          description: 'Plan Premium - Trimestral',
          createdAt: '2025-01-09T08:15:00Z',
          subscription: {
            id: 'sub3',
            plan: {
              name: 'premium',
              description: 'Plan Premium'
            }
          }
        }
      ];

      // Filter transactions based on current filters
      let filteredTransactions = mockTransactions;

      if (filters.status !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => 
          t.status.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.search) {
        filteredTransactions = filteredTransactions.filter(t =>
          t.referenceCode.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.paymentMethod?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Sort transactions
      filteredTransactions.sort((a, b) => {
        if (sortBy === 'date') {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
      });

      setPaymentHistory({
        transactions: filteredTransactions,
        totalCount: filteredTransactions.length,
        totalPages: 1,
        currentPage: 1
      });

    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Error cargando el historial de pagos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      APPROVED: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800',
        label: 'Aprobado'
      },
      DECLINED: {
        icon: XCircle,
        className: 'bg-red-100 text-red-800',
        label: 'Rechazado'
      },
      PENDING: {
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Pendiente'
      },
      ERROR: {
        icon: XCircle,
        className: 'bg-red-100 text-red-800',
        label: 'Error'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    const displayAmount = currency === 'COP' ? amount / 100 : amount / 100;
    return geolocationService.formatCurrency(displayAmount, currency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSort = (newSortBy: 'date' | 'amount') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Receipt className="w-8 h-8 mr-3 text-indigo-600" />
            Historial de Pagos
          </h1>
          <p className="text-gray-600">
            Revisa todas tus transacciones y descarga comprobantes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="approved">Aprobados</option>
                <option value="declined">Rechazados</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los períodos</option>
                <option value="last7days">Últimos 7 días</option>
                <option value="last30days">Últimos 30 días</option>
                <option value="last90days">Últimos 90 días</option>
                <option value="lastyear">Último año</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Código, descripción..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: 'all', dateRange: 'all', search: '' })}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPaymentHistory}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Transacciones ({paymentHistory?.totalCount || 0})
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleSort('date')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm ${
                        sortBy === 'date' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Fecha
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                    <button
                      onClick={() => toggleSort('amount')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm ${
                        sortBy === 'amount' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Monto
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transacción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory?.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 font-mono text-sm">
                              {transaction.referenceCode}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.paymentMethod || 'PayU Latam'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {transaction.subscription?.plan.description || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {formatAmount(transaction.amount, transaction.currency)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.currency} • {transaction.country}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(transaction.createdAt)}
                          </div>
                          {transaction.confirmedAt && transaction.confirmedAt !== transaction.createdAt && (
                            <div className="text-xs text-gray-500">
                              Confirmado: {formatDate(transaction.confirmedAt)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                              title="Descargar comprobante"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {transaction.status === 'APPROVED' && transaction.subscription && (
                              <Link
                                href={`/dashboard/mi-plan`}
                                className="text-gray-600 hover:text-gray-700 text-sm flex items-center"
                                title="Ver suscripción"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {paymentHistory?.transactions.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay transacciones
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No tienes transacciones que coincidan con los filtros seleccionados.
                  </p>
                  <Link
                    href="/pricing"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Ver planes disponibles →
                  </Link>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            {paymentHistory && paymentHistory.transactions.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Pagos Exitosos</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {paymentHistory.transactions.filter(t => t.status === 'APPROVED').length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Pendientes</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {paymentHistory.transactions.filter(t => t.status === 'PENDING').length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Total Pagado</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {formatAmount(
                          paymentHistory.transactions
                            .filter(t => t.status === 'APPROVED')
                            .reduce((sum, t) => sum + t.amount, 0),
                          'COP'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}