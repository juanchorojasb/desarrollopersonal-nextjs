import PlanGate from '@/components/auth/PlanGate';

const talleresEnVivo = [
  {
    id: 1,
    title: "Taller de Duelo: Honrando el recuerdo, abrazando la vida",
    description: "Para personas que han vivido una pérdida significativa y desean transformar su proceso de duelo explorando emociones desde el amor y la memoria.",
    fecha: "4 de Octubre, 9:00 AM - 11:00 AM",
    instructor: "María González",
    duracion: "2 horas",
    cupos: "15 disponibles"
  },
  {
    id: 2,
    title: "Formación Docentes: El docente que soy...",
    description: "Espacio de reflexión crítica sobre la práctica pedagógica para maestros y equipos educativos. Fortalece tu vocación y actualiza herramientas.",
    fecha: "18 de Octubre, 9:00 AM - 11:00 AM", 
    instructor: "Carlos Ruiz",
    duracion: "2 horas",
    cupos: "12 disponibles"
  },
  {
    id: 3,
    title: "Taller Hábitos de Estudio: Aprender con propósito",
    description: "Para estudiantes que buscan mejorar su rendimiento aprendiendo métodos prácticos de estudio, planificación y motivación.",
    fecha: "1 de Noviembre, 9:00 AM - 11:00 AM",
    instructor: "Ana Martínez",
    duracion: "2 horas", 
    cupos: "20 disponibles"
  },
  {
    id: 4,
    title: "Taller Habilidades Socioemocionales: Crecer, sentir y conectar",
    description: "Desarrolla inteligencia emocional para mejorar relaciones y bienestar. Gestiona estrés, fortalece autoestima y crea vínculos saludables.",
    fecha: "15 de Noviembre, 9:00 AM - 11:00 AM",
    instructor: "Laura Pérez",
    duracion: "2 horas",
    cupos: "18 disponibles"
  },
  {
    id: 5,
    title: "Taller Etapa Pensional: Renacer en la nueva etapa",
    description: "Para personas preparándose o viviendo la jubilación. Reconecta contigo, descubre pasiones y vive esta etapa con plenitud.",
    fecha: "29 de Noviembre, 9:00 AM - 11:00 AM",
    instructor: "Roberto Silva",
    duracion: "2 horas",
    cupos: "15 disponibles"
  },
  {
    id: 6,
    title: "Taller Gestión Emocional: Emociones en equilibrio",
    description: "Aprende a escuchar y canalizar emociones si sientes que te desbordan. Logra dominio emocional, armonía y mejores decisiones.",
    fecha: "13 de Diciembre, 9:00 AM - 11:00 AM",
    instructor: "Patricia López",
    duracion: "2 horas",
    cupos: "16 disponibles"
  },
  {
    id: 7,
    title: "Taller de Asertividad: Decir lo que pienso sin miedo",
    description: "Fortalece tu comunicación y autoestima. Aprende técnicas para hablar con respeto y firmeza, sin culpa ni ansiedad.",
    fecha: "27 de Diciembre, 9:00 AM - 11:00 AM",
    instructor: "Miguel Torres",
    duracion: "2 horas",
    cupos: "14 disponibles"
  },
  {
    id: 8,
    title: "Taller Cambio Digital: Creciendo con la IA",
    description: "Descubre cómo la inteligencia artificial puede ser tu aliada. Adáptate con criterio, sentido crítico y sin perder tu esencia humana.",
    fecha: "10 de Enero 2026, 9:00 AM - 11:00 AM",
    instructor: "Sofia Ramírez",
    duracion: "2 horas",
    cupos: "25 disponibles"
  }
];

export default function TalleresPage() {
  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Programas y Talleres</h1>
          <p className="text-gray-600 text-lg">
            Explora nuestros espacios de formación diseñados para particulares y organizaciones, enfocados
            en potenciar tu desarrollo personal, emocional y profesional.
          </p>
        </div>

        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Cronograma de Talleres 2025-2026</h2>
          <p className="text-blue-700 mb-4">
            Todos los talleres se realizan los sábados de 9:00 AM a 11:00 AM (hora de Colombia), cada 15 días.
          </p>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Próximas fechas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>4 Oct • 18 Oct • 1 Nov</div>
              <div>15 Nov • 29 Nov • 13 Dic</div>
              <div>27 Dic • 10 Ene • 24 Ene</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talleresEnVivo.map((taller) => (
            <div key={taller.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {taller.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                {taller.description}
              </p>
              
              <div className="space-y-2 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span className="font-medium">{taller.fecha}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👨‍🏫</span>
                  <span>{taller.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{taller.duracion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span className="text-green-600 font-medium">{taller.cupos}</span>
                </div>
              </div>
              
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full font-medium">
                Reservar Lugar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Información Importante</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Modalidad</h3>
              <p>Todos los talleres son virtuales a través de nuestra plataforma en línea.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Certificación</h3>
              <p>Recibirás certificado de participación al completar cada taller.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Grabaciones</h3>
              <p>Las sesiones quedan grabadas y disponibles por 30 días.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Soporte</h3>
              <p>Acceso a chat de apoyo durante y después de cada taller.</p>
            </div>
          </div>
        </div>
      </div>
    </PlanGate>
  );
}
