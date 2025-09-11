import { notFound } from 'next/navigation';
import PlanGate from '@/components/auth/PlanGate';
import { getForumCategoryBySlug } from '@/lib/forum';
import NewPostForm from './NewPostForm';
import * as Icons from 'lucide-react';
import { MessageCircle } from 'lucide-react';

interface Props {
  params: Promise<{ categoria: string }>;
}

export default async function NewPostPage({ params }: Props) {
  const { categoria } = await params;
  const category = await getForumCategoryBySlug(categoria);
  
  if (!category) {
    notFound();
  }

  const getIcon = (iconName: string | null) => {
    if (!iconName) return MessageCircle;
    const Icon = (Icons as any)[iconName];
    return Icon || MessageCircle;
  };

  const Icon = getIcon(category.icon);

  return (
    <PlanGate requiredPlan="complete">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon 
                className="w-5 h-5" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nuevo tema en {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
            </div>
          </div>
          
          {/* Guidelines */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">
              Pautas para crear un buen tema:
            </h3>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Usa un título claro y descriptivo</li>
              <li>• Proporciona contexto suficiente en tu mensaje</li>
              <li>• Sé respetuoso y constructivo</li>
              <li>• Busca primero si ya existe un tema similar</li>
              <li>• Mantén la conversación en el tema de la categoría</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <NewPostForm 
              categoryId={category.id} 
              categorySlug={category.slug}
              categoryName={category.name}
            />
          </div>
        </div>
      </div>
    </PlanGate>
  );
}