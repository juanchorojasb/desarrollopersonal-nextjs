const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateUsers() {
  try {
    console.log('🔄 Iniciando migración de usuarios...');
    
    // Crear usuario de ejemplo si no existe ninguno
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      // Crear usuarios de ejemplo para testing
      await prisma.user.createMany({
        data: [
          {
            clerkUserId: 'user_example_1',
            email: 'admin@desarrollopersonal.uno',
            firstName: 'Admin',
            lastName: 'Principal',
            plan: 'personal'
          },
          {
            clerkUserId: 'user_example_2', 
            email: 'user@ejemplo.com',
            firstName: 'Usuario',
            lastName: 'Ejemplo',
            plan: 'completo'
          }
        ]
      });
      
      console.log('✅ Usuarios de ejemplo creados');
    }

    // Crear categorías del foro si no existen
    const categoryCount = await prisma.forumCategory.count();
    
    if (categoryCount === 0) {
      await prisma.forumCategory.createMany({
        data: [
          {
            name: 'Desarrollo Personal',
            slug: 'desarrollo-personal',
            description: 'Comparte estrategias, experiencias y reflexiones sobre crecimiento personal',
            icon: '🌱'
          },
          {
            name: 'Salud Mental',
            slug: 'salud-mental',
            description: 'Espacio seguro para hablar sobre bienestar emocional y mental',
            icon: '🧠'
          },
          {
            name: 'Hábitos y Rutinas',
            slug: 'habitos-rutinas',
            description: 'Construcción de hábitos positivos y rutinas efectivas',
            icon: '⚡'
          },
          {
            name: 'Motivación',
            slug: 'motivacion',
            description: 'Historias inspiradoras y apoyo mutuo para mantenerse motivado',
            icon: '🔥'
          },
          {
            name: 'Preguntas Generales',
            slug: 'preguntas-generales',
            description: 'Cualquier pregunta relacionada con desarrollo personal',
            icon: '❓'
          }
        ]
      });
      
      console.log('✅ Categorías del foro creadas');
    }

    console.log('✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers();
