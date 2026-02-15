'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Calendar,
  Users,
  Crown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  BarChart3,
  Award
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import NotificationBell from '@/components/NotificationBell';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/dashboard/cursos', icon: BookOpen },
  { name: 'Talleres', href: '/dashboard/talleres', icon: Calendar },
  { name: 'Comunidad', href: '/dashboard/community', icon: Users },
  { name: 'Mi Plan', href: '/dashboard/mi-plan', icon: Crown },
  { name: 'Certificados', href: '/dashboard/certificados', icon: Award },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Insignias', href: '/dashboard/insignias', icon: Award },
  { name: 'Perfil', href: '/dashboard/perfil', icon: User },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
  { name: 'Ayuda', href: '/dashboard/ayuda', icon: HelpCircle },
];

function DashboardNav() {
  const pathname = usePathname();
  const { user, isLoading } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const hasComercialAccess = user?.role === 'comercial' || user?.role === 'admin';

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {item.name}
          </Link>
        );
      })}

      {hasComercialAccess && (
        <>
          <div className="my-2 border-t border-gray-200" />
          <Link
            href="/dashboard/comercial"
            onClick={() => setMobileMenuOpen(false)}
            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              pathname.startsWith('/dashboard/comercial')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-900'
            }`}
          >
            <BarChart3
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                pathname.startsWith('/dashboard/comercial')
                  ? 'text-blue-500'
                  : 'text-gray-400 group-hover:text-blue-500'
              }`}
            />
            Dashboard Comercial
          </Link>
        </>
      )}

      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
      >
        <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
        Cerrar Sesión
      </button>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">DP</span>
              </div>
              <span className="font-semibold text-gray-900">Dashboard</span>
            </Link>
            <NotificationBell />
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <NavLinks />
          </nav>

          {user && (
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default DashboardNav;
