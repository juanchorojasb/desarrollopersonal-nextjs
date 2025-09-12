import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function CursosCompletadosPage() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursos Completados</h1>
          <p className="text-gray-600">Revisa los cursos que has terminado y obtén tus certificados</p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay cursos completados aún</h3>
          <p className="text-gray-600 mb-6">Completa tus primeros cursos para ver tus logros aquí</p>
          <Link 
            href="/dashboard/cursos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Ver Cursos Disponibles
          </Link>
        </div>
      </div>
    </div>
  );
}
