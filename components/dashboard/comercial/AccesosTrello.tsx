'use client';

interface TableroTrello {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  color: string;
  icono: string;
}

export default function AccesosTrello() {
  const tableros: TableroTrello[] = [
    {
      id: 'ventas',
      nombre: 'Pipeline de Ventas',
      descripcion: 'Seguimiento de oportunidades comerciales',
      url: 'https://trello.com/b/tu-tablero-ventas',
      color: 'bg-green-500',
      icono: '💰',
    },
    {
      id: 'proyectos',
      nombre: 'Proyectos Activos',
      descripcion: 'Gestión de proyectos en curso',
      url: 'https://trello.com/b/tu-tablero-proyectos',
      color: 'bg-blue-500',
      icono: '📋',
    },
    {
      id: 'clientes',
      nombre: 'Gestión de Clientes',
      descripcion: 'Relaciones y seguimiento',
      url: 'https://trello.com/b/tu-tablero-clientes',
      color: 'bg-purple-500',
      icono: '👥',
    },
  ];

  const handleAbrirTablero = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableros de Trello</h2>
        <p className="text-sm text-gray-600 mt-1">Acceso rápido a tus tableros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tableros.map((tablero) => (
          <button
            key={tablero.id}
            onClick={() => handleAbrirTablero(tablero.url)}
            className="bg-white rounded-lg shadow hover:shadow-xl transition-all p-6 text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${tablero.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
              >
                {tablero.icono}
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
              {tablero.nombre}
            </h3>
            <p className="text-sm text-gray-600">{tablero.descripcion}</p>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          ℹ️ Configurar URLs de Trello
        </h3>
        <p className="text-sm text-blue-700">
          Para personalizar estos accesos, edita las URLs en el componente AccesosTrello.tsx
        </p>
      </div>
    </div>
  );
}
