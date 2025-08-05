   // prisma/seed-transformando-emociones.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTransformandoEmociones() {
  console.log('🎭 Iniciando seed del curso "Transformando tus Emociones"...');

  try {
    // Verificar si ya existe
    const existeCurso = await prisma.course.findFirst({
      where: { title: 'Transformando tus Emociones: De la Autocrítica a la Autocompasión' }
    });

    if (existeCurso) {
      console.log('⚠️  El curso ya existe, saltando creación...');
      return existeCurso;
    }

    // 1. CREAR EL CURSO PRINCIPAL
    const curso = await prisma.course.create({
      data: {
        title: 'Transformando tus Emociones: De la Autocrítica a la Autocompasión',
        description: 'Un viaje transformador para aprender a gestionar tus emociones desde la neurociencia y la compasión. Descubre cómo cambiar esa voz interior crítica por una voz cuidadora que te impulse hacia el crecimiento. Perfecto para quienes buscan desarrollar inteligencia emocional y bienestar interior.',
        shortDesc: 'Aprende a transformar la autocrítica en autocompasión genuina y desarrolla una relación saludable con tus emociones.',
        thumbnail: 'https://desarrollopersonaluno.b-cdn.net/thumbnails/transformando-emociones-thumb.jpg',
        level: 'beginner',
        category: 'inteligencia-emocional',
        tags: JSON.stringify([
          'autocrítica', 
          'autocompasión', 
          'inteligencia-emocional',
          'gestión-emocional',
          'neurociencia',
          'bienestar'
        ]),
        price: 20000.0,
        currency: 'COP',
        status: 'published',
        featured: true,
        duration: 390, // 6h 30m en minutos
        studentsCount: 0,
        instructor: 'Equipo DesarrolloPersonal.uno',
      }
    });

    console.log('✅ Curso creado:', curso.title);

    // 2. CREAR MÓDULO PRINCIPAL
    const modulo = await prisma.module.create({
      data: {
        title: 'Transformando tus Emociones - Programa Completo',
        description: 'Serie completa de 8 sesiones para transformar tu relación con las emociones, desde la autocrítica destructiva hacia la autocompasión genuina.',
        position: 1,
        isRequired: true,
        duration: 390,
        courseId: curso.id,
      }
    });

    console.log('✅ Módulo creado:', modulo.title);

    // 3. CREAR LAS LECCIONES
    const lecciones = [
      {
        title: 'Sesión 1: Reconociendo tus Emociones',
        description: 'Aprende a identificar y nombrar tus emociones sin juzgarlas. El primer paso hacia la transformación emocional.',
        content: `En esta sesión de bienvenida aprenderás:

- Qué son realmente las emociones y por qué las experimentamos
- La diferencia entre emociones, sentimientos y estados de ánimo
- Cómo identificar tus patrones emocionales automáticos
- El poder de nombrar lo que sientes sin juzgarlo
- Ejercicio práctico: El mapa de tus emociones diarias

"No somos nuestras emociones, somos quienes las experimentamos. Esta distinción fundamental te dará el poder de observar sin ser arrastrado."

Al finalizar esta sesión tendrás claridad sobre tu paisaje emocional actual y las herramientas básicas para la autoobservación compasiva.`,
        position: 1,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-1-reconociendo-emociones.mp4',
        videoDuration: 2700, // 45 minutos
        isPreview: true, // Primera sesión gratuita
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 2: La Neurociencia de las Emociones',
        description: 'Comprende qué sucede en tu cerebro cuando experimentas emociones y cómo puedes influir en estos procesos.',
        content: `Descubre el fascinante mundo de la neurociencia emocional:

- Cómo se forman las emociones en tu cerebro
- El papel de la amígdala, corteza prefrontal y sistema límbico
- Por qué algunas emociones parecen "secuestrarnos"
- La neuroplasticidad: tu cerebro puede cambiar a cualquier edad
- Técnicas científicas para regular emociones en tiempo real

"Tu cerebro no distingue entre una amenaza real y una amenaza imaginada. Comprender esto te da el poder de intervenir en tus respuestas emocionales."

Aprenderás a usar la ciencia como herramienta de transformación personal.`,
        position: 2,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-2-neurociencia-emociones.mp4',
        videoDuration: 3000, // 50 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 3: La Voz Interior que Hiere',
        description: 'Identifica esa voz crítica interna que sabotea tu bienestar y aprende cómo se formó.',
        content: `Exploremos esa voz interior destructiva:

- Cómo se forma la voz crítica en la infancia y adolescencia
- Los diferentes tipos de autocrítica y sus patrones
- Por qué la autocrítica se vuelve adictiva para el cerebro
- El costo emocional y físico de la autocrítica constante
- Ejercicio: Dialogando con tu crítico interno

"Esa voz que te dice 'no sirves para nada' no es tu verdadera voz. Es una voz aprendida que puede ser transformada."

Esta sesión es fundamental para comenzar a separarte de los pensamientos destructivos automáticos.`,
        position: 3,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-3-voz-interior-hiere.mp4',
        videoDuration: 2800, // 47 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 4: Cultivando la Autocompasión',
        description: 'Aprende a desarrollar una voz interior compasiva que te cuide y te impulse hacia el crecimiento.',
        content: `Transforma tu diálogo interno:

- Qué es la autocompasión y qué NO es (no es autocompasión vs autoestima)
- Los tres componentes de la autocompasión según Kristin Neff
- Cómo hablarte como le hablarías a un ser querido
- Ejercicios prácticos de autocompasión
- La carta de autocompasión: escribiéndote con amor

"La autocompasión no es debilidad, es la fortaleza de tratarte con la misma bondad que mereces."

Desarrollarás una nueva forma de relacionarte contigo mismo que nutre en lugar de destruir.`,
        position: 4,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-4-cultivando-autocompasion.mp4',
        videoDuration: 3300, // 55 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 5: Técnicas de Regulación Emocional',
        description: 'Herramientas prácticas para gestionar emociones intensas en tiempo real.',
        content: `Domina las técnicas más efectivas:

- Respiración consciente para calmar el sistema nervioso
- Técnica STOP: Detener patrones emocionales destructivos
- Visualización reparadora para emociones difíciles
- Mindfulness emocional: observar sin ser arrastrado
- Creando tu kit de emergencia emocional personalizado

"No se trata de no sentir emociones difíciles, se trata de no ser prisionero de ellas."

Tendrás un arsenal de herramientas para cualquier tormenta emocional.`,
        position: 5,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-5-tecnicas-regulacion.mp4',
        videoDuration: 2900, // 48 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 6: Emociones Difíciles como Maestras',
        description: 'Transforma tu relación con emociones como la tristeza, ira y miedo, viendo su propósito evolutivo.',
        content: `Redefine tu relación con emociones difíciles:

- El propósito evolutivo de cada emoción "negativa"
- Tristeza: La emoción de conexión y procesamiento
- Ira: Energía de cambio y establecimiento de límites
- Miedo: Protección y preparación para desafíos
- Ansiedad: Señal de valores importantes en riesgo
- Práctica: Escuchando el mensaje de tus emociones

"Cada emoción difícil lleva un mensaje importante. Cuando aprendemos a escuchar, dejamos de luchar y comenzamos a crecer."

Transformarás emociones que antes evitabas en maestras de vida.`,
        position: 6,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-6-emociones-maestras.mp4',
        videoDuration: 3100, // 52 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 7: Construyendo Inteligencia Emocional',
        description: 'Desarrolla las cuatro competencias clave de la inteligencia emocional para una vida más plena.',
        content: `Desarrolla las competencias emocionales esenciales:

- Autoconciencia emocional: Conocerte profundamente
- Autorregulación: Gestionar tus respuestas emocionales
- Empatía: Conectar genuinamente con otros
- Habilidades sociales: Navegar relaciones con sabiduría emocional
- Creando tu plan personal de desarrollo emocional

"La inteligencia emocional no es un regalo, es una habilidad que se desarrolla con práctica consciente."

Integrarás todo lo aprendido en un sistema coherente de crecimiento emocional.`,
        position: 7,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-7-inteligencia-emocional.mp4',
        videoDuration: 3200, // 53 minutos
        isPreview: false,
        isRequired: true,
        moduleId: modulo.id,
      },
      {
        title: 'Sesión 8: Integración y Mantenimiento',
        description: 'Integra todo lo aprendido y crea un plan de mantenimiento para sostener tu transformación emocional.',
        content: `Cierre poderoso de tu transformación:

- Revisión de tu viaje de transformación emocional
- Creando rituales diarios de bienestar emocional
- Plan de mantenimiento a largo plazo
- Identificando y previniendo recaídas en autocrítica
- Celebrando tu nueva relación contigo mismo
- Próximos pasos en tu crecimiento personal

"La transformación no es un destino, es un camino. Has aprendido a caminar con compasión."

Tendrás un plan claro para mantener y profundizar tu crecimiento emocional.`,
        position: 8,
        type: 'video',
        videoUrl: 'https://desarrollopersonaluno.b-cdn.net/cursos/transformando-emociones/sesion-8-integracion.mp4',
        videoDuration: 2800, // 47 minutos
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

    console.log('🎯 CURSO "TRANSFORMANDO TUS EMOCIONES" CREADO EXITOSAMENTE:');
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

// Función principal para ejecutar
async function main() {
  console.log('🌱 Iniciando seed de "Transformando tus Emociones"...');
  
  await seedTransformandoEmociones();
  
  console.log('✅ Seed de "Transformando tus Emociones" completado exitosamente');
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Error en main seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedTransformandoEmociones;
