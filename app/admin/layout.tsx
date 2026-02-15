import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, MessageCircle, Trophy, DollarSign, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  if (!user.isAdmin) {
    redirect('/dashboard');
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Cursos', href: '/admin/courses', icon: BookOpen },
    { name: 'Foro', href: '/admin/forum', icon: MessageCircle },
    { name: 'Logros', href: '/admin/achievements', icon: Trophy },
    { name: 'Pagos', href: '/admin/payments', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 bg-gray-800">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                {user.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 mt-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
