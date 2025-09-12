'use client';
import { useState } from 'react';
import { createPromoCode } from './actions';

interface FormDataType {
  code: string;
  description: string;
  discountPercent: string;
  maxUses: string;
}

export default function PromoCodeManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await createPromoCode(formData);
      
      if (result.success) {
        setMessage('Código promocional creado exitosamente');
        form.reset();
      } else {
        setMessage('Error al crear código promocional');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al crear código promocional');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Crear Nuevo Código</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código
          </label>
          <input
            type="text"
            name="code"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="CODIGO2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            name="description"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción del descuento"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descuento (%)
          </label>
          <input
            type="number"
            name="discount"
            required
            min="1"
            max="100"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usos máximos
          </label>
          <input
            type="number"
            name="maxUses"
            required
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creando...' : 'Crear Código'}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('exitosamente') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
