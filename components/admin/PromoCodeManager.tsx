'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Percent,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy
} from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  applicablePlans?: string;
  minPurchase?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface PromoCodeFormData {
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: string;
  maxUses?: string;
  validFrom: string;
  validUntil: string;
  applicablePlans: string[];
  minPurchase?: string;
  description?: string;
}

export default function PromoCodeManager() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<PromoCodeFormData>({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxUses: '',
    validFrom: '',
    validUntil: '',
    applicablePlans: [],
    minPurchase: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const availablePlans = [
    { value: 'basic', label: 'Básico' },
    { value: 'complete', label: 'Completo' },
    { value: 'personal', label: 'Personal' }
  ];

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/promo-codes');
      if (response.ok) {
        const codes = await response.json();
        setPromoCodes(codes);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      alert('Error al cargar los códigos promocionales');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      maxUses: '',
      validFrom: '',
      validUntil: '',
      applicablePlans: [],
      minPurchase: '',
      description: ''
    });
    setFormErrors({});
    setEditingCode(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) {
      errors.code = 'El código es requerido';
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      errors.discountValue = 'El valor de descuento debe ser mayor a 0';
    }

    if (formData.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      errors.discountValue = 'El porcentaje no puede ser mayor a 100%';
    }

    if (!formData.validFrom) {
      errors.validFrom = 'La fecha de inicio es requerida';
    }

    if (!formData.validUntil) {
      errors.validUntil = 'La fecha de fin es requerida';
    }

    if (formData.validFrom && formData.validUntil && new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      errors.validUntil = 'La fecha de fin debe ser posterior a la de inicio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        applicablePlans: formData.applicablePlans.length > 0 ? formData.applicablePlans : undefined,
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
        description: formData.description || undefined
      };

      const url = editingCode 
        ? `/api/admin/promo-codes/${editingCode.id}`
        : '/api/admin/promo-codes';
      
      const method = editingCode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchPromoCodes();
        setShowCreateModal(false);
        resetForm();
        alert(`Código promocional ${editingCode ? 'actualizado' : 'creado'} correctamente`);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar el código promocional');
      }
    } catch (error) {
      console.error('Error saving promo code:', error);
      alert('Error al guardar el código promocional');
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      discountType: code.discountType as 'percentage' | 'fixed_amount',
      discountValue: code.discountValue.toString(),
      maxUses: code.maxUses?.toString() || '',
      validFrom: new Date(code.validFrom).toISOString().split('T')[0],
      validUntil: new Date(code.validUntil).toISOString().split('T')[0],
      applicablePlans: code.applicablePlans ? JSON.parse(code.applicablePlans) : [],
      minPurchase: code.minPurchase?.toString() || '',
      description: code.description || ''
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (codeId: string, codeName: string) => {
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar el código "${codeName}"?`);
    
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/promo-codes/${codeId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchPromoCodes();
          alert('Código promocional eliminado correctamente');
        } else {
          const error = await response.json();
          alert(error.error || 'Error al eliminar el código promocional');
        }
      } catch (error) {
        console.error('Error deleting promo code:', error);
        alert('Error al eliminar el código promocional');
      }
    }
  };

  const handleToggleActive = async (codeId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${codeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        await fetchPromoCodes();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al cambiar el estado del código');
      }
    } catch (error) {
      console.error('Error toggling promo code:', error);
      alert('Error al cambiar el estado del código');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Código "${code}" copiado al portapapeles`);
  };

  const getStatusColor = (code: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(code.validFrom);
    const validUntil = new Date(code.validUntil);
    
    if (!code.isActive) return 'bg-gray-100 text-gray-800';
    if (now < validFrom) return 'bg-yellow-100 text-yellow-800';
    if (now > validUntil) return 'bg-red-100 text-red-800';
    if (code.maxUses && code.usedCount >= code.maxUses) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (code: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(code.validFrom);
    const validUntil = new Date(code.validUntil);
    
    if (!code.isActive) return 'Inactivo';
    if (now < validFrom) return 'Programado';
    if (now > validUntil) return 'Expirado';
    if (code.maxUses && code.usedCount >= code.maxUses) return 'Agotado';
    return 'Activo';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando códigos promocionales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Códigos Promocionales</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Crear Código
        </button>
      </div>

      {/* Promo Codes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {promoCodes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay códigos promocionales creados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validez
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promoCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 font-mono">
                            {code.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copiar código"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {code.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {code.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {code.discountType === 'percentage' ? (
                          <>
                            <Percent className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {code.discountValue}%
                            </span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              ${code.discountValue}
                            </span>
                          </>
                        )}
                      </div>
                      {code.minPurchase && (
                        <div className="text-xs text-gray-500">
                          Mín: ${code.minPurchase}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-blue-500 mr-1" />
                        <span>
                          {code.usedCount}
                          {code.maxUses ? `/${code.maxUses}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(code.validFrom).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{new Date(code.validUntil).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code)}`}>
                        {getStatusText(code)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(code)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Editar código"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(code.id, code.isActive)}
                          className={`${code.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                          title={code.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {code.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(code.id, code.code)}
                          className="text-red-600 hover:text-red-700"
                          title="Eliminar código"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCode ? 'Editar Código Promocional' : 'Crear Nuevo Código Promocional'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="DESCUENTO50"
                  />
                  {formErrors.code && <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de descuento *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed_amount' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Porcentaje</option>
                    <option value="fixed_amount">Monto fijo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor del descuento *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={formData.discountType === 'percentage' ? '50' : '10.00'}
                  />
                  {formErrors.discountValue && <p className="mt-1 text-sm text-red-600">{formErrors.discountValue}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de usos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ilimitado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formErrors.validFrom && <p className="mt-1 text-sm text-red-600">{formErrors.validFrom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de fin *
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formErrors.validUntil && <p className="mt-1 text-sm text-red-600">{formErrors.validUntil}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compra mínima
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planes aplicables
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {availablePlans.map((plan) => (
                    <label key={plan.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.applicablePlans.includes(plan.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              applicablePlans: [...formData.applicablePlans, plan.value]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              applicablePlans: formData.applicablePlans.filter(p => p !== plan.value)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{plan.label}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Si no seleccionas ningún plan, el código será válido para todos
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción del código promocional..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCode ? 'Actualizar' : 'Crear'} Código
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}