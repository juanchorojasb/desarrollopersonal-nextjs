import { auth, currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const coursesData = {
  'gps-salud-mental': {
    title: 'GPS Salud Mental',
    lessons: [
      { id: 1, title: 'Introducción al GPS Mental', videoId: '93fd37b8-4ccb-4b1b-9227-d8accebfabaf' },
      { id: 2, title: 'Navegando las Emociones', videoId: 'c71755cc-d89e-4c76-8870-e52c6ab17658' },
      { id: 3, title: 'Herramientas de Regulación', videoId: '8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc' },
      { id: 4, title: 'Construyendo Resiliencia', videoId: 'e33758a5-aeda-4a0c-b12e-aad06cd20a78' }
    ]
  },
  'arquitectura-descanso': {
    title: 'Arquitectura del Descanso',
    lessons: [
      { id: 1, title: 'Fundamentos del Sueño', videoId: '6d398119-2c3a-4ba9-ac1e-d8d51a0cb911' },
      { id: 2, title: 'Diseñando tu Entorno', videoId: 'a2d31bb1-bd57-424e-88a5-54229d0bf142' },
      { id: 3, title: 'Rutinas de Descanso', videoId: 'ef26a4b5-db39-4239-a049-2d825910bb8b' },
      { id: 4, title: 'Optimización del Sueño', videoId: '2d6144b5-f737-49fe-b6a0-a71aad965269' },
      { id: 5, title: 'Recuperación Avanzada', videoId: '95c57c4c-eccb-428b-9519-2a468002a0cf' }
    ]
  }
  // Agregar otros cursos según necesidad
};

interface SessionPageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id, lessonId } = await params;
  const course = coursesData[id as keyof typeof coursesData];
  
  if (!course) {
    notFound();
  }

  const lesson = course.lessons.find(l => l.id.toString() === lessonId);
  if (!lesson) {
    notFound();
  }

  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
          <Link href="/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black text-white">
          <Link 
            href={`/dashboard/cursos/${id}`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <span>←</span>
            <span>Volver al curso</span>
          </Link>
          <h1 className="text-lg font-medium">{lesson.title}</h1>
          <div className="w-20"></div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/476857/${lesson.videoId}?autoplay=true&preload=true`}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
