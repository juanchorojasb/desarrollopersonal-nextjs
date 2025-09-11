'use client'

import { useState } from 'react';
import { updateUserPlan } from './actions';

interface UserPlanUpdaterProps {
  userId: string;
  currentPlan: string;
  userName: string;
}

export default function UserPlanUpdater({ userId, currentPlan, userName }: UserPlanUpdaterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const plans = [
    { value: 'free', label: 'Gratuito' },
    { value: 'basic', label: 'Básico' },
    { value: 'premium', label: 'Premium' },
    { value: 'vip', label: 'VIP' }
  ];

  const handlePlanChange = async (newPlan: string) => {
    if (newPlan === currentPlan) return;
    
    setLoading(true);
    const result = await updateUserPlan(userId, newPlan);
    
    if (result.success) {
      setIsOpen(false);
    } else {
      alert('Error al actualizar el plan');
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        Cambiar plan
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border">
          <div className="py-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
              Cambiar plan de {userName}
            </div>
            {plans.map((plan) => (
              <button
                key={plan.value}
                onClick={() => handlePlanChange(plan.value)}
                disabled={loading || plan.value === currentPlan}
                className={`block w-full text-left px-3 py-2 text-sm ${
                  plan.value === currentPlan 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-700'
                } ${loading ? 'opacity-50' : ''}`}
              >
                {plan.label} {plan.value === currentPlan && '(actual)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
