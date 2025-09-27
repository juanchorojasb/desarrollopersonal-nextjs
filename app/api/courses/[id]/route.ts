import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { getUserPlan, hasAccess } from '@/lib/plans';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const courseId = params.id;

    if (!courseId || courseId.trim() === '') {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    // Get user from Clerk to check plan
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId);
    const userPlan = getUserPlan(clerkUser);

    // MANEJO ESPECIAL PARA EL CURSO DE TRANSFORMACIÓN DIGITAL
    if (courseId === 'transformacion-digital-2024') {
      const transformacionDigitalCourse = {
        id: "transformacion-digital-2024",
        title: "Transformación Digital para Negocios Locales",
        description: "Aprende las estrategias y herramientas fundamentales para digitalizar tu negocio local y competir en el mercado digital actual. Este curso práctico está diseñado específicamente para emprendedores del Norte de Caldas e incluye casos reales de éxito, herramientas implementables y estrategias probadas en el contexto local.",
        category: "desarrollo-personal",
        level: "intermediate",
        duration: 240,
        instructor: "Experto en Marketing Digital",
        price: 0,
        rating: 4.9,
        reviewsCount: 127,
        studentsCount: 1248,
        whatYouLearn: [
          "Fundamentos sólidos de la transformación digital aplicados a negocios locales",
          "Estrategias de marketing digital efectivas y medibles",
          "Herramientas prácticas para automatizar procesos comerciales",
          "Técnicas avanzadas de análisis de datos y optimización de resultados",
          "Plan de implementación paso a paso personalizado para tu negocio",
          "Casos de éxito reales de emprendimientos del Norte de Caldas"
        ],
        requirements: [
          "Tener un negocio local activo o una idea de emprendimiento clara",
          "Conocimientos básicos de navegación en internet y redes sociales",
          "Acceso a computadora o dispositivo móvil con conexión a internet",
          "Disposición para implementar cambios en tu modelo de negocio",
          "Compromiso de dedicar al menos 2 horas por semana al curso"
        ],
        progressPercentage: 0,
        totalLessons: 4,
        completedLessons: 0,
        isEnrolled: true,
        hasAccess: true,
        userPlan,
        modules: [
          {
            id: "modulo-1",
            title: "Sesión 1 - Introducción a la Transformación Digital",
            description: "Fundamentos y conceptos básicos de la digitalización empresarial",
            position: 1,
            courseId: "transformacion-digital-2024",
            lessons: [{
              id: "sesion-1",
              title: "Fundamentos de la Transformación Digital",
              description: "Conceptos básicos y principios fundamentales para digitalizar tu negocio",
              videoUrl: "https://iframe.mediadelivery.net/play/481547/5bb91813-21a3-428e-ae3a-78a9b03ecf63",
              duration: 3600,
              position: 1,
              moduleId: "modulo-1",
              progress: []
            }]
          },
          {
            id: "modulo-2",
            title: "Sesión 2 - Estrategias Digitales",
            description: "Implementación de herramientas y estrategias digitales efectivas",
            position: 2,
            courseId: "transformacion-digital-2024",
            lessons: [{
              id: "sesion-2",
              title: "Estrategias de Marketing Digital",
              description: "Herramientas prácticas para promocionar tu negocio en línea",
              videoUrl: "https://iframe.mediadelivery.net/play/481547/a4dc968e-4211-40fd-ab28-627ca8dad097",
              duration: 3600,
              position: 1,
              moduleId: "modulo-2",
              progress: []
            }]
          },
          {
            id: "modulo-3",
            title: "Sesión 3 - Optimización y Análisis",
            description: "Métricas, análisis de datos y mejora continua",
            position: 3,
            courseId: "transformacion-digital-2024",
            lessons: [{
              id: "sesion-3",
              title: "Análisis y Optimización Digital",
              description: "Cómo medir y mejorar el rendimiento de tus estrategias digitales",
              videoUrl: "https://iframe.mediadelivery.net/play/481547/844e8b4d-72ba-49d9-9c48-8e1522e7f42e",
              duration: 3600,
              position: 1,
              moduleId: "modulo-3",
              progress: []
            }]
          },
          {
            id: "modulo-4",
            title: "Sesión 4 - Integración y Casos Prácticos",
            description: "Implementación práctica y casos de éxito reales",
            position: 4,
            courseId: "transformacion-digital-2024",
            lessons: [{
              id: "sesion-4",
              title: "Casos Prácticos y Implementación",
              description: "Aplicación práctica de todos los conceptos aprendidos con casos reales",
              videoUrl: "", // Próximamente disponible
              duration: 3600,
              position: 1,
              moduleId: "modulo-4",
              progress: []
            }]
          }
        ]
      };

      return NextResponse.json(transformacionDigitalCourse);
    }

    // LÓGICA ORIGINAL PARA OTROS CURSOS DE LA BASE DE DATOS
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        imageUrl: clerkUser.imageUrl || undefined,
      }
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId: user.id }
                }
              }
            }
          },
          orderBy: { position: 'asc' }
        },
        enrollments: {
          where: { userId: user.id }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const hasAccessToCourse = hasAccess(userPlan, 'basic');
    const isEnrolled = course.enrollments.length > 0;

    if (!hasAccessToCourse) {
      return NextResponse.json({
        error: 'Tu plan actual no incluye acceso a cursos',
        userPlan,
        requiredPlan: 'basic'
      }, { status: 403 });
    }

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) =>
      acc + module.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].isCompleted).length, 0
    );

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const courseWithProgress = {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      instructor: course.instructor,
      price: course.price,
      rating: 4.5,
      reviewsCount: 12,
      studentsCount: course.studentsCount,
      whatYouLearn: [
        "Desarrollar técnicas de estudio efectivas y científicamente probadas",
        "Crear rutinas de estudio que maximicen tu retención y comprensión",
        "Dominar métodos avanzados de memorización y asociación",
        "Gestionar tu tiempo de estudio de manera productiva",
        "Mantener la motivación y consistencia en tu aprendizaje"
      ],
      requirements: [
        "Dispositivo con acceso a internet",
        "Compromiso con la práctica de las técnicas enseñadas",
        "Dedicación de al menos 30 minutos diarios al estudio"
      ],
      progressPercentage,
      totalLessons,
      completedLessons,
      isEnrolled,
      hasAccess: hasAccessToCourse,
      userPlan,
      modules: course.modules
    };

    return NextResponse.json(courseWithProgress);

  } catch (error) {
    console.error('Error getting course:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
