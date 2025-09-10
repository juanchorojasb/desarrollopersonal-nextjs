'use client';

import { useUser } from '@clerk/nextjs';
import { Plan, PLANS, hasAccess, getUpgradeMessage, getNextPlan } from './plans';

export function useUserPlan(): Plan {
  const { user } = useUser();
  
  if (!user) return 'free';
  
  const plan = user.publicMetadata?.plan as Plan;
  if (plan && Object.keys(PLANS).includes(plan)) {
    return plan;
  }
  
  return 'free';
}

export function useHasAccess(requiredPlan: Plan): boolean {
  const userPlan = useUserPlan();
  return hasAccess(userPlan, requiredPlan);
}

export { PLANS, hasAccess, getUpgradeMessage, getNextPlan };
export type { Plan, PlanConfig } from './plans';