import { prisma } from '@/lib/prisma';

export type Plan = 'free' | 'basic' | 'complete' | 'personal';

export interface PlanConfig {
  name: string;
  displayName: string;
  level: number;
  price: string;
  priceUSD: string;
  priceMonthly: number; // Para cálculos
  features: string[];
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    name: 'free',
    displayName: 'Plan Gratuito',
    level: 0,
    price: 'Gratis',
    priceUSD: '0 USD',
    priceMonthly: 0,
    features: [
      'Curso Gestión de Emociones',
      'Acceso al Podcast',
      'Vista previa de cursos'
    ]
  },
  basic: {
    name: 'basic',
    displayName: 'Plan Básico',
    level: 1,
    price: '25,000 COP',
    priceUSD: '5 USD',
    priceMonthly: 25000,
    features: [
      'Acceso completo a todos los cursos',
      'Progreso y estadísticas detalladas',
      'Certificados básicos',
      'Soporte por email',
      'Descarga de materiales'
    ]
  },
  complete: {
    name: 'complete',
    displayName: 'Plan Completo',
    level: 2,
    price: '50,000 COP',
    priceUSD: '10 USD',
    priceMonthly: 50000,
    features: [
      'Todo lo del Plan Básico',
      'Acceso a comunidad premium',
      'Talleres en vivo mensuales',
      'Certificados avanzados',
      'Soporte prioritario',
      'Acceso anticipado a nuevos cursos'
    ]
  },
  personal: {
    name: 'personal',
    displayName: 'Plan Personal',
    level: 3,
    price: '160,000 COP',
    priceUSD: '32 USD',
    priceMonthly: 160000,
    features: [
      'Todo lo del Plan Completo',
      'Sesiones 1-a-1 con psicóloga',
      'Contenido exclusivo premium',
      'Coaching personalizado',
      'Acceso prioritario a eventos',
      'Red de networking exclusiva'
    ]
  }
};

// Obtener plan del usuario desde la base de datos
export async function getUserPlanById(userId: string): Promise<Plan> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true }
    });

    if (!user) return 'free';

    const plan = user.subscriptionStatus as Plan;
    if (plan && Object.keys(PLANS).includes(plan)) {
      return plan;
    }

    return 'free';
  } catch (error) {
    console.error('Error getting user plan:', error);
    return 'free';
  }
}

// Versión síncrona para cuando ya tienes el usuario
export function getUserPlan(subscriptionStatus?: string | null): Plan {
  if (!subscriptionStatus) return 'free';

  const plan = subscriptionStatus as Plan;
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
  return Object.keys(PLANS).sort((a, b) =>
    PLANS[a as Plan].level - PLANS[b as Plan].level
  ) as Plan[];
}

export function getNextPlan(currentPlan: Plan): Plan | null {
  const hierarchy = getPlanHierarchy();
  const currentIndex = hierarchy.indexOf(currentPlan);

  if (currentIndex === -1 || currentIndex === hierarchy.length - 1) {
    return null;
  }

  return hierarchy[currentIndex + 1];
}
