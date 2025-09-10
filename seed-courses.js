// seed-courses.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de cursos...');
  
  try {
    // Limpiar datos existentes (opcional)
    // await prisma.lessonProgress.deleteMany({});
    // await prisma.enrollment.deleteMany({});
    // await prisma.lesson.deleteMany({});
    // await prisma.module.deleteMany({});
    // await prisma.course.deleteMany({});

    console.log('📚 Creando curso de Inteligencia Emocional...');
    
    // Crear curso principal de Inteligencia Emocional
    const curso1 = await prisma.course.create({
      data: {
        title: 'Fundamentos de Inteligencia Emocional',
        description: 'Un curso completo que te enseñará a dominar tus emociones y mejorar significativamente tus relaciones interpersonales. Aprenderás técnicas científicamente probadas para gestionar el estrés, aumentar tu autoconciencia y desarrollar habilidades sociales que transformarán tu vida personal y profesional.',
        shortDesc: 'Domina tus emociones y transforma tu vida',
        level: 'beginner',
        category: 'Desarrollo Personal',
        price: 97,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 480, // 8 horas
        instructor: 'Dra. María González',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://desarrollopersonal.b-cdn.net/trailer-ie.mp4',
        modules: {
          create: [
            {
              title: 'Introducción a la Inteligencia Emocional',
              description: 'Fundamentos básicos y conceptos clave para entender la inteligencia emocional',
              position: 1,
              duration: 90,
              lessons: {
                create: [
                  {
                    title: '¿Qué es la Inteligencia Emocional?',
                    description: 'Definición, historia y importancia en la vida moderna',
                    position: 1,
                    type: 'video',
                    videoDuration: 900, // 15 minutos
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/sample-video-1',
                    content: 'En esta lección exploraremos qué significa realmente la inteligencia emocional y por qué es tan importante en nuestras vidas...'
                  },
                  {
                    title: 'Los 4 Pilares Fundamentales',
                    description: 'Autoconciencia, autorregulación, empatía y habilidades sociales',
                    position: 2,
                    type: 'video',
                    videoDuration: 1200, // 20 minutos
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/sample-video-2',
                    content: 'Los cuatro pilares de la inteligencia emocional son la base de todo crecimiento personal...'
                  },
                  {
                    title: 'Test de Evaluación Inicial',
                    description: 'Evalúa tu nivel actual de inteligencia emocional',
                    position: 3,
                    type: 'quiz',
                    videoDuration: 600, // 10 minutos
                    isPreview: false,
                    content: 'Antes de continuar, es importante que evalúes tu nivel actual...'
                  }
                ]
              }
            },
            {
              title: 'Autoconciencia Emocional',
              description: 'Aprende a identificar y comprender tus emociones profundamente',
              position: 2,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Identificando tus Emociones',
                    description: 'Técnicas prácticas para reconocer emociones en tiempo real',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500, // 25 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/ie-identificar.mp4',
                    content: 'La primera habilidad de la inteligencia emocional es reconocer nuestras emociones...'
                  },
                  {
                    title: 'El Diario Emocional',
                    description: 'Herramienta práctica para el seguimiento emocional diario',
                    position: 2,
                    type: 'video',
                    videoDuration: 1080, // 18 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/ie-diario.mp4',
                    content: 'El diario emocional es una herramienta poderosa para desarrollar autoconciencia...'
                  },
                  {
                    title: 'Ejercicios de Mindfulness',
                    description: 'Prácticas de atención plena para aumentar la conciencia presente',
                    position: 3,
                    type: 'video',
                    videoDuration: 1320, // 22 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/ie-mindfulness.mp4',
                    content: 'El mindfulness nos ayuda a estar presentes con nuestras emociones...'
                  }
                ]
              }
            },
            {
              title: 'Autorregulación Emocional',
              description: 'Técnicas avanzadas para gestionar y controlar tus emociones',
              position: 3,
              duration: 150,
              lessons: {
                create: [
                  {
                    title: 'Técnicas de Respiración',
                    description: 'Métodos probados para calmar el sistema nervioso instantáneamente',
                    position: 1,
                    type: 'video',
                    videoDuration: 1200, // 20 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/ie-respiracion.mp4',
                    content: 'La respiración consciente es la herramienta más poderosa para la autorregulación...'
                  },
                  {
                    title: 'Reestructuración Cognitiva',
                    description: 'Aprende a cambiar patrones de pensamiento negativos',
                    position: 2,
                    type: 'video',
                    videoDuration: 1680, // 28 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/ie-cognitiva.mp4',
                    content: 'Nuestros pensamientos influyen directamente en nuestras emociones...'
                  },
                  {
                    title: 'Gestión del Estrés',
                    description: 'Estrategias efectivas para manejar situaciones estresantes',
                    position: 3,
                    type: 'video',
                    videoDuration: 1800, // 30 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/ie-estres.mp4',
                    content: 'El estrés es inevitable, pero podemos aprender a gestionarlo eficazmente...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('🧘 Creando curso de Mindfulness...');

    // Crear curso de Mindfulness
    const curso2 = await prisma.course.create({
      data: {
        title: 'Mindfulness y Meditación Práctica',
        description: 'Un curso completo para incorporar mindfulness en tu vida diaria y reducir el estrés de manera efectiva. Aprenderás técnicas de meditación, ejercicios de respiración y prácticas de atención plena que transformarán tu bienestar mental.',
        shortDesc: 'Encuentra paz interior y claridad mental',
        level: 'beginner',
        category: 'Bienestar',
        price: 127,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 360, // 6 horas
        instructor: 'Jorge Martínez',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://desarrollopersonal.b-cdn.net/trailer-mindfulness.mp4',
        modules: {
          create: [
            {
              title: 'Fundamentos del Mindfulness',
              description: 'Introducción a los conceptos básicos de la atención plena',
              position: 1,
              duration: 90,
              lessons: {
                create: [
                  {
                    title: 'Historia y Origen del Mindfulness',
                    description: 'Raíces budistas y aplicación moderna',
                    position: 1,
                    type: 'video',
                    videoDuration: 720, // 12 minutos
                    isPreview: true,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/mindfulness-historia.mp4'
                  },
                  {
                    title: 'Beneficios Científicos',
                    description: 'Estudios e investigaciones sobre mindfulness',
                    position: 2,
                    type: 'video',
                    videoDuration: 1080, // 18 minutos
                    isPreview: true,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/mindfulness-beneficios.mp4'
                  }
                ]
              }
            },
            {
              title: 'Técnicas de Meditación',
              description: 'Aprende diferentes tipos de meditación mindfulness',
              position: 2,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Meditación de Respiración',
                    description: 'La técnica fundamental de atención a la respiración',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500, // 25 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/mindfulness-respiracion.mp4'
                  },
                  {
                    title: 'Body Scan o Exploración Corporal',
                    description: 'Técnica para desarrollar conciencia corporal',
                    position: 2,
                    type: 'video',
                    videoDuration: 1800, // 30 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/mindfulness-bodyscan.mp4'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('💼 Creando curso de Liderazgo...');

    // Crear curso de Liderazgo
    const curso3 = await prisma.course.create({
      data: {
        title: 'Liderazgo Transformacional',
        description: 'Desarrolla habilidades de liderazgo que inspiren y motiven equipos de alto rendimiento. Aprende a comunicar visión, gestionar conflictos y crear una cultura de excelencia en tu organización.',
        shortDesc: 'Conviértete en el líder que admirarías',
        level: 'intermediate',
        category: 'Liderazgo',
        price: 197,
        currency: 'USD',
        status: 'published',
        featured: false,
        duration: 720, // 12 horas
        instructor: 'Carlos Ruíz',
        thumbnail: '/api/placeholder/800/400',
        modules: {
          create: [
            {
              title: 'Bases del Liderazgo',
              description: 'Fundamentos teóricos y prácticos del liderazgo efectivo',
              position: 1,
              duration: 180,
              lessons: {
                create: [
                  {
                    title: 'Tipos de Liderazgo',
                    description: 'Estilos de liderazgo y cuándo aplicar cada uno',
                    position: 1,
                    type: 'video',
                    videoDuration: 1320, // 22 minutos
                    isPreview: true,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/liderazgo-tipos.mp4'
                  },
                  {
                    title: 'Autoliderazgo',
                    description: 'Liderarte a ti mismo antes de liderar a otros',
                    position: 2,
                    type: 'video',
                    videoDuration: 1680, // 28 minutos
                    isPreview: false,
                    videoUrl: 'https://desarrollopersonal.b-cdn.net/liderazgo-auto.mp4'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('🏆 Creando achievements básicos...');

    // Crear algunos achievements básicos
    const achievements = await prisma.achievement.createMany({
      data: [
        {
          name: 'Primera Lección',
          description: 'Completaste tu primera lección',
          icon: '🎯',
          type: 'lesson_completion',
          criteria: JSON.stringify({ lessons_completed: 1 }),
          xpReward: 50,
          isActive: true
        },
        {
          name: 'Estudiante Dedicado',
          description: 'Completaste 10 lecciones',
          icon: '📚',
          type: 'lesson_completion',
          criteria: JSON.stringify({ lessons_completed: 10 }),
          xpReward: 200,
          isActive: true
        },
        {
          name: 'Primer Curso',
          description: 'Completaste tu primer curso completo',
          icon: '🎓',
          type: 'course_completion',
          criteria: JSON.stringify({ courses_completed: 1 }),
          xpReward: 500,
          isActive: true
        },
        {
          name: 'Racha de 7 días',
          description: 'Estudiaste durante 7 días consecutivos',
          icon: '🔥',
          type: 'streak',
          criteria: JSON.stringify({ streak_days: 7 }),
          xpReward: 300,
          isActive: true
        },
        {
          name: 'Maestro del Mindfulness',
          description: 'Completaste el curso de Mindfulness',
          icon: '🧘',
          type: 'specific_course',
          criteria: JSON.stringify({ course_id: curso2.id }),
          xpReward: 1000,
          isActive: true
        }
      ]
    });

    console.log('✅ Seed completado exitosamente!');
    console.log(`📚 Cursos creados: ${curso1.title}, ${curso2.title}, ${curso3.title}`);
    console.log(`🏆 ${achievements.count} achievements creados`);
    console.log('');
    console.log('🌐 Ahora puedes visitar:');
    console.log('   📚 http://31.97.85.16:3001/dashboard/cursos');
    console.log('   🎯 http://31.97.85.16:3001/dashboard');
    console.log('');

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
