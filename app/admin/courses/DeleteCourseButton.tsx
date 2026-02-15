'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este curso? Se eliminarán todos los módulos y lecciones.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/courses');
        router.refresh();
      } else {
        alert('Error al eliminar el curso');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error al eliminar el curso');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
