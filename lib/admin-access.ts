import { auth, currentUser } from '@clerk/nextjs/server';

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

    // Verificar si el usuario es admin (puedes ajustar esta lógica)
    const metadata = user.publicMetadata as { role?: string };
    const isAdmin = metadata.role === 'admin' || user.emailAddresses[0]?.emailAddress === 'admin@desarrollopersonal.uno';

    return {
      hasAccess: isAdmin,
      user
    };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { hasAccess: false, user: null };
  }
}
