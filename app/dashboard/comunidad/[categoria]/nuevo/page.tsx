import { requirePremiumAccess } from '@/lib/forum-access';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CreatePostForm from '../CreatePostForm';

const prisma = new PrismaClient();

async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.forumCategory.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    categoria: string;
  }>;
}

export default async function NuevoPostPage({ params }: PageProps) {
  const { categoria } = await params;
  
  const { hasAccess, user, upgradeMessage } = await requirePremiumAccess();
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Comunidad Premium</h2>
            <p className="text-gray-600">{upgradeMessage}</p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/pricing" 
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block"
            >
              Ver Planes Premium
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Verificar que user no sea null antes de usarlo
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">No se pudo obtener la información del usuario.</p>
          <Link 
            href="/dashboard" 
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const category = await getCategoryBySlug(categoria);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span>/</span>
              <Link href="/dashboard/comunidad" className="hover:text-blue-600">Comunidad</Link>
              <span>/</span>
              <Link 
                href={`/dashboard/comunidad/${categoria}`}
                className="hover:text-blue-600 capitalize"
              >
                {categoria.replace('-', ' ')}
              </Link>
              <span>/</span>
              <span className="text-gray-900">Nueva Publicación</span>
            </div>
          </nav>
          
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Publicación</h1>
              <p className="text-gray-600">Comparte en {category.name}</p>
            </div>
          </div>
        </div>

        {/* Form - Solo pasamos las props que el componente espera */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <CreatePostForm categoryId={category.id} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { categoria } = await params;
  const category = await getCategoryBySlug(categoria);
  
  if (!category) {
    return {
      title: 'Categoría no encontrada | DesarrolloPersonal.uno'
    };
  }

  return {
    title: `Nueva Publicación en ${category.name} | DesarrolloPersonal.uno`,
    description: `Crear una nueva publicación en ${category.name}`
  };
}
