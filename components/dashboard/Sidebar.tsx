"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useUserPlan } from '@/lib/plans-client';
import {
  Home,
  BookOpen,
  Trophy,
  Target,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  TrendingUp,
  Brain,
  Heart,
  Zap,
  CheckCircle,
  Star,
  Bookmark,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Vista general de tu progreso'
  },
  {
    label: 'Mis Cursos',
    href: '/dashboard/cursos',
    icon: BookOpen,
    description: 'Explora y gestiona tus cursos',
    badge: 'NUEVO'
  },
  {
    label: 'Comunidad',
    href: '/dashboard/comunidad',
    icon: Users,
    description: 'Conecta con otros estudiantes'
  }
];

const coursesNavItems: NavItem[] = [
  {
    label: 'Todos los Cursos',
    href: '/dashboard/cursos',
    icon: BookOpen,
    description: 'Catálogo completo de cursos'
  },
  {
    label: 'Mis Cursos',
    href: '/dashboard/cursos/inscritos',
    icon: Play,
    description: 'Cursos en los que estás inscrito'
  },
  {
    label: 'Favoritos',
    href: '/dashboard/cursos/favoritos',
    icon: Bookmark,
    description: 'Cursos marcados como favoritos'
  },
  {
    label: 'Completados',
    href: '/dashboard/cursos/completados',
    icon: CheckCircle,
    description: 'Cursos que has terminado'
  },
  {
    label: 'Certificados',
    href: '/dashboard/certificados',
    icon: Award,
    description: 'Tus logros y certificaciones'
  }
];

const progressNavItems: NavItem[] = [
  {
    label: 'Objetivos',
    href: '/dashboard/objetivos',
    icon: Target,
    description: 'Establece y sigue tus metas'
  },
  {
    label: 'Progreso',
    href: '/dashboard/progreso',
    icon: TrendingUp,
    description: 'Estadísticas detalladas'
  },
  {
    label: 'Logros',
    href: '/dashboard/logros',
    icon: Trophy,
    description: 'Desbloquea achievements'
  },
  {
    label: 'Rachas',
    href: '/dashboard/rachas',
    icon: Zap,
    description: 'Mantén tu constancia diaria'
  }
];

const communityNavItems: NavItem[] = [
  {
    label: 'Comunidad',
    href: '/dashboard/comunidad',
    icon: Users,
    description: 'Conecta con otros estudiantes'
  },
  {
    label: 'Talleres',
    href: '/dashboard/talleres',
    icon: Calendar,
    description: 'Sesiones en vivo programadas'
  },
  {
    label: 'Foros',
    href: '/dashboard/foros',
    icon: MessageSquare,
    description: 'Discusiones y Q&A'
  },
  {
    label: 'Acompañamiento',
    href: '/dashboard/acompanamiento',
    icon: Star,
    description: 'Coaching personalizado'
  }
];

const wellnessNavItems: NavItem[] = [
  {
    label: 'Bienestar Mental',
    href: '/dashboard/bienestar',
    icon: Brain,
    description: 'Recursos para tu salud mental'
  },
  {
    label: 'Mindfulness',
    href: '/dashboard/mindfulness',
    icon: Heart,
    description: 'Meditación y relajación'
  }
];

const bottomNavItems: NavItem[] = [
  {
    label: 'Configuración',
    href: '/dashboard/configuracion',
    icon: Settings,
    description: 'Personaliza tu experiencia'
  },
  {
    label: 'Ayuda',
    href: '/dashboard/ayuda',
    icon: HelpCircle,
    description: 'Soporte y documentación'
  }
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const userPlan = useUserPlan();
  const [expandedSections, setExpandedSections] = useState<string[]>(['cursos']);

  const toggleSection = (section: string) => {
    if (isCollapsed) return;
    
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, isSubmenu = false }: { 
    item: NavItem; 
    isSubmenu?: boolean;
  }) => {
    const active = isActive(item.href);
    
    return (
      <Link
        href={item.href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/10 ${
          active 
            ? 'bg-white/15 text-white shadow-lg' 
            : 'text-blue-100 hover:text-white'
        } ${isSubmenu ? 'ml-6 py-2' : ''}`}
        title={isCollapsed ? item.label : ''}
      >
        <item.icon className={`${isSubmenu ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0`} />
        
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {item.label}
            {item.description && (
              <div className="text-xs text-gray-400 mt-1">{item.description}</div>
            )}
          </div>
        )}
      </Link>
    );
  };

  const SectionHeader = ({ 
    title, 
    sectionKey, 
    icon: Icon 
  }: { 
    title: string; 
    sectionKey: string; 
    icon: LucideIcon;
  }) => {
    if (isCollapsed) {
      return (
        <div className="group relative">
          <div className="flex items-center justify-center w-8 h-8 mx-auto my-2 bg-white/10 rounded-lg">
            <Icon className="w-4 h-4 text-blue-200" />
          </div>
          <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {title}
          </div>
        </div>
      );
    }

    const isExpanded = expandedSections.includes(sectionKey);

    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="group flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wider hover:text-white transition-colors"
      >
        <Icon className="w-4 h-4" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronRight 
          className={`w-4 h-4 transition-transform ${
            isExpanded ? 'rotate-90' : ''
          }`} 
        />
      </button>
    );
  };

  const Section = ({ 
    title, 
    items, 
    sectionKey, 
    icon 
  }: { 
    title: string; 
    items: NavItem[]; 
    sectionKey: string; 
    icon: LucideIcon;
  }) => {
    const isExpanded = expandedSections.includes(sectionKey);

    return (
      <div className="space-y-1">
        <SectionHeader title={title} sectionKey={sectionKey} icon={icon} />
        
        {(!isCollapsed && isExpanded) && (
          <div className="space-y-1">
            {items.map((item) => (
              <NavItem key={item.href} item={item} isSubmenu={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-blue-600 via-blue-700 to-purple-800 border-r border-blue-500/20 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      } lg:relative lg:z-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              {user?.imageUrl ? (
                <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={user.imageUrl} 
                    alt={user.firstName || 'Usuario'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">
                  {user?.firstName || 'Usuario'}
                </h3>
                <p className="text-xs text-blue-200">Estudiante Activo</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Courses Section */}
          <Section 
            title="Cursos" 
            items={coursesNavItems} 
            sectionKey="cursos"
            icon={BookOpen}
          />

          {/* Progress Section */}
          <Section 
            title="Progreso" 
            items={progressNavItems} 
            sectionKey="progreso"
            icon={TrendingUp}
          />

          {/* Community Section */}
          <Section 
            title="Comunidad" 
            items={communityNavItems} 
            sectionKey="comunidad"
            icon={Users}
          />

          {/* Wellness Section */}
          <Section 
            title="Bienestar" 
            items={wellnessNavItems} 
            sectionKey="bienestar"
            icon={Heart}
          />

          {/* Divider */}
          <div className="border-t border-blue-500/20 my-4" />

          {/* Bottom Navigation */}
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500/20">
          <SignOutButton>
            <button className="group flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-all">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Cerrar Sesión
                </div>
              )}
            </button>
          </SignOutButton>

          {!isCollapsed && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 text-white text-sm mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Nivel 5</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-blue-200 mt-1">2,340 / 3,000 XP</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
