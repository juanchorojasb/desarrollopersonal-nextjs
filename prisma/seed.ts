// prisma/seed.ts - VERSIÓN FINAL CORREGIDA
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCursoTormentaInterior() {
  console.log('🚀 Iniciando seed del curso "Navegando la Tormenta Interior"...');

  try {
    // Verificar si ya existe un curso con este título
    const existeCurso = await prisma.course.findFirst({
      where: { title: 'Navegando la Tormenta Interior: Un Camino hacia la Vida' }
    });

    if (existeCurso) {
      console.log('⚠️  El curso ya existe, saltando creación...');
      return existeCurso;
    }

    // 1. CREAR EL CURSO PRINCIPAL
    const curso = await prisma.course.create({
      data: {
        title: 'Navegando la Tormenta Interior: Un Camino hacia la Vida',
        description: 'Un programa integral diseñado para ayudarte a gestionar crisis emocionales, encontrar estabilidad interior y desarrollar herramientas para navegar los momentos más difíciles de la vida. A través de sesiones profundas y prácticas, aprenderás a transformar el caos interior en crecimiento personal.',
        shortDesc: 'Gestiona crisis emocionales y encuentra estabilidad interior con herramientas prácticas y efectivas.',
        thumbnail: 'https://desarrollopersonaluno.b-cdn.net/thumbnails/tormenta-interior-thumb.jpg',
        level: 'intermediate', // beginner, intermediate, advanced
        category: 'bienestar-emocional',
        tags: JSON.stringify([
          'crisis-emocional', 
          'resiliencia', 
          'mindfulness', 
          'autoregulacion',
          'transformacion',
          'bienestar'
        ]),
        price: 25000.0,
        currency: 'COP',
        status: 'published',
        featured: true,
        duration: 260, // Total: ~4.3 horas en minutos
        studentsCount: 0,
        instructor: 'Equipo DesarrolloPersonal.uno',
      }
    });

    console.log('✅ Curso creado:', curso.title);
    console.log('🆔 ID del curso:', curso.id);

    // 2. CREAR MÓDULO PRINCIPAL
    const modulo = await prisma.module.create({
      data: {
        title: 'Navegando la Tormenta Interior - Sesiones Completas',
        description: 'Serie completa de 5 sesiones para gestionar crisis emocionales y encontrar estabilidad interior.',
        position: 1,
        isRequired: true,
        duration: 260, // Total en minutos
        courseId: curso.id,
      }
    });

    console.log('✅ Módulo creado:', modulo.title);

    // 3. CREAR LAS LECCIONES
    const lecciones = [
      {
        title: 'Sesión Uno: Reconociendo la Tormenta Interior',
        description: 'En esta primera sesión aprenderás a identificar las señales de crisis emocional y entender los patrones que generan turbulencia interior.',
        content: `Esta sesión introductoria te ayudará a:

• Identificar los tipos de tormentas emocionales
• Reconocer los triggers personales
• Entender la diferencia entre crisis temporal y crisis profunda
• Desarrollar autoconciencia emocional
• Establecer bases para el trabajo interior

Al finalizar esta sesión tendrás una comprensión clara de tu paisaje emocional interior y las herramientas básicas para navegar momentos difíciles.`,
        position: 1,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/tormenta-interior/sesion-1-reconociendo-tormenta.mp4',
        videoDuration: 3300, // 55 minutos en segundos
        isPreview: true, // Gratis como preview
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión Dos: Herramientas de Estabilización Inmediata',
        description: 'Aprende técnicas prácticas para encontrar calma en medio del caos emocional y estabilizar tu estado interior.',
        content: `En esta sesión desarrollarás:

• Técnicas de respiración para crisis
• Mindfulness en momentos difíciles
• Grounding y anclaje emocional
• Estrategias de autoregulación
• Protocolo de emergencia emocional

Estas herramientas te permitirán mantener estabilidad emocional incluso en los momentos más desafiantes.`,
        position: 2,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/tormenta-interior/sesion-2-herramientas-estabilizacion.mp4',
        videoDuration: 3000, // 50 minutos
        isPreview: false, // Requiere suscripción
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión Tres: Navegando la Crisis con Propósito',
        description: 'La sesión central del programa donde aprenderás a usar la crisis como catalizador de crecimiento y transformación personal.',
        content: `Esta sesión profunda incluye:

• Reframear la crisis como oportunidad
• Encontrar significado en el sufrimiento
• Desarrollar resiliencia emocional
• Técnicas de navegación en turbulencia
• Mantener la esperanza en momentos oscuros

Aprenderás a transformar el dolor en sabiduría y la crisis en crecimiento personal.`,
        position: 3,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/_Navegando%20la%20Tormenta%20Interior_%20Un%20Camino%20hacia%20la%20Vida_%20Sesi%C3%B3n%20Tres%20-%202025_06_12%2012_18%20GMT-05_00%20-%20Recording.mp4',
        videoDuration: 3600, // 60 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión Cuatro: Construyendo Nuevos Cimientos',
        description: 'Aprende a establecer bases sólidas para una vida emocional más estable y consciente después de la tormenta.',
        content: `En esta sesión construirás:

• Nuevos patrones de pensamiento
• Hábitos de bienestar emocional
• Sistemas de apoyo personal
• Rituales de autocuidado
• Plan de mantenimiento a largo plazo

Establecerás fundamentos sólidos para una vida emocional más equilibrada y resiliente.`,
        position: 4,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/tormenta-interior/sesion-4-nuevos-cimientos.mp4',
        videoDuration: 2700, // 45 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión Cinco: Integración y Crecimiento Continuo',
        description: 'La sesión final donde integrarás todo lo aprendido y crearás un plan personalizado para el crecimiento continuo.',
        content: `Esta sesión de cierre incluye:

• Integración de herramientas aprendidas
• Creación de plan personalizado
• Estrategias de prevención de recaídas
• Visión a futuro y metas
• Celebración del progreso logrado

Terminarás con un plan claro y personalizado para continuar tu crecimiento emocional.`,
        position: 5,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/tormenta-interior/sesion-5-integracion-crecimiento.mp4',
        videoDuration: 3000, // 50 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      }
    ];

    // Crear todas las lecciones
    console.log('📚 Creando lecciones...');
    const leccionesCreadas = [];
    
    for (const leccionData of lecciones) {
      const leccion = await prisma.lesson.create({
        data: leccionData
      });
      leccionesCreadas.push(leccion);
      console.log(`✅ Lección ${leccion.position}: ${leccion.title}`);
    }

    // 4. Verificar estructura completa
    const cursoCompleto = await prisma.course.findUnique({
      where: { id: curso.id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    console.log('🎯 CURSO CREADO EXITOSAMENTE:');
    console.log(`📖 Título: ${cursoCompleto?.title}`);
    console.log(`💰 Precio: $${cursoCompleto?.price.toLocaleString()} ${cursoCompleto?.currency}`);
    console.log(`📚 Módulos: ${cursoCompleto?.modules.length}`);
    console.log(`🎬 Lecciones: ${cursoCompleto?.modules[0]?.lessons.length}`);
    console.log(`🆓 Lección gratuita: ${cursoCompleto?.modules[0]?.lessons.find(l => l.isPreview)?.title}`);
    console.log(`⏱️  Duración total: ${Math.floor((cursoCompleto?.duration || 0) / 60)} horas ${(cursoCompleto?.duration || 0) % 60} minutos`);
    
    return cursoCompleto;

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');
  
  await seedCursoTormentaInterior();
  
  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en main seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;
