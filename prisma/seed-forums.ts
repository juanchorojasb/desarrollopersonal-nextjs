import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedForums() {
  console.log('🌱 Seeding forum categories...');

  // Create forum categories
  const categories = [
    {
      name: 'Bienestar Personal',
      description: 'Comparte tus experiencias sobre autocuidado, mindfulness y equilibrio vida-trabajo',
      slug: 'bienestar',
      color: '#10b981', // green-500
      icon: 'Heart',
      position: 1,
    },
    {
      name: 'Estudios y Aprendizaje',
      description: 'Discusiones sobre técnicas de estudio, progreso en cursos y métodos de aprendizaje',
      slug: 'estudio',
      color: '#3b82f6', // blue-500
      icon: 'BookOpen',
      position: 2,
    },
    {
      name: 'Motivación y Logros',
      description: 'Comparte tus logros, celebra tus avances y motiva a otros miembros de la comunidad',
      slug: 'motivacion',
      color: '#f59e0b', // amber-500
      icon: 'Trophy',
      position: 3,
    },
    {
      name: 'Desarrollo Profesional',
      description: 'Conversaciones sobre carrera, liderazgo, productividad y crecimiento profesional',
      slug: 'profesional',
      color: '#8b5cf6', // violet-500
      icon: 'Briefcase',
      position: 4,
    },
    {
      name: 'Preguntas Generales',
      description: 'Espacio para dudas, preguntas sobre la plataforma y soporte entre usuarios',
      slug: 'preguntas',
      color: '#6b7280', // gray-500
      icon: 'HelpCircle',
      position: 5,
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
      console.log(`✅ Created category: ${category.name}`);
    } else {
      console.log(`⚠️ Category already exists: ${category.name}`);
    }
  }

  console.log('🎉 Forum seeding completed!');
}

async function main() {
  await seedForums();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });