import PlanGate from '@/components/auth/PlanGate';

export default function ComunidadPage() {
  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Comunidad</h1>
        <p className="text-gray-600">Conecta con otros estudiantes y comparte tu experiencia de crecimiento.</p>
        
        <div className="mt-8 space-y-6">
          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-indigo-600">1,234</div>
              <div className="text-gray-600">Miembros Activos</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-green-600">89</div>
              <div className="text-gray-600">Grupos de Estudio</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-purple-600">567</div>
              <div className="text-gray-600">Discusiones Activas</div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">JD</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Juan Pérez</div>
                  <div className="text-gray-600">Compartió una reflexión sobre el módulo de liderazgo</div>
                  <div className="text-sm text-gray-500">Hace 2 horas</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">MG</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">María González</div>
                  <div className="text-gray-600">Inició una discusión sobre mindfulness en el trabajo</div>
                  <div className="text-sm text-gray-500">Hace 4 horas</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">AL</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Ana López</div>
                  <div className="text-gray-600">Se unió al grupo de estudio "Comunicación Efectiva"</div>
                  <div className="text-sm text-gray-500">Hace 6 horas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlanGate>
  );
}