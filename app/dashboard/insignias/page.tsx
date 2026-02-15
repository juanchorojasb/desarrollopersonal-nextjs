import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import BadgesGallery from './BadgesGallery';
import { Award, Lock } from 'lucide-react';

export default async function BadgesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-500" />
            Colección de Insignias
          </h1>
          <p className="text-gray-600 mt-2">
            Desbloquea insignias especiales completando desafíos
          </p>
        </div>

        <BadgesGallery />
      </div>
    </div>
  );
}
