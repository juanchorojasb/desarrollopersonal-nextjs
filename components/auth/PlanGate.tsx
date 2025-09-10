'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useUserPlan, useHasAccess, Plan, PLANS, getUpgradeMessage, getNextPlan } from '@/lib/plans-client';
import { Lock, Crown, Zap, Star, ArrowRight } from 'lucide-react';

interface PlanGateProps {
  requiredPlan: Plan;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export default function PlanGate({ 
  requiredPlan, 
  children, 
  fallback,
  showUpgrade = true 
}: PlanGateProps) {
  const hasAccess = useHasAccess(requiredPlan);
  const userPlan = useUserPlan();
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  if (!showUpgrade) {
    return null;
  }
  
  return <UpgradePrompt requiredPlan={requiredPlan} userPlan={userPlan} />;
}

interface UpgradePromptProps {
  requiredPlan: Plan;
  userPlan: Plan;
}

function UpgradePrompt({ requiredPlan, userPlan }: UpgradePromptProps) {
  const requiredPlanConfig = PLANS[requiredPlan];
  const userPlanConfig = PLANS[userPlan];
  const nextPlan = getNextPlan(userPlan);
  
  const getPlanIcon = (plan: Plan) => {
    switch (plan) {
      case 'basic':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'complete':
        return <Crown className="w-6 h-6 text-purple-500" />;
      case 'personal':
        return <Star className="w-6 h-6 text-yellow-500" />;
      default:
        return <Lock className="w-6 h-6 text-gray-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <Lock className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Contenido Premium
        </h2>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          {getUpgradeMessage(requiredPlan)}
        </p>
        
        {/* Current Plan */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getPlanIcon(userPlan)}
            <span className="font-medium text-gray-700">
              Tu plan actual: {userPlanConfig.displayName}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {userPlanConfig.features.join(' • ')}
          </div>
        </div>
        
        {/* Required Plan */}
        <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getPlanIcon(requiredPlan)}
            <span className="font-medium text-indigo-700">
              Plan requerido: {requiredPlanConfig.displayName}
            </span>
          </div>
          <div className="text-sm text-indigo-600">
            {requiredPlanConfig.features.join(' • ')}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors group"
          >
            <span>Ver Planes y Precios</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {nextPlan && (
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center w-full px-6 py-2 text-indigo-600 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Actualizar a {PLANS[nextPlan].displayName}
            </Link>
          )}
          
          <Link
            href="/dashboard"
            className="inline-block w-full px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}