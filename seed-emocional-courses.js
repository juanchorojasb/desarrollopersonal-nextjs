// seed-emocional-courses.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de cursos emocionales (Emociones, NeuroCalma, Tormenta)...');
  
  try {
    // 4. Emociones en Equilibrio (9 videos)
    console.log('⚖️ Creando curso: Emociones en Equilibrio...');
    const cursoEmociones = await prisma.course.create({
      data: {
        title: 'Emociones en Equilibrio',
        description: 'Programa integral para dominar la regulación emocional. Aprende a identificar, comprender y gestionar todas tus emociones con técnicas avanzadas de inteligencia emocional y neurociencia aplicada.',
        shortDesc: 'Maestría en regulación emocional',
        level: 'intermediate',
        category: 'Desarrollo Personal',
        price: 147,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 540, // 9 horas
        instructor: 'Dr. Roberto Silva',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/cea9cf65-6466-4ebd-b670-8baea2f6c1e9',
        modules: {
          create: [
            {
              title: 'Fundamentos de la Regulación Emocional',
              description: 'Bases científicas del equilibrio emocional',
              position: 1,
              duration: 120,
              lessons: {
                create: [
                  {
                    title: 'Neurociencia de las Emociones',
                    description: 'Comprende cómo tu cerebro procesa las emociones',
                    position: 1,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/cea9cf65-6466-4ebd-b670-8baea2f6c1e9',
                    videoId: 'cea9cf65-6466-4ebd-b670-8baea2f6c1e9',
                    content: 'Descubre los mecanismos neurobiológicos que gobiernan tus emociones...'
                  },
                  {
                    title: 'Mapeo Emocional Personal',
                    description: 'Identifica tus patrones emocionales únicos',
                    position: 2,
                    type: 'video',
                    videoDuration: 1080,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/7288352b-3466-4477-a805-a7a5da3fcc71',
                    videoId: '7288352b-3466-4477-a805-a7a5da3fcc71',
                    content: 'Crea un mapa detallado de tus respuestas emocionales automáticas...'
                  },
                  {
                    title: 'El Ciclo de la Respuesta Emocional',
                    description: 'Anatomía completa de una experiencia emocional',
                    position: 3,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/c189a931-08ea-4aeb-8d6f-a95d0b3873f4',
                    videoId: 'c189a931-08ea-4aeb-8d6f-a95d0b3873f4',
                    content: 'Analiza cada fase del proceso emocional desde el disparador hasta la resolución...'
                  }
                ]
              }
            },
            {
              title: 'Técnicas de Regulación Avanzada',
              description: 'Herramientas especializadas para el manejo emocional',
              position: 2,
              duration: 180,
              lessons: {
                create: [
                  {
                    title: 'Reevaluación Cognitiva',
                    description: 'Cambia el significado emocional de las situaciones',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/d837af16-6e3f-46ef-9b86-cf6f1795c2ac',
                    videoId: 'd837af16-6e3f-46ef-9b86-cf6f1795c2ac',
                    content: 'Domina la técnica de reevaluación para transformar tu experiencia emocional...'
                  },
                  {
                    title: 'Técnicas de Distanciamiento Emocional',
                    description: 'Observa tus emociones desde una perspectiva objetiva',
                    position: 2,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/69ab3b9f-486b-4c4f-b1d5-d44bb490b55c',
                    videoId: '69ab3b9f-486b-4c4f-b1d5-d44bb490b55c',
                    content: 'Aprende a crear distancia psicológica saludable de tus emociones intensas...'
                  },
                  {
                    title: 'Regulación Emocional en Tiempo Real',
                    description: 'Aplica técnicas instantáneas en situaciones intensas',
                    position: 3,
                    type: 'video',
                    videoDuration: 1380,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/0dde13f5-7915-46d4-b2d8-08af8a1777f7',
                    videoId: '0dde13f5-7915-46d4-b2d8-08af8a1777f7',
                    content: 'Desarrolla la capacidad de regular emociones en el momento presente...'
                  }
                ]
              }
            },
            {
              title: 'Aplicación Práctica y Mantenimiento',
              description: 'Integra las técnicas en tu vida diaria',
              position: 3,
              duration: 240,
              lessons: {
                create: [
                  {
                    title: 'Diseño de tu Sistema Personal',
                    description: 'Crea tu protocolo personalizado de regulación emocional',
                    position: 1,
                    type: 'video',
                    videoDuration: 1440,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/f36f8f75-4b66-4747-bcff-72be870aaa27',
                    videoId: 'f36f8f75-4b66-4747-bcff-72be870aaa27',
                    content: 'Diseña un sistema personalizado que se adapte a tu estilo de vida...'
                  },
                  {
                    title: 'Navegación de Emociones Complejas',
                    description: 'Gestiona situaciones emocionales multifacéticas',
                    position: 2,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/cb737748-58c9-4f90-a6cf-36041f6c3861',
                    videoId: 'cb737748-58c9-4f90-a6cf-36041f6c3861',
                    content: 'Aprende a navegar emociones contradictorias y situaciones complejas...'
                  },
                  {
                    title: 'Mantenimiento a Largo Plazo',
                    description: 'Estrategias para mantener el equilibrio emocional sostenible',
                    position: 3,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/8c3472e4-d00a-4177-bae7-8511cd19d2a8',
                    videoId: '8c3472e4-d00a-4177-bae7-8511cd19d2a8',
                    content: 'Desarrolla un plan sostenible para mantener tu equilibrio emocional...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // 5. NeuroCalma (9 videos)
    console.log('🧠 Creando curso: NeuroCalma...');
    const cursoNeuroCalma = await prisma.course.create({
      data: {
        title: 'NeuroCalma',
        description: 'Programa basado en neurociencia para alcanzar estados profundos de calma y serenidad. Combina técnicas milenarias con descubrimientos neurocientíficos modernos para transformar tu sistema nervioso.',
        shortDesc: 'Calma profunda basada en neurociencia',
        level: 'advanced',
        category: 'Bienestar',
        price: 167,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 630, // 10.5 horas
        instructor: 'Dr. Elena Martín',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/0d189ecb-71e2-4f32-a47c-38a298a2e793',
        modules: {
          create: [
            {
              title: 'Neurobiología de la Calma',
              description: 'Fundamentos científicos del estado de calma',
              position: 1,
              duration: 150,
              lessons: {
                create: [
                  {
                    title: 'El Sistema Nervioso y la Calma',
                    description: 'Comprende la neurobiología de los estados de serenidad',
                    position: 1,
                    type: 'video',
                    videoDuration: 1380,
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/0d189ecb-71e2-4f32-a47c-38a298a2e793',
                    videoId: '0d189ecb-71e2-4f32-a47c-38a298a2e793',
                    content: 'Explora cómo tu sistema nervioso genera y mantiene estados de calma profunda...'
                  },
                  {
                    title: 'Neurotransmisores de la Serenidad',
                    description: 'La química cerebral de la tranquilidad',
                    position: 2,
                    type: 'video',
                    videoDuration: 1200,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/6b7cb42c-bb6f-42e6-b064-8d755843be7f',
                    videoId: '6b7cb42c-bb6f-42e6-b064-8d755843be7f',
                    content: 'Descubre cómo optimizar la producción natural de neurotransmisores calmantes...'
                  },
                  {
                    title: 'Neuroplasticidad y Estados de Calma',
                    description: 'Cómo entrenar tu cerebro para la serenidad',
                    position: 3,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/9a9b8c38-3bcb-4b78-984e-a345bf9f8a61',
                    videoId: '9a9b8c38-3bcb-4b78-984e-a345bf9f8a61',
                    content: 'Aprende a remodelar tu cerebro para acceder más fácilmente a estados de calma...'
                  }
                ]
              }
            },
            {
              title: 'Técnicas de Neuro-Relajación',
              description: 'Métodos científicos para la relajación profunda',
              position: 2,
              duration: 240,
              lessons: {
                create: [
                  {
                    title: 'Respiración Neurocientífica',
                    description: 'Patrones respiratorios que activan la calma',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/612c76ff-d82b-4222-b8fe-05d4c41c2a05',
                    videoId: '612c76ff-d82b-4222-b8fe-05d4c41c2a05',
                    content: 'Domina técnicas respiratorias basadas en investigación neurocientífica...'
                  },
                  {
                    title: 'Meditación de Ondas Cerebrales',
                    description: 'Sincroniza tus ondas cerebrales para la calma',
                    position: 2,
                    type: 'video',
                    videoDuration: 1440,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/4b53e15e-da14-4b72-a504-c89a88845afe',
                    videoId: '4b53e15e-da14-4b72-a504-c89a88845afe',
                    content: 'Aprende a influir conscientemente en tus patrones de ondas cerebrales...'
                  },
                  {
                    title: 'Relajación Muscular Progresiva Neural',
                    description: 'Técnicas avanzadas de relajación corporal',
                    position: 3,
                    type: 'video',
                    videoDuration: 1380,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/e9861eb2-f938-41cb-963c-41c863cdafc6',
                    videoId: 'e9861eb2-f938-41cb-963c-41c863cdafc6',
                    content: 'Combina relajación muscular con técnicas de neuroplasticidad...'
                  }
                ]
              }
            },
            {
              title: 'Estados Profundos de Serenidad',
              description: 'Accede a niveles avanzados de calma interior',
              position: 3,
              duration: 240,
              lessons: {
                create: [
                  {
                    title: 'Acceso a Estados Theta',
                    description: 'Alcanza estados cerebrales de profunda serenidad',
                    position: 1,
                    type: 'video',
                    videoDuration: 1560,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/1c976c5d-b474-4ca6-87b9-87976c82d422',
                    videoId: '1c976c5d-b474-4ca6-87b9-87976c82d422',
                    content: 'Aprende a acceder conscientemente a estados theta de calma profunda...'
                  },
                  {
                    title: 'Integración Neuro-Emocional',
                    description: 'Armoniza mente, cerebro y emociones',
                    position: 2,
                    type: 'video',
                    videoDuration: 1320,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/a50d21fe-71e9-407b-b081-72de07cbcca0',
                    videoId: 'a50d21fe-71e9-407b-b081-72de07cbcca0',
                    content: 'Integra todos los aspectos de tu ser para una calma holística...'
                  },
                  {
                    title: 'Mantenimiento de Estados Elevados',
                    description: 'Sostén la calma en tu vida cotidiana',
                    position: 3,
                    type: 'video',
                    videoDuration: 1440,
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/e3574e25-d69b-4fa3-ad02-dff865385046',
                    videoId: 'e3574e25-d69b-4fa3-ad02-dff865385046',
                    content: 'Desarrolla la capacidad de mantener estados elevados en tu rutina diaria...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('✅ Cursos emocionales 4-5 creados exitosamente!');
    console.log(`⚖️ Emociones en Equilibrio: ${cursoEmociones.id}`);
    console.log(`🧠 NeuroCalma: ${cursoNeuroCalma.id}`);

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