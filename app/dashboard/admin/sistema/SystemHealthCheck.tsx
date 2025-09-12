'use client'

import { useState } from 'react';

export default function SystemHealthCheck() {
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const handleHealthCheck = async () => {
    setChecking(true);
    
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setLastCheck(new Date());
        alert('Sistema funcionando correctamente');
      } else {
        alert('Se detectaron problemas en el sistema');
      }
    } catch (error) {
      alert('Error al verificar el sistema');
    }
    
    setChecking(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-2">Verificación de Salud</h4>
      <p className="text-sm text-gray-600 mb-3">
        Verificar estado de todos los servicios
      </p>
      {lastCheck && (
        <p className="text-xs text-gray-500 mb-2">
          Última verificación: {lastCheck.toLocaleTimeString()}
        </p>
      )}
      <button
        onClick={handleHealthCheck}
        disabled={checking}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {checking ? 'Verificando...' : 'Verificar'}
      </button>
    </div>
  );
}
