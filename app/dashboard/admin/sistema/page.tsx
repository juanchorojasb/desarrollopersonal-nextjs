import { PrismaClient } from '@prisma/client';
import ExportDataButton from './ExportDataButton';
import SystemHealthCheck from './SystemHealthCheck';

const prisma = new PrismaClient();

async function getSystemStats() {
  try {
    const [dbStats, systemInfo] = await Promise.all([
      // Stats de la base de datos
      {
        totalTables: 15, // Placeholder
        totalRecords: await prisma.user.count() + await prisma.course.count() + await prisma.enrollment.count(),
        dbSize: '125MB' // Placeholder
      },
      // Info del sistema
      {
        nextjsVersion: '15.4.5',
        nodeVersion: process.version,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed
      }
    ]);

    return { dbStats, systemInfo };
  } catch (error) {
    console.error('Error getting system stats:', error);
    return {
      dbStats: { totalTables: 0, totalRecords: 0, dbSize: 'N/A' },
      systemInfo: { nextjsVersion: 'N/A', nodeVersion: 'N/A', uptime: 0, memoryUsage: 0 }
    };
  }
}

export default async function SistemaPage() {
  const { dbStats, systemInfo } = await getSystemStats();
  
  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administración del Sistema</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Estado del Sistema */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Next.js</span>
              <span className="font-medium">{systemInfo.nextjsVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>Node.js</span>
              <span className="font-medium">{systemInfo.nodeVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiempo activo</span>
              <span className="font-medium">{formatUptime(systemInfo.uptime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Memoria utilizada</span>
              <span className="font-medium">{formatBytes(systemInfo.memoryUsage)}</span>
            </div>
          </div>
        </div>

        {/* Estado de la Base de Datos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Base de Datos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total registros</span>
              <span className="font-medium">{dbStats.totalRecords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tamaño estimado</span>
              <span className="font-medium">{dbStats.dbSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Estado</span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Conectado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Herramientas de Sistema */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Herramientas de Administración</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExportDataButton />
          <SystemHealthCheck />
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Logs del Sistema</h4>
            <p className="text-sm text-gray-600 mb-3">Ver logs de errores y actividad</p>
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
              Ver Logs
            </button>
          </div>
        </div>
      </div>

      {/* Información de la Plataforma */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Información de la Plataforma</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Funcionalidades Activas</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Sistema de Cursos
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Autenticación Clerk
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Videos MediaDelivery
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Comunidad/Foros
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Panel de Administración
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Configuración</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>Base de datos: MySQL</li>
              <li>Servidor: PM2</li>
              <li>Proxy: Nginx</li>
              <li>SSL: Habilitado</li>
              <li>Backup: Automático</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
