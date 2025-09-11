// seed-tormenta-course.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌪️ Iniciando seed del curso: Navegando la Tormenta Interior...');
  
  try {
    // 6. Navegando la Tormenta Interior (6 videos)
    console.log('⛈️ Creando curso: Navegando la Tormenta Interior...');
    const cursoTormenta = await prisma.course.create({
      data: {
        title: 'Navegando la Tormenta Interior',
        description: 'Guía completa para atravesar períodos de crisis emocional y transformar el dolor en crecimiento. Aprende a navegar las tormentas internas con sabiduría, resistencia y una perspectiva transformadora.',
        shortDesc: 'Transforma la crisis en crecimiento',
        level: 'intermediate',
        category: 'Crecimiento Personal',
        price: 137,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 420, // 7 horas
        instructor: 'Dra. Isabel Torres',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/ca16f310-273f-4e5b-bc4e-987d1f712d33',
        modules: {
          create: [
            {
              title: 'Comprendiendo la Tormenta',
              description: 'Perspectiva integral de las crisis emocionales',
              position: 1,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Anatomía de una Crisis Emocional',
                    description: 'Comprende las fases y dinámicas de las tormentas internas',
                    position: 1,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/ca16f310-273f-4e5b-bc4e-987d1f712d33',
                    videoId: 'ca16f310-273f-4e5b-bc4e-987d1f712d33',
                    content: 'Explora la naturaleza y las fases de las crisis emocionales profundas...'
                  },
                  {
                    title: 'La Psicología del Sufrimiento',
                    description: 'Perspectivas científicas y filosóficas sobre el dolor emocional',
                    position: 2,
                    type: 'video',
                    videoDuration: 1440,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/e332c8c8-1db6-4bca-aac9-7ac54ecb8896',
                    videoId: 'e332c8c8-1db6-4bca-aac9-7ac54ecb8896',
                    content: 'Comprende el papel del sufrimiento en el crecimiento y la transformación personal...'
                  }
                ]
              }
            },
            {
              title: 'Herramientas de Navegación',
              description: 'Estrategias prácticas para atravesar crisis',
              position: 2,
              duration: 180,
              lessons: {
                create: [
                  {
                    title: 'Técnicas de Estabilización Emocional',
                    description: 'Encuentra tu centro en medio del caos emocional',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/3cb0913f-bd2c-45bb-89cb-6d00d8156a31',
                    videoId: '3cb0913f-bd2c-45bb-89cb-6d00d8156a31',
                    content: 'Aprende técnicas para mantener la estabilidad durante tormentas emocionales...'
                  },
                  {
                    title: 'Reevaluación Constructiva de Crisis',
                    description: 'Transforma tu perspectiva sobre las dificultades',
                    position: 2,
                    type: 'video',
                    videoDuration: 1380,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/327e4e9d-632d-45a6-a28c-1c7d15534985',
                    videoId: '327e4e9d-632d-45a6-a28c-1c7d15534985',
                    content: 'Desarrolla la capacidad de ver oportunidades de crecimiento en las crisis...'
                  }
                ]
              }
            },
            {
              title: 'Transformación y Renacimiento',
              description: 'Emerge fortalecido de las experiencias difíciles',
              position: 3,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Alquimia Emocional: De Plomo a Oro',
                    description: 'Transforma el dolor en sabiduría y fortaleza',
                    position: 1,
                    type: 'video',
                    videoDuration: 1560,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/3f1f9265-f391-4133-942c-944897178729',
                    videoId: '3f1f9265-f391-4133-942c-944897178729',
                    content: 'Aprende el arte de transformar experiencias dolorosas en crecimiento personal...'
                  },
                  {
                    title: 'Integración y Nuevo Comienzo',
                    description: 'Integra las lecciones y renace fortalecido',
                    position: 2,
                    type: 'video',
                    videoDuration: 1440,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/79a8778c-21c5-4344-98f9-410deb238324',
                    videoId: '79a8778c-21c5-4344-98f9-410deb238324',
                    content: 'Integra las lecciones aprendidas y construye una nueva versión de ti mismo...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('✅ Curso final creado exitosamente!');
    console.log(`⛈️ Navegando la Tormenta Interior: ${cursoTormenta.id}`);
    console.log('');
    console.log('🎯 RESUMEN DE VIDEOS POR CURSO:');
    console.log('   🧠 GPS Salud Mental: 4 videos');
    console.log('   🛏️ Arquitectura del Descanso: 5 videos');
    console.log('   💙 Gestionando la Depresión: 3 videos');
    console.log('   ⚖️ Emociones en Equilibrio: 9 videos');
    console.log('   🧠 NeuroCalma: 9 videos');
    console.log('   ⛈️ Navegando la Tormenta Interior: 6 videos');
    console.log('');
    console.log('   📊 TOTAL: 36 videos MediaDelivery añadidos');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });