import PlanGate from '@/components/auth/PlanGate';

export default function TalleresPage() {
  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Talleres en Vivo</h1>
        <p className="text-gray-600">Participa en sesiones en vivo programadas con expertos.</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Liderazgo Efectivo</h3>
            <p className="text-gray-600 mb-4">Taller en vivo sobre habilidades de liderazgo.</p>
            <div className="text-sm text-gray-500 mb-4">
              📅 Próximo: 15 de Enero, 7:00 PM
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full">
              Reservar Lugar
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comunicación Asertiva</h3>
            <p className="text-gray-600 mb-4">Desarrolla habilidades de comunicación efectiva.</p>
            <div className="text-sm text-gray-500 mb-4">
              📅 Próximo: 22 de Enero, 6:00 PM
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full">
              Reservar Lugar
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manejo del Estrés</h3>
            <p className="text-gray-600 mb-4">Técnicas avanzadas para gestionar el estrés.</p>
            <div className="text-sm text-gray-500 mb-4">
              📅 Próximo: 28 de Enero, 8:00 PM
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full">
              Reservar Lugar
            </button>
          </div>
        </div>
      </div>
    </PlanGate>
  );
}