const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedForums() {
  try {
    console.log('Seeding forum categories...');

    const categories = [
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
    ];

    for (const category of categories) {
      const existing = await prisma.forumCategory.findUnique({
        where: { slug: category.slug }
      });

      if (!existing) {
        await prisma.forumCategory.create({
          data: category
        });
        console.log(`Created category: ${category.name}`);
      }
    }

    console.log('Forum seeding completed!');
    
  } catch (error) {
    console.error('Error seeding forums:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedForums();
