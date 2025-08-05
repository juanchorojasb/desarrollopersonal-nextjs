import { currentUser } from '@clerk/nextjs/server'

export default async function PerfilPage() {
  const user = await currentUser()
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={user?.imageUrl || '/default-avatar.png'} 
            alt="Avatar" 
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
        <p className="text-gray-600">Gestión de perfil en desarrollo...</p>
      </div>
    </div>
  )
}
