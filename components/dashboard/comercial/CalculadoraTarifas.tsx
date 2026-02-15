'use client';

import { useState } from 'react';
import { calcularProyecto, formatCOP, formatPercentage } from '@/lib/comercial/calculos';
import { PLANES } from '@/lib/comercial/config';
import type { ResultadoProyecto } from '@/lib/comercial/calculos';

export default function CalculadoraTarifas() {
  const [tarifaBase, setTarifaBase] = useState(50000);
  const [usuarios, setUsuarios] = useState(30);
  const [meses, setMeses] = useState(6);
  const [resultado, setResultado] = useState<ResultadoProyecto | null>(null);

  const handleCalcular = () => {
    const res = calcularProyecto(tarifaBase, usuarios, meses);
    setResultado(res);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Calculadora de Tarifas</h2>
        <p className="text-sm text-gray-600 mt-1">
          Calcula precio de venta, deducciones y comisiones
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Planes Rápidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Seleccionar Plan Base
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PLANES.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setTarifaBase(plan.tarifaBase)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tarifaBase === plan.tarifaBase
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{plan.nombre}</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {formatCOP(plan.tarifaBase)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{plan.descripcion}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarifa Base por Usuario/Mes
            </label>
            <input
              type="number"
              value={tarifaBase}
              onChange={(e) => setTarifaBase(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1000"
              step="1000"
            />
            <p className="text-xs text-gray-500 mt-1">Lo que realmente reciben</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Usuarios
            </label>
            <input
              type="number"
              value={usuarios}
              onChange={(e) => setUsuarios(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (Meses)
            </label>
            <input
              type="number"
              value={meses}
              onChange={(e) => setMeses(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="36"
            />
          </div>
        </div>

        <button
          onClick={handleCalcular}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Calcular Precio de Venta
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-6">
          {/* Resumen Principal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Tarifa Base</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {formatCOP(resultado.tarifaBase)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Por usuario/mes
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Precio a Facturar</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">
                {formatCOP(resultado.precioFacturado)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Incluye retención
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Venta Neta</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {formatCOP(resultado.ventaNetaFacturada)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Desc: {formatPercentage(resultado.porcentajeDescuento)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Comisión Vendedor</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">
                {formatCOP(resultado.desglose.totalComisionVendedor)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercentage(resultado.desglose.porcentajeComision)} + bono
              </div>
            </div>
          </div>

          {/* Desglose Detallado */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-900">Desglose del Proyecto</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Precio de Venta */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">💰 Precio de Venta al Cliente</h4>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Precio Facturado (incluye retención 11%)</span>
                    <span className="font-medium text-orange-600">
                      {formatCOP(resultado.precioFacturado)} /usuario/mes
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Venta Bruta Total</span>
                    <span className="font-medium">
                      {formatCOP(resultado.ventaBrutaTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Descuento por Volumen ({formatPercentage(resultado.porcentajeDescuento)})</span>
                    <span>-{formatCOP(resultado.valorDescuento)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2 text-base">
                    <span>Venta Neta Facturada</span>
                    <span className="text-blue-600">
                      {formatCOP(resultado.ventaNetaFacturada)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deducciones */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">📋 Deducciones de Ley</h4>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Retención en la Fuente (11%) - Asumida por empresa</span>
                    <span className="font-medium">
                      {formatCOP(resultado.desglose.reteFuente)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rete ICA (0.8%)</span>
                    <span className="font-medium">
                      {formatCOP(resultado.desglose.reteIca)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seguridad Social (29% sobre 40% base) - Asumida por empresa</span>
                    <span className="font-medium">
                      {formatCOP(resultado.desglose.seguridadSocial)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Deducciones</span>
                    <span className="text-red-600">
                      -{formatCOP(resultado.desglose.totalDeduccionesLey)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-600 border-t pt-2">
                    <span>Ingreso Real</span>
                    <span>
                      {formatCOP(resultado.desglose.ingresoReal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comisión */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">👤 Comisión Vendedor</h4>
                <div className="space-y-2 ml-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Comisión Variable ({formatPercentage(resultado.desglose.porcentajeComision)})
                    </span>
                    <span className="font-medium">
                      {formatCOP(resultado.desglose.comisionVariable)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bono por Cumplimiento de Meta</span>
                    <span className="font-medium">
                      {formatCOP(resultado.desglose.bonoMeta)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2 text-base">
                    <span>Total Comisión Vendedor</span>
                    <span className="text-purple-600">
                      {formatCOP(resultado.desglose.totalComisionVendedor)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
