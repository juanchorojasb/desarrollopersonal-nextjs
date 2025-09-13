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
  MessageSquare,
  Users,
  Heart,
  Brain,
  Flower2
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/dashboard/cursos', icon: BookOpen },
  { name: 'Videos', href: '/videos', icon: Play },
  { name: 'Comunidad', href: '/dashboard/comunidad', icon: MessageSquare },
  { name: 'Mi Plan', href: '/dashboard/mi-plan', icon: Crown },
  { name: 'Suscripción', href: '/dashboard/suscripcion', icon: CreditCard },
  { name: 'Facturas', href: '/dashboard/facturas', icon: FileText },
  { name: 'Perfil', href: '/dashboard/perfil', icon: User },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
  { name: 'Ayuda', href: '/dashboard/ayuda', icon: HelpCircle },
];

// Secciones de comunidad como submenu
const communityNavigation = [
  { name: 'Desarrollo Personal', href: '/dashboard/comunidad/desarrollo-personal', icon: Brain },
  { name: 'Mindfulness', href: '/dashboard/comunidad/mindfulness', icon: Flower2 },
  { name: 'Bienestar', href: '/dashboard/comunidad/bienestar', icon: Heart },
];

function DashboardNav() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  
  const isCommunityActive = pathname.startsWith('/dashboard/comunidad');

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-indigo-600">
          <Link href="/dashboard" className="text-white font-bold text-lg">
            DesarrolloPersonal.uno
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isCommunityItem = item.name === 'Comunidad';
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive || (isCommunityItem && isCommunityActive)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive || (isCommunityItem && isCommunityActive)
                        ? 'text-indigo-500' 
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>

                {/* Submenu de Comunidad */}
                {isCommunityItem && isCommunityActive && (
                  <div className="ml-6 mt-2 space-y-1">
                    {communityNavigation.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`group flex items-center px-2 py-1 text-sm rounded-md transition-colors ${
                            isSubActive
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          <subItem.icon
                            className={`mr-2 h-4 w-4 ${
                              isSubActive 
                                ? 'text-indigo-500' 
                                : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                          />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Cerrar Sesión */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default DashboardNav;
