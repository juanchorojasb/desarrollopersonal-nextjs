import { auth, currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from './VideoPlayer';
import LessonList from './LessonList';

const coursesData = {
  'gps-salud-mental': {
    title: 'GPS Salud Mental',
    description: 'Navega hacia el bienestar emocional con herramientas prácticas y científicamente respaldadas para gestionar el estrés, la ansiedad y mejorar tu salud mental.',
    image: '🧭',
    requiredPlan: 'basico',
    duration: '2.5 horas',
    lessons: [
      { id: 1, title: 'Introducción al GPS Mental', videoId: '93fd37b8-4ccb-4b1b-9227-d8accebfabaf', duration: '25 min' },
      { id: 2, title: 'Navegando las Emociones', videoId: 'c71755cc-d89e-4c76-8870-e52c6ab17658', duration: '30 min' },
      { id: 3, title: 'Herramientas de Regulación', videoId: '8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc', duration: '35 min' },
      { id: 4, title: 'Construyendo Resiliencia', videoId: 'e33758a5-aeda-4a0c-b12e-aad06cd20a78', duration: '40 min' }
    ]
  },
  'arquitectura-descanso': {
    title: 'Arquitectura del Descanso',
    description: 'Construye rutinas de sueño reparador y productividad sostenible. Aprende a diseñar tu entorno y horarios para optimizar tu descanso y energía.',
    image: '🏗️',
    requiredPlan: 'basico',
    duration: '3 horas',
    lessons: [
      { id: 1, title: 'Fundamentos del Sueño', videoId: '6d398119-2c3a-4ba9-ac1e-d8d51a0cb911', duration: '30 min' },
      { id: 2, title: 'Diseñando tu Entorno', videoId: 'a2d31bb1-bd57-424e-88a5-54229d0bf142', duration: '35 min' },
      { id: 3, title: 'Rutinas de Descanso', videoId: 'ef26a4b5-db39-4239-a049-2d825910bb8b', duration: '40 min' },
      { id: 4, title: 'Optimización del Sueño', videoId: '2d6144b5-f737-49fe-b6a0-a71aad965269', duration: '38 min' },
      { id: 5, title: 'Recuperación Avanzada', videoId: '95c57c4c-eccb-428b-9519-2a468002a0cf', duration: '42 min' }
    ]
  },
  'gestionando-depresion': {
    title: 'Gestionando la Depresión',
    description: 'Estrategias basadas en evidencia para superar la depresión y recuperar el bienestar. Técnicas cognitivo-conductuales y herramientas prácticas.',
    image: '🌅',
    requiredPlan: 'basico',
    duration: '2 horas',
    lessons: [
      { id: 1, title: 'Entendiendo la Depresión', videoId: '5d457920-2a95-4fce-a326-ce664ab3ff97', duration: '35 min' },
      { id: 2, title: 'Estrategias de Afrontamiento', videoId: '4741f5f0-b7c6-4b8c-b07a-a5896f282218', duration: '45 min' },
      { id: 3, title: 'Construyendo el Bienestar', videoId: 'a96727cf-ad3a-42d4-93d5-53fbb1bf845e', duration: '40 min' }
    ]
  },
  'emociones-equilibrio': {
    title: 'Emociones en Equilibrio',
    description: 'Desarrolla inteligencia emocional y autorregulación para una vida más plena. Aprende a gestionar tus emociones de manera saludable.',
    image: '⚖️',
    requiredPlan: 'free',
    duration: '5 horas',
    lessons: [
      { id: 1, title: 'Introducción a las Emociones', videoId: 'cea9cf65-6466-4ebd-b670-8baea2f6c1e9', duration: '30 min' },
      { id: 2, title: 'Identificando Emociones', videoId: '7288352b-3466-4477-a805-a7a5da3fcc71', duration: '32 min' },
      { id: 3, title: 'Regulación Emocional Básica', videoId: 'c189a931-08ea-4aeb-8d6f-a95d0b3873f4', duration: '35 min' },
      { id: 4, title: 'Manejo del Estrés', videoId: 'd837af16-6e3f-46ef-9b86-cf6f1795c2ac', duration: '38 min' },
      { id: 5, title: 'Inteligencia Emocional', videoId: '69ab3b9f-486b-4c4f-b1d5-d44bb490b55c', duration: '40 min' },
      { id: 6, title: 'Comunicación Asertiva', videoId: '0dde13f5-7915-46d4-b2d8-08af8a1777f7', duration: '35 min' },
      { id: 7, title: 'Relaciones Saludables', videoId: 'f36f8f75-4b66-4747-bcff-72be870aaa27', duration: '42 min' },
      { id: 8, title: 'Autoestima y Confianza', videoId: 'cb737748-58c9-4f90-a6cf-36041f6c3861', duration: '38 min' },
      { id: 9, title: 'Equilibrio y Bienestar', videoId: '8c3472e4-d00a-4177-bae7-8511cd19d2a8', duration: '45 min' }
    ]
  },
  'neurocalma': {
    title: 'NeuroCalma',
    description: 'Técnicas neurocientíficas para reducir el estrés y la ansiedad de manera efectiva. Basado en investigación actual en neurociencia.',
    image: '🧠',
    requiredPlan: 'basico',
    duration: '4.5 horas',
    lessons: [
      { id: 1, title: 'Neurociencia del Estrés', videoId: '0d189ecb-71e2-4f32-a47c-38a298a2e793', duration: '35 min' },
      { id: 2, title: 'Sistema Nervioso y Calma', videoId: '6b7cb42c-bb6f-42e6-b064-8d755843be7f', duration: '30 min' },
      { id: 3, title: 'Técnicas de Respiración', videoId: '9a9b8c38-3bcb-4b78-984e-a345bf9f8a61', duration: '28 min' },
      { id: 4, title: 'Mindfulness Neurocientífico', videoId: '612c76ff-d82b-4222-b8fe-05d4c41c2a05', duration: '32 min' },
      { id: 5, title: 'Regulación del Sistema Nervioso', videoId: '4b53e15e-da14-4b72-a504-c89a88845afe', duration: '40 min' },
      { id: 6, title: 'Coherencia Cardíaca', videoId: 'e9861eb2-f938-41cb-963c-41c863cdafc6', duration: '25 min' },
      { id: 7, title: 'Técnicas de Relajación Profunda', videoId: '1c976c5d-b474-4ca6-87b9-87976c82d422', duration: '35 min' },
      { id: 8, title: 'Neuroplasticidad y Cambio', videoId: 'a50d21fe-71e9-407b-b081-72de07cbcca0', duration: '38 min' },
      { id: 9, title: 'Integración y Práctica', videoId: 'e3574e25-d69b-4fa3-ad02-dff865385046', duration: '42 min' }
    ]
  },
  'navegando-tormenta': {
    title: 'Navegando la Tormenta Interior',
    description: 'Herramientas para gestionar crisis emocionales y encontrar estabilidad interior en momentos difíciles.',
    image: '⛈️',
    requiredPlan: 'basico',
    duration: '3.5 horas',
    lessons: [
      { id: 1, title: 'Reconociendo la Tormenta', videoId: 'ca16f310-273f-4e5b-bc4e-987d1f712d33', duration: '30 min' },
      { id: 2, title: 'Herramientas de Emergencia', videoId: 'e332c8c8-1db6-4bca-aac9-7ac54ecb8896', duration: '35 min' },
      { id: 3, title: 'Encontrando el Refugio Interior', videoId: '3cb0913f-bd2c-45bb-89cb-6d00d8156a31', duration: '40 min' },
      { id: 4, title: 'Construyendo Resiliencia', videoId: '327e4e9d-632d-45a6-a28c-1c7d15534985', duration: '38 min' },
      { id: 5, title: 'Apoyo y Comunidad', videoId: '3f1f9265-f391-4133-942c-944897178729', duration: '32 min' },
      { id: 6, title: 'Después de la Tormenta', videoId: '79a8778c-21c5-4344-98f9-410deb238324', duration: '35 min' }
    ]
  }
};

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = coursesData[id as keyof typeof coursesData];
  
  if (!course) {
    notFound();
  }

  try {
    const { userId } = await auth();
    
    if (!userId) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
            <p className="text-gray-600 mb-4">Inicia sesión para acceder a este curso</p>
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
    const hasAccess = allowedPlans.includes(course.requiredPlan);

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">{course.image}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-4">Este curso requiere el plan {course.requiredPlan}</p>
            <p className="text-sm text-gray-500 mb-6">Tu plan actual: {userPlan}</p>
            <Link 
              href="/pricing" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Actualizar Plan
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header del Curso */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link 
                href="/dashboard/cursos" 
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                ← Volver a Cursos
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{course.image}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>{course.lessons.length} lecciones</span>
                    <span>{course.duration}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Plan {course.requiredPlan}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer 
                courseId={id}
                lessons={course.lessons}
                courseTitle={course.title}
              />
            </div>

            {/* Lista de Lecciones */}
            <div className="lg:col-span-1">
              <LessonList 
                lessons={course.lessons}
                courseId={id}
              />
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error en página de curso:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Temporal</h1>
          <p className="text-gray-600 mb-4">Estamos experimentando problemas técnicos</p>
          <Link href="/dashboard/cursos" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Volver a Cursos
          </Link>
        </div>
      </div>
    );
  }
}
