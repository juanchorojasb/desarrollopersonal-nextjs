// seed-6-additional-courses.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de 6 cursos adicionales con videos MediaDelivery...');
  
  try {
    // 1. GPS Salud Mental (4 videos)
    console.log('🧠 Creando curso: GPS Salud Mental...');
    const cursoGPS = await prisma.course.create({
      data: {
        title: 'GPS Salud Mental',
        description: 'Una guía completa para navegar tu bienestar emocional y mental. Aprende a identificar señales de alerta, desarrollar estrategias de autocuidado y construir una rutina de salud mental sostenible para tu vida diaria.',
        shortDesc: 'Tu navegador hacia el bienestar mental',
        level: 'beginner',
        category: 'Salud Mental',
        price: 89,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 240, // 4 horas
        instructor: 'Dra. Patricia Morales',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/93fd37b8-4ccb-4b1b-9227-d8accebfabaf',
        modules: {
          create: [
            {
              title: 'Fundamentos de la Salud Mental',
              description: 'Comprende los pilares básicos del bienestar psicológico',
              position: 1,
              duration: 60,
              lessons: {
                create: [
                  {
                    title: 'Introducción al Bienestar Mental',
                    description: 'Qué es la salud mental y por qué es fundamental para tu vida',
                    position: 1,
                    type: 'video',
                    videoDuration: 900,
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/93fd37b8-4ccb-4b1b-9227-d8accebfabaf',
                    videoId: '93fd37b8-4ccb-4b1b-9227-d8accebfabaf',
                    content: 'Descubre los fundamentos de la salud mental y cómo crear una base sólida para tu bienestar...'
                  },
                  {
                    title: 'Señales de Alerta Temprana',
                    description: 'Aprende a reconocer indicadores de desequilibrio mental',
                    position: 2,
                    type: 'video',
                    videoDuration: 1080,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/c71755cc-d89e-4c76-8870-e52c6ab17658',
                    videoId: 'c71755cc-d89e-4c76-8870-e52c6ab17658',
                    content: 'Identifica las señales tempranas que indican cuando tu salud mental necesita atención...'
                  }
                ]
              }
            },
            {
              title: 'Estrategias de Autocuidado',
              description: 'Herramientas prácticas para mantener tu equilibrio emocional',
              position: 2,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Rutinas de Autocuidado Diario',
                    description: 'Crea hábitos sostenibles que nutran tu bienestar mental',
                    position: 1,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc',
                    videoId: '8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc',
                    content: 'Desarrolla rutinas de autocuidado que se adapten a tu estilo de vida...'
                  },
                  {
                    title: 'Navegación en Crisis',
                    description: 'Estrategias para momentos de alta intensidad emocional',
                    position: 2,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/e33758a5-aeda-4a0c-b12e-aad06cd20a78',
                    videoId: 'e33758a5-aeda-4a0c-b12e-aad06cd20a78',
                    content: 'Aprende técnicas de navegación emocional para momentos difíciles...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // 2. Arquitectura del Descanso (5 videos)
    console.log('🛏️ Creando curso: Arquitectura del Descanso...');
    const cursoDescanso = await prisma.course.create({
      data: {
        title: 'Arquitectura del Descanso',
        description: 'Diseña un sistema integral de descanso y recuperación que transforme tu energía y productividad. Aprende técnicas avanzadas de relajación, optimización del sueño y recuperación mental para rendir al máximo.',
        shortDesc: 'Construye tu sistema perfecto de descanso',
        level: 'intermediate',
        category: 'Bienestar',
        price: 97,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 300, // 5 horas
        instructor: 'Dr. Luis Hernández',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/6d398119-2c3a-4ba9-ac1e-d8d51a0cb911',
        modules: {
          create: [
            {
              title: 'Ciencia del Descanso',
              description: 'Fundamentos científicos del sueño y la recuperación',
              position: 1,
              duration: 80,
              lessons: {
                create: [
                  {
                    title: 'Los Pilares del Descanso Reparador',
                    description: 'Comprende la ciencia detrás del sueño de calidad',
                    position: 1,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/6d398119-2c3a-4ba9-ac1e-d8d51a0cb911',
                    videoId: '6d398119-2c3a-4ba9-ac1e-d8d51a0cb911',
                    content: 'Descubre los fundamentos científicos de un descanso verdaderamente reparador...'
                  },
                  {
                    title: 'Ritmos Circadianos y Cronobiología',
                    description: 'Sincroniza tu reloj biológico para optimizar el descanso',
                    position: 2,
                    type: 'video',
                    videoDuration: 1080,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/a2d31bb1-bd57-424e-88a5-54229d0bf142',
                    videoId: 'a2d31bb1-bd57-424e-88a5-54229d0bf142',
                    content: 'Aprende a trabajar con tus ritmos naturales para mejorar la calidad del sueño...'
                  }
                ]
              }
            },
            {
              title: 'Diseño del Ambiente de Descanso',
              description: 'Crea el entorno perfecto para la recuperación',
              position: 2,
              duration: 100,
              lessons: {
                create: [
                  {
                    title: 'Optimización del Espacio de Sueño',
                    description: 'Diseña tu dormitorio como un santuario de descanso',
                    position: 1,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/ef26a4b5-db39-4239-a049-2d825910bb8b',
                    videoId: 'ef26a4b5-db39-4239-a049-2d825910bb8b',
                    content: 'Transforma tu dormitorio en el ambiente ideal para el descanso profundo...'
                  },
                  {
                    title: 'Rituales Pre-Sueño',
                    description: 'Crea rutinas que preparen tu mente y cuerpo para dormir',
                    position: 2,
                    type: 'video',
                    videoDuration: 1140,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/2d6144b5-f737-49fe-b6a0-a71aad965269',
                    videoId: '2d6144b5-f737-49fe-b6a0-a71aad965269',
                    content: 'Desarrolla rituales efectivos que señalen a tu cuerpo que es hora de descansar...'
                  }
                ]
              }
            },
            {
              title: 'Recuperación Activa',
              description: 'Técnicas de descanso consciente y recuperación mental',
              position: 3,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Microsiestas y Descansos Estratégicos',
                    description: 'Maximiza tu energía con técnicas de recuperación rápida',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/95c57c4c-eccb-428b-9519-2a468002a0cf',
                    videoId: '95c57c4c-eccb-428b-9519-2a468002a0cf',
                    content: 'Aprende a usar microsiestas y descansos estratégicos para optimizar tu energía...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // 3. Gestionando la Depresión (3 videos)
    console.log('💙 Creando curso: Gestionando la Depresión...');
    const cursoDepresion = await prisma.course.create({
      data: {
        title: 'Gestionando la Depresión',
        description: 'Un enfoque integral para comprender y gestionar la depresión. Aprende herramientas basadas en evidencia científica para recuperar tu bienestar emocional y construir resiliencia a largo plazo.',
        shortDesc: 'Herramientas para superar la depresión',
        level: 'beginner',
        category: 'Salud Mental',
        price: 127,
        currency: 'USD',
        status: 'published',
        featured: false,
        duration: 180, // 3 horas
        instructor: 'Dra. Carmen Ruiz',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/5d457920-2a95-4fce-a326-ce664ab3ff97',
        modules: {
          create: [
            {
              title: 'Comprendiendo la Depresión',
              description: 'Desmitifica la depresión y comprende sus mecanismos',
              position: 1,
              duration: 60,
              lessons: {
                create: [
                  {
                    title: 'Qué es Realmente la Depresión',
                    description: 'Comprende la depresión desde una perspectiva científica y humana',
                    position: 1,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/5d457920-2a95-4fce-a326-ce664ab3ff97',
                    videoId: '5d457920-2a95-4fce-a326-ce664ab3ff97',
                    content: 'Desmitifica la depresión y comprende sus aspectos neurobiológicos y psicológicos...'
                  }
                ]
              }
            },
            {
              title: 'Herramientas de Recuperación',
              description: 'Estrategias prácticas para gestionar síntomas depresivos',
              position: 2,
              duration: 80,
              lessons: {
                create: [
                  {
                    title: 'Terapia Cognitivo-Conductual Aplicada',
                    description: 'Técnicas de TCC para cambiar patrones de pensamiento negativos',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/4741f5f0-b7c6-4b8c-b07a-a5896f282218',
                    videoId: '4741f5f0-b7c6-4b8c-b07a-a5896f282218',
                    content: 'Aprende técnicas de terapia cognitivo-conductual para reestructurar pensamientos depresivos...'
                  }
                ]
              }
            },
            {
              title: 'Construyendo Resiliencia',
              description: 'Fortalece tu capacidad de recuperación a largo plazo',
              position: 3,
              duration: 40,
              lessons: {
                create: [
                  {
                    title: 'Prevención de Recaídas y Mantenimiento',
                    description: 'Estrategias para mantener el bienestar y prevenir nuevos episodios',
                    position: 1,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/a96727cf-ad3a-42d4-93d5-53fbb1bf845e',
                    videoId: 'a96727cf-ad3a-42d4-93d5-53fbb1bf845e',
                    content: 'Desarrolla un plan de mantenimiento a largo plazo para tu bienestar mental...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('✅ Primeros 3 cursos creados exitosamente!');
    console.log(`📚 GPS Salud Mental: ${cursoGPS.id}`);
    console.log(`🛏️ Arquitectura del Descanso: ${cursoDescanso.id}`);
    console.log(`💙 Gestionando la Depresión: ${cursoDepresion.id}`);

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