import PlanGate from '@/components/auth/PlanGate';

export default function AcompanamientoPage() {
  return (
    <PlanGate requiredPlan="personal">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Acompañamiento Personal</h1>
        <p className="text-gray-600">Sesiones personalizadas de coaching y mentoring para tu desarrollo.</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sesiones 1-a-1</h3>
            <p className="text-gray-600 mb-4">Coaching personalizado con expertos en desarrollo personal.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Programar Sesión
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Personalizado</h3>
            <p className="text-gray-600 mb-4">Ruta de aprendizaje diseñada específicamente para ti.</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Ver Mi Plan
            </button>
          </div>
        </div>
      </div>
    </PlanGate>
  );
}