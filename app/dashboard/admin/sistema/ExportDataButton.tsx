'use client'

import { useState } from 'react';

export default function ExportDataButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'json' })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error al exportar datos');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar datos');
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-2">Exportar Datos</h4>
      <p className="text-sm text-gray-600 mb-3">Descargar backup completo de la plataforma</p>
      <button
        onClick={handleExport}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Exportando...' : 'Exportar'}
      </button>
    </div>
  );
}
