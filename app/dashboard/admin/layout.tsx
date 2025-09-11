import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  if (!user || user.publicMetadata?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <Link href="/dashboard/admin" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link href="/dashboard/admin/usuarios" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Usuarios
            </Link>
            <Link href="/dashboard/admin/cursos" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
              Cursos
            </Link>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
