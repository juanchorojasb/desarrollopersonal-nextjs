'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;

    setDeleting(true);
    try {
      await fetch(`/api/admin/forum/posts/${postId}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      alert('Error al eliminar el post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 inline" />
    </button>
  );
}
