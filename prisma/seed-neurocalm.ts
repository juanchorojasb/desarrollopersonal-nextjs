// prisma/seed-neurocalm.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNeuroCalm() {  
  console.log('🧘 Iniciando seed del curso "NeuroCalm: Mente en Equilibrio"...');

  try {
    // Verificar si ya existe
    const existeCurso = await prisma.course.findFirst({
      where: { title: 'NeuroCalm: Mente en Equilibrio' }
    });

    if (existeCurso) {
      console.log('⚠️  El curso ya existe, saltando creación...');
      return existeCurso;
    }

    // 1. CREAR EL CURSO PRINCIPAL
    const curso = await prisma.course.create({
      data: {
        title: 'NeuroCalm: Mente en Equilibrio',
        description: 'Entrena tu cerebro para la calma usando neurociencia aplicada. Aprende técnicas científicamente respaldadas para regular tu sistema nervioso, reducir ansiedad y crear estados de calma profunda a voluntad. Un programa intensivo para dominar tu bienestar mental.',
        shortDesc: 'Neurociencia aplicada para entrenar tu cerebro hacia la calma y el equilibrio interior.',
        thumbnail: 'https://desarrollopersonaluno.b-cdn.net/thumbnails/neurocalm-thumb.jpg',
        level: 'intermediate',
        category: 'neurociencia-aplicada',
        tags: JSON.stringify([
          'neurociencia', 
          'ansiedad', 
          'calma',
          'sistema-nervioso',
          'mindfulness',
          'regulación-emocional'
        ]),
        price: 30000.0,
        currency: 'COP',
        status: 'published',
        featured: true,
        duration: 495, // 8h 15m en minutos
        studentsCount: 0,
        instructor: 'Equipo DesarrolloPersonal.uno',
      }
    });

    // 2. CREAR MÓDULO PRINCIPAL
    const modulo = await prisma.module.create({
      data: {
        title: 'NeuroCalm - Entrenamiento Completo',
        description: 'Programa completo de 10 sesiones para entrenar tu cerebro hacia la calma usando los últimos avances en neurociencia.',
        position: 1,
        isRequired: true,
        duration: 495,
        courseId: curso.id,
      }
    });

    // 3. CREAR LAS LECCIONES
    const lecciones = [
      {
        title: 'Sesión 1: Fundamentos de la Neuroplasticidad',
        description: 'Comprende cómo tu cerebro puede cambiar y adaptarse para crear estados de calma duraderos.',
        content: `Descubre el poder de tu cerebro adaptable:

- Qué es la neuroplasticidad y cómo funciona
- Por qué tu cerebro se queda "pegado" en patrones de estrés
- Los períodos críticos vs plasticidad de toda la vida
- Cómo crear nuevos circuitos neuronales de calma
- El protocolo básico de entrenamiento neural

"Tu cerebro no está destinado a estar ansioso. Está diseñado para adaptarse, y tú puedes dirigir esa adaptación."`,
        position: 1,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-1-neuroplasticidad.mp4',
        videoDuration: 2700, // 45 minutos
        isPreview: true, // Primera sesión gratuita
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 2: Sistema Nervioso y Estados de Calma',
        description: 'Domina tu sistema nervioso autónomo para activar estados de calma a voluntad.',
        content: `Toma control de tu sistema nervioso:

- Sistema simpático vs parasimpático: la clave del equilibrio
- Cómo identificar tu estado nervioso actual
- Técnicas para activar la respuesta de relajación
- El nervio vago: tu autopista hacia la calma
- Ejercicios de activación parasimpática`,
        position: 2,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-2-sistema-nervioso.mp4',
        videoDuration: 3000, // 50 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 3: Respiración Consciente Avanzada',
        description: 'Domina técnicas de respiración que pueden cambiar tu estado mental en minutos.',
        content: `El poder transformador de la respiración:

- Respiración 4-7-8 para calma instantánea
- Respiración de coherencia cardíaca
- Técnica de respiración alterna (Nadi Shodhana)
- Respiración diafragmática profunda
- Creando tu protocolo personal de respiración`,
        position: 3,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-3-respiracion-avanzada.mp4',
        videoDuration: 2800, // 47 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 4: Mindfulness Neurocientífico',
        description: 'Aprende mindfulness basado en neurociencia para cambios cerebrales medibles.',
        content: `Mindfulness que transforma tu cerebro:

- Cómo el mindfulness cambia la estructura cerebral
- Técnicas específicas para engrosar la corteza prefrontal
- Meditación de atención focalizada vs atención abierta
- Mindfulness en actividades diarias
- Protocolos de práctica para cambios neurológicos`,
        position: 4,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-4-mindfulness-neurocientifico.mp4',
        videoDuration: 3300, // 55 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 5: Visualización Reparadora',
        description: 'Use el poder de la imaginación para reprogramar patrones neurológicos de estrés.',
        content: `Reprograma tu cerebro con visualización:

- Cómo la visualización cambia la actividad cerebral
- Técnica del lugar seguro interior
- Visualización de coherencia energética
- Reprogramación de memorias estresantes
- Creando tu santuario mental personalizado`,
        position: 5,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-5-visualizacion-reparadora.mp4',
        videoDuration: 2900, // 48 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 6: Técnicas de Grounding Neurocientífico',
        description: 'Usa técnicas de anclaje basadas en neurociencia para mantener calma en crisis.',
        content: `Anclaje profundo para calma estable:

- 5-4-3-2-1: La técnica sensorial completa
- Grounding corporal y conexión neurológica
- Anclaje emocional para momentos de crisis
- Técnicas de presente radical
- Protocolo de emergencia para ataques de pánico`,
        position: 6,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-6-grounding-neurocientifico.mp4',
        videoDuration: 3100, // 52 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 7: Entrenamiento de Ondas Cerebrales',
        description: 'Aprende a influir conscientemente en tus ondas cerebrales para estados de calma profunda.',
        content: `Domina tus ondas cerebrales:

- Alpha, Beta, Theta, Delta: qué significan y cómo usarlas
- Técnicas para generar ondas Alpha (calma alerta)
- Acceso a estados Theta (creatividad y sanación)
- Binaural beats y entraînment neurológico
- Creando tu protocolo de estados cerebrales`,
        position: 7,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-7-ondas-cerebrales.mp4',
        videoDuration: 3200, // 53 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 8: Neurofeedback Mental',
        description: 'Técnicas avanzadas para monitorear y ajustar tu estado mental en tiempo real.',
        content: `Monitoreo y ajuste mental avanzado:

- Biofeedback casero: señales que puedes monitorear
- Técnicas de automonitoreo del estado nervioso
- Ajustes en tiempo real de tu estado mental
- Creando bucles de retroalimentación positiva
- Desarrollo de intuición neurocientífica`,
        position: 8,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-8-neurofeedback.mp4',
        videoDuration: 2700, // 45 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 9: Protocolo Personal de Calma',
        description: 'Diseña tu protocolo personalizado de calma basado en tu perfil neurológico único.',
        content: `Tu protocolo personalizado de calma:

- Identificando tu perfil de estrés personal
- Técnicas más efectivas para tu tipo neurológico
- Creando secuencias de calma para diferentes situaciones
- Protocolo matutino de regulación neurológica
- Plan de mantenimiento de largo plazo`,
        position: 9,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-9-protocolo-personal.mp4',
        videoDuration: 3000, // 50 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 10: Integración y Dominio Avanzado',
        description: 'Integra todo lo aprendido y desarrolla maestría en el control de tu estado mental.',
        content: `Maestría en NeuroCalm:

- Revisión de todas las técnicas aprendidas
- Integración en un sistema coherente personal
- Técnicas avanzadas de regulación neurológica
- Plan de práctica para dominio a largo plazo
- Próximos pasos en neurociencia aplicada
- Celebración de tu nueva capacidad de calma`,
        position: 10,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/neurocalm/sesion-10-integracion-maestria.mp4',
        videoDuration: 3300, // 55 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      }
    ];

    // Crear todas las lecciones
    console.log('📚 Creando lecciones...');
    for (const leccionData of lecciones) {
      const leccion = await prisma.lesson.create({
        data: leccionData
      });
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

    console.log('🎯 CURSO "NEUROCALM" CREADO EXITOSAMENTE:');
    console.log(`📖 Título: ${cursoCompleto?.title}`);
    console.log(`💰 Precio: $${cursoCompleto?.price.toLocaleString()} ${cursoCompleto?.currency}`);
    console.log(`🎬 Lecciones: ${cursoCompleto?.modules[0]?.lessons.length}`);
    console.log(`🆓 Lección gratuita: ${cursoCompleto?.modules[0]?.lessons.find(l => l.isPreview)?.title}`);
    console.log(`⏱️  Duración total: ${Math.floor((cursoCompleto?.duration || 0) / 60)} horas ${(cursoCompleto?.duration || 0) % 60} minutos`);
    
    return cursoCompleto;

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

// Función principal
async function main() {
  console.log('🌱 Iniciando seed de "NeuroCalm"...');
  await seedNeuroCalm();
  console.log('✅ Seed de "NeuroCalm" completado exitosamente');
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedNeuroCalm;
