import { auth, currentUser } from '@clerk/nextjs/server';

export async function requirePremiumAccess() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        hasAccess: false, 
        user: null, 
        upgradeMessage: 'Inicia sesión para acceder a la comunidad premium.' 
      };
    }

    const user = await currentUser();
    
    if (!user) {
      return { 
        hasAccess: false, 
        user: null, 
        upgradeMessage: 'Usuario no encontrado.' 
      };
    }

    // Verificar plan del usuario desde metadata
    const metadata = user.publicMetadata as { plan?: string };
    const userPlan = metadata.plan || 'free';

    // Los planes que tienen acceso a la comunidad premium
    const premiumPlans = ['completo', 'personal', 'free']; // Temporal: permitir acceso free

    const hasAccess = premiumPlans.includes(userPlan);

    let upgradeMessage = '';
    if (!hasAccess) {
      if (userPlan === 'free') {
        upgradeMessage = 'La comunidad es exclusiva para miembros premium. Actualiza tu plan para participar.';
      } else if (userPlan === 'basico') {
        upgradeMessage = 'Necesitas el plan Completo o Personal para acceder a la comunidad.';
      } else {
        upgradeMessage = 'Tu plan actual no incluye acceso a la comunidad premium.';
      }
    }

    return {
      hasAccess,
      user: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        plan: userPlan
      },
      upgradeMessage
    };

  } catch (error) {
    console.error('Error checking premium access:', error);
    return { 
      hasAccess: false, 
      user: null, 
      upgradeMessage: 'Error al verificar el acceso. Intenta nuevamente.' 
    };
  }
}

export async function requireAdminAccess() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { hasAccess: false, user: null };
    }

    const user = await currentUser();
    
    if (!user) {
      return { hasAccess: false, user: null };
    }

    // Verificar si es admin
    const metadata = user.publicMetadata as { role?: string };
    const isAdmin = metadata.role === 'admin' || 
                   user.emailAddresses[0]?.emailAddress === 'admin@desarrollopersonal.uno';

    return {
      hasAccess: isAdmin,
      user
    };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { hasAccess: false, user: null };
  }
}
