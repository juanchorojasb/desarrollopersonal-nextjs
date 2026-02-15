'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ChangePlanButton({ userId, currentPlan }: { userId: string; currentPlan: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const changePlan = async (newPlan: string) => {
    setLoading(true);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionStatus: newPlan }),
      });
      router.refresh();
    } catch (error) {
      alert('Error al cambiar el plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentPlan}
      onChange={(e) => changePlan(e.target.value)}
      disabled={loading}
      className="text-sm border border-gray-300 rounded px-2 py-1"
      onClick={(e) => e.stopPropagation()}
    >
      <option value="free">Gratis</option>
      <option value="basic">Básico</option>
      <option value="complete">Completo</option>
      <option value="personal">Personal</option>
    </select>
  );
}

export function DeleteUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    try {
      await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      alert('Error al eliminar usuario');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}
