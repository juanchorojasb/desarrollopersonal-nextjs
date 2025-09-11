// seed-habitos-estudio.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed del curso Hábitos de Estudio Efectivos...');
  
  try {
    console.log('📚 Creando curso: Hábitos de Estudio Efectivos...');
    
    // Crear curso "Hábitos de Estudio Efectivos" con videos reales de MediaDelivery
    const cursoHabitos = await prisma.course.create({
      data: {
        id: '8ef86e1b-3c10-4131-a89d-baae3804d3ec',
        title: 'Hábitos de Estudio Efectivos',
        description: 'Transforma tu manera de estudiar con técnicas científicamente probadas que maximizan tu retención, comprensión y productividad. Aprenderás a crear rutinas de estudio efectivas, técnicas de memorización avanzadas y métodos para mantener la motivación a largo plazo.',
        shortDesc: 'Domina las técnicas de estudio más efectivas',
        level: 'beginner',
        category: 'Educación',
        price: 67,
        currency: 'USD',
        status: 'published',
        featured: true,
        duration: 300, // 5 horas
        instructor: 'Dr. Ana Mendoza',
        thumbnail: '/api/placeholder/800/400',
        trailerVideo: 'https://iframe.mediadelivery.net/play/476857/86e279ce-ee92-494d-aaad-47719c3b86fe',
        modules: {
          create: [
            {
              title: 'Fundamentos del Estudio Efectivo',
              description: 'Bases científicas y principios fundamentales para un estudio exitoso',
              position: 1,
              duration: 60,
              lessons: {
                create: [
                  {
                    title: 'Introducción a los Hábitos de Estudio',
                    description: 'Por qué los hábitos correctos marcan la diferencia en tu aprendizaje',
                    position: 1,
                    type: 'video',
                    videoDuration: 900, // 15 minutos
                    isPreview: true,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/86e279ce-ee92-494d-aaad-47719c3b86fe',
                    videoId: '86e279ce-ee92-494d-aaad-47719c3b86fe',
                    content: 'En esta primera lección exploraremos la importancia de desarrollar hábitos de estudio sólidos y cómo estos impactan directamente en tu éxito académico y profesional...'
                  }
                ]
              }
            },
            {
              title: 'Técnicas de Memorización',
              description: 'Métodos avanzados para retener información de manera eficiente',
              position: 2,
              duration: 80,
              lessons: {
                create: [
                  {
                    title: 'El Método de los Palacios de Memoria',
                    description: 'Técnica ancestral para recordar grandes cantidades de información',
                    position: 1,
                    type: 'video',
                    videoDuration: 1200, // 20 minutos
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/f88c9edf-3c7a-4186-80c1-88237f32c40b',
                    videoId: 'f88c9edf-3c7a-4186-80c1-88237f32c40b',
                    content: 'Los palacios de memoria son una de las técnicas más poderosas para la memorización. Aprenderás a crear mapas mentales vívidos...'
                  },
                  {
                    title: 'Mapas Mentales y Asociaciones',
                    description: 'Crea conexiones visuales que faciliten el recuerdo',
                    position: 2,
                    type: 'video',
                    videoDuration: 1080, // 18 minutos
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/846aa33a-ae7d-4531-95e1-a5e4c575d289',
                    videoId: '846aa33a-ae7d-4531-95e1-a5e4c575d289',
                    content: 'Los mapas mentales aprovechan la capacidad natural del cerebro para procesar información visual...'
                  }
                ]
              }
            },
            {
              title: 'Organización y Productividad',
              description: 'Sistemas para maximizar tu tiempo de estudio y mantener el enfoque',
              position: 3,
              duration: 90,
              lessons: {
                create: [
                  {
                    title: 'La Técnica Pomodoro para Estudiar',
                    description: 'Gestión del tiempo que mejora concentración y reduce fatiga mental',
                    position: 1,
                    type: 'video',
                    videoDuration: 1320, // 22 minutos
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/3b8eb44e-39a6-480f-b87f-aa96334e4a8f',
                    videoId: '3b8eb44e-39a6-480f-b87f-aa96334e4a8f',
                    content: 'La técnica Pomodoro revoluciona la manera en que gestionas tu tiempo de estudio...'
                  }
                ]
              }
            },
            {
              title: 'Mantenimiento de la Motivación',
              description: 'Estrategias para mantener la constancia y superar obstáculos',
              position: 4,
              duration: 70,
              lessons: {
                create: [
                  {
                    title: 'Construyendo Rutinas Duraderas',
                    description: 'Cómo crear hábitos que se mantengan automáticamente',
                    position: 1,
                    type: 'video',
                    videoDuration: 1500, // 25 minutos
                    isPreview: false,
                    videoUrl: 'https://iframe.mediadelivery.net/play/476857/014a0983-b268-4372-a94d-3699e86ee76c',
                    videoId: '014a0983-b268-4372-a94d-3699e86ee76c',
                    content: 'Las rutinas efectivas se basan en principios psicológicos que facilitan la formación de hábitos automáticos...'
                  }
                ]
              }
            }
          ]
        }
      }
    });

    console.log('✅ Curso "Hábitos de Estudio Efectivos" creado exitosamente!');
    console.log(`📚 ID del curso: ${cursoHabitos.id}`);
    console.log(`🎥 Videos configurados con MediaDelivery (476857)`);
    console.log('');
    console.log('🌐 Curso disponible en:');
    console.log('   📚 /dashboard/cursos');
    console.log('   🎯 /dashboard');

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