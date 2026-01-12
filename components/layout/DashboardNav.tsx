'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Play,
  User,
  Settings,
  HelpCircle,
  LogOut,
  CreditCard,
  FileText,
  Crown,
  Users,
  Calendar
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/dashboard/cursos', icon: BookOpen },
  { name: 'Talleres', href: '/dashboard/talleres', icon: Calendar },
  { name: 'Comunidad', href: '/dashboard/community', icon: Users },
  { name: 'Mi Plan', href: '/dashboard/mi-plan', icon: Crown },
  { name: 'Perfil', href: '/dashboard/perfil', icon: User },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
  { name: 'Ayuda', href: '/dashboard/ayuda', icon: HelpCircle },
];

function DashboardNav() {
  const pathname = usePathname();
  const { user, isLoading } = useCurrentUser();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {item.name}
          </Link>
        );
      })}
      
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
      >
        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
        Cerrar Sesión
      </button>
    </nav>
  );
}

export default DashboardNav;
