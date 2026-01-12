'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PLANS, Plan, hasAccess, getNextPlan, getUpgradeMessage, getPlanHierarchy } from './plans';

export { PLANS, hasAccess, getNextPlan, getUpgradeMessage, getPlanHierarchy };
export type { Plan };

export function useUserPlan(): Plan {
  const { user } = useCurrentUser();
  
  if (!user) return 'free';
  
  // Usar subscriptionStatus directamente del usuario
  const plan = (user as any).subscriptionStatus as Plan;
  if (plan && Object.keys(PLANS).includes(plan)) {
    return plan;
  }
  
  return 'free';
}

export function useHasAccess(requiredPlan: Plan): boolean {
  const currentPlan = useUserPlan();
  return hasAccess(currentPlan, requiredPlan);
}
