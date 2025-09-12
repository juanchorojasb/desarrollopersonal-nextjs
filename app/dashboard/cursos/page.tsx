import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

const coursesData = {
  'gps-salud-mental': {
    title: 'GPS Salud Mental',
    description: 'Navega hacia el bienestar emocional con herramientas prácticas y científicamente respaldadas.',
    image: '🧭',
    requiredPlan: 'basico',
    lessons: 4,
    duration: '2.5 horas',
    videos: [
      '93fd37b8-4ccb-4b1b-9227-d8accebfabaf',
      'c71755cc-d89e-4c76-8870-e52c6ab17658',
      '8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc',
      'e33758a5-aeda-4a0c-b12e-aad06cd20a78'
    ]
  },
  'arquitectura-descanso': {
    title: 'Arquitectura del Descanso',
    description: 'Construye rutinas de sueño reparador y productividad sostenible.',
    image: '🏗️',
    requiredPlan: 'basico',
    lessons: 5,
    duration: '3 horas',
    videos: [
      '6d398119-2c3a-4ba9-ac1e-d8d51a0cb911',
      'a2d31bb1-bd57-424e-88a5-54229d0bf142',
      'ef26a4b5-db39-4239-a049-2d825910bb8b',
      '2d6144b5-f737-49fe-b6a0-a71aad965269',
      '95c57c4c-eccb-428b-9519-2a468002a0cf'
    ]
  },
  'gestionando-depresion': {
    title: 'Gestionando la Depresión',
    description: 'Estrategias basadas en evidencia para superar la depresión y recuperar el bienestar.',
    image: '🌅',
    requiredPlan: 'basico',
    lessons: 3,
    duration: '2 horas',
    videos: [
      '5d457920-2a95-4fce-a326-ce664ab3ff97',
      '4741f5f0-b7c6-4b8c-b07a-a5896f282218',
      'a96727cf-ad3a-42d4-93d5-53fbb1bf845e'
    ]
  },
  'emociones-equilibrio': {
    title: 'Emociones en Equilibrio',
    description: 'Desarrolla inteligencia emocional y autorregulación para una vida más plena.',
    image: '⚖️',
    requiredPlan: 'free',
    lessons: 9,
    duration: '5 horas',
    videos: [
      'cea9cf65-6466-4ebd-b670-8baea2f6c1e9',
      '7288352b-3466-4477-a805-a7a5da3fcc71',
      'c189a931-08ea-4aeb-8d6f-a95d0b3873f4',
      'd837af16-6e3f-46ef-9b86-cf6f1795c2ac',
      '69ab3b9f-486b-4c4f-b1d5-d44bb490b55c',
      '0dde13f5-7915-46d4-b2d8-08af8a1777f7',
      'f36f8f75-4b66-4747-bcff-72be870aaa27',
      'cb737748-58c9-4f90-a6cf-36041f6c3861',
      '8c3472e4-d00a-4177-bae7-8511cd19d2a8'
    ]
  },
  'neurocalma': {
    title: 'NeuroCalma',
    description: 'Técnicas neurocientíficas para reducir el estrés y la ansiedad de manera efectiva.',
    image: '🧠',
    requiredPlan: 'basico',
    lessons: 9,
    duration: '4.5 horas',
    videos: [
      '0d189ecb-71e2-4f32-a47c-38a298a2e793',
      '6b7cb42c-bb6f-42e6-b064-8d755843be7f',
      '9a9b8c38-3bcb-4b78-984e-a345bf9f8a61',
      '612c76ff-d82b-4222-b8fe-05d4c41c2a05',
      '4b53e15e-da14-4b72-a504-c89a88845afe',
      'e9861eb2-f938-41cb-963c-41c863cdafc6',
      '1c976c5d-b474-4ca6-87b9-87976c82d422',
      'a50d21fe-71e9-407b-b081-72de07cbcca0',
      'e3574e25-d69b-4fa3-ad02-dff865385046'
    ]
  },
  'navegando-tormenta': {
    title: 'Navegando la Tormenta Interior',
    description: 'Herramientas para gestionar crisis emocionales y encontrar estabilidad interior.',
    image: '⛈️',
    requiredPlan: 'basico',
    lessons: 6,
    duration: '3.5 horas',
    videos: [
      'ca16f310-273f-4e5b-bc4e-987d1f712d33',
      'e332c8c8-1db6-4bca-aac9-7ac54ecb8896',
      '3cb0913f-bd2c-45bb-89cb-6d00d8156a31',
      '327e4e9d-632d-45a6-a28c-1c7d15534985',
      '3f1f9265-f391-4133-942c-944897178729',
      '79a8778c-21c5-4344-98f9-410deb238324'
    ]
  }
};

export default async function CursosPage() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
            <p className="text-gray-600 mb-4">Inicia sesión para acceder a los cursos</p>
            <Link href="/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      );
    }

    const user = await currentUser();
    const metadata = user?.publicMetadata as { plan?: string } || {};
    const userPlan = metadata.plan || 'free';

    const planHierarchy = {
      'free': ['free'],
      'basico': ['free', 'basico'],
      'completo': ['free', 'basico', 'completo'],
      'personal': ['free', 'basico', 'completo', 'personal']
    };

    const allowedPlans = planHierarchy[userPlan as keyof typeof planHierarchy] || ['free'];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
            <p className="text-gray-600">Plan actual: <span className="font-semibold capitalize">{userPlan}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(coursesData).map(([courseId, course]) => {
              const hasAccess = allowedPlans.includes(course.requiredPlan);
              
              return (
                <div key={courseId} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="text-4xl mb-4">{course.image}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{course.lessons} lecciones</span>
                      <span>{course.duration}</span>
                    </div>
                    
                    {hasAccess ? (
                      <Link
                        href={`/dashboard/cursos/${courseId}`}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-center block font-medium transition-colors"
                      >
                        Continuar Curso
                      </Link>
                    ) : (
                      <div>
                        <p className="text-sm text-amber-600 mb-3">
                          Requiere plan: <span className="font-semibold capitalize">{course.requiredPlan}</span>
                        </p>
                        <Link
                          href="/pricing"
                          className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 text-center block font-medium transition-colors"
                        >
                          Actualizar Plan
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error en página de cursos:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Temporal</h1>
          <p className="text-gray-600 mb-4">Estamos experimentando problemas técnicos</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }
}
