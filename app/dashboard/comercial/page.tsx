'use client';

import { useState } from 'react';
import EstadisticasComercial from '@/components/dashboard/comercial/EstadisticasComercial';
import AccesosTrello from '@/components/dashboard/comercial/AccesosTrello';
import CalculadoraTarifas from '@/components/dashboard/comercial/CalculadoraTarifas';

type TabType = 'estadisticas' | 'trello' | 'calculadora';

export default function DashboardComercialPage() {
  const [activeTab, setActiveTab] = useState<TabType>('estadisticas');

  const tabs = [
    { id: 'estadisticas' as TabType, label: 'Estadísticas', icon: '📊' },
    { id: 'trello' as TabType, label: 'Tableros', icon: '📋' },
    { id: 'calculadora' as TabType, label: 'Calculadora', icon: '🧮' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Comercial</h1>
          <p className="text-sm text-gray-600 mt-1">
            Dirección Comercial - DesarrolloPersonal.uno
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex space-x-4 p-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'estadisticas' && <EstadisticasComercial />}
          {activeTab === 'trello' && <AccesosTrello />}
          {activeTab === 'calculadora' && <CalculadoraTarifas />}
        </div>
      </div>
    </div>
  );
}
