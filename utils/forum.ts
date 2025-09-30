export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Hace un momento';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
}

export function formatUserName(user: { firstName?: string; lastName?: string; email: string }): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return user.email.split('@')[0];
}

export function truncateContent(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content;
  const textContent = content.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) return textContent;
  return textContent.substring(0, maxLength).trim() + '...';
}

export function validatePostContent(title: string, content: string): string[] {
  const errors: string[] = [];
  
  if (!title.trim()) {
    errors.push('El título es requerido');
  } else if (title.length < 5) {
    errors.push('El título debe tener al menos 5 caracteres');
  } else if (title.length > 200) {
    errors.push('El título no puede exceder 200 caracteres');
  }
  
  if (!content.trim()) {
    errors.push('El contenido es requerido');
  } else if (content.length < 10) {
    errors.push('El contenido debe tener al menos 10 caracteres');
  } else if (content.length > 10000) {
    errors.push('El contenido no puede exceder 10,000 caracteres');
  }
  
  return errors;
}
