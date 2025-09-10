import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function CursosFavoritosPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursos Favoritos</h1>
          <p className="text-gray-600">Aquí encontrarás los cursos que has marcado como favoritos.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h2>
          <p className="text-gray-600">Esta función estará disponible próximamente. Podrás marcar cursos como favoritos desde el catálogo.</p>
        </div>
      </div>
    </div>
  )
}