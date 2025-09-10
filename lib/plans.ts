import { User } from '@clerk/nextjs/server';

export type Plan = 'free' | 'basic' | 'complete' | 'personal';

export interface PlanConfig {
  name: string;
  displayName: string;
  level: number;
  features: string[];
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    name: 'free',
    displayName: 'Plan Gratuito',
    level: 0,
    features: ['Acceso limitado al dashboard', 'Contenido básico']
  },
  basic: {
    name: 'basic',
    displayName: 'Plan Básico',
    level: 1,
    features: ['Acceso completo a cursos', 'Progreso y estadísticas', 'Certificados básicos']
  },
  complete: {
    name: 'complete',
    displayName: 'Plan Completo',
    level: 2,
    features: ['Todo del Plan Básico', 'Talleres en vivo', 'Comunidad premium', 'Certificados avanzados']
  },
  personal: {
    name: 'personal',
    displayName: 'Plan Personal',
    level: 3,
    features: ['Todo del Plan Completo', 'Acompañamiento personalizado', 'Sesiones 1-a-1', 'Contenido exclusivo']
  }
};

export function getUserPlan(user: User | null): Plan {
  if (!user) return 'free';
  
  const plan = user.publicMetadata?.plan as Plan;
  if (plan && Object.keys(PLANS).includes(plan)) {
    return plan;
  }
  
  return 'free';
}

export function hasAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  const userLevel = PLANS[userPlan].level;
  const requiredLevel = PLANS[requiredPlan].level;
  
  return userLevel >= requiredLevel;
}

export function getUpgradeMessage(requiredPlan: Plan): string {
  const planConfig = PLANS[requiredPlan];
  return `Necesitas el ${planConfig.displayName} o superior para acceder a este contenido.`;
}

export function getPlanHierarchy(): Plan[] {
  return Object.keys(PLANS).sort((a, b) => PLANS[a as Plan].level - PLANS[b as Plan].level) as Plan[];
}

export function getNextPlan(currentPlan: Plan): Plan | null {
  const hierarchy = getPlanHierarchy();
  const currentIndex = hierarchy.indexOf(currentPlan);
  
  if (currentIndex === -1 || currentIndex === hierarchy.length - 1) {
    return null;
  }
  
  return hierarchy[currentIndex + 1];
}