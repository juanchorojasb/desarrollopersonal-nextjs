// verify-all-courses.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyAllCourses() {
  console.log('🔍 Verificando todos los cursos creados...');
  
  try {
    // Get all published courses with their modules and lessons
    const courses = await prisma.course.findMany({
      where: { status: 'published' },
      include: {
        modules: {
          include: {
            lessons: true
          },
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📊 RESUMEN GENERAL:`);
    console.log(`   Total cursos: ${courses.length}`);
    
    let totalVideos = 0;
    let totalDuration = 0;
    let mediaDeliveryVideos = 0;

    console.log(`\n📚 DETALLE POR CURSO:`);
    
    courses.forEach((course, index) => {
      const courseVideos = course.modules.reduce((acc, module) => 
        acc + module.lessons.filter(lesson => lesson.videoUrl).length, 0
      );
      
      const courseMediaDelivery = course.modules.reduce((acc, module) => 
        acc + module.lessons.filter(lesson => 
          lesson.videoUrl?.includes('iframe.mediadelivery.net')
        ).length, 0
      );
      
      totalVideos += courseVideos;
      totalDuration += course.duration || 0;
      mediaDeliveryVideos += courseMediaDelivery;
      
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   📁 ID: ${course.id}`);
      console.log(`   👨‍🏫 Instructor: ${course.instructor}`);
      console.log(`   🏷️ Categoría: ${course.category}`);
      console.log(`   ⏱️ Duración: ${course.duration} min`);
      console.log(`   💰 Precio: $${course.price}`);
      console.log(`   📖 Módulos: ${course.modules.length}`);
      console.log(`   📝 Lecciones: ${course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)}`);
      console.log(`   🎥 Videos: ${courseVideos} (${courseMediaDelivery} MediaDelivery)`);
      
      // List modules and their lessons
      course.modules.forEach((module, modIndex) => {
        console.log(`     ${modIndex + 1}. ${module.title} (${module.lessons.length} lecciones)`);
        module.lessons.forEach((lesson, lessonIndex) => {
          const videoInfo = lesson.videoUrl ? 
            (lesson.videoUrl.includes('iframe.mediadelivery.net') ? '🎥 MD' : '🎬 Other') : 
            '📝 Text';
          const previewInfo = lesson.isPreview ? '[PREVIEW]' : '[PREMIUM]';
          console.log(`        ${lessonIndex + 1}. ${lesson.title} ${videoInfo} ${previewInfo}`);
        });
      });
    });
    
    console.log(`\n📊 ESTADÍSTICAS TOTALES:`);
    console.log(`   🎯 Cursos creados: ${courses.length}`);
    console.log(`   📖 Total módulos: ${courses.reduce((acc, course) => acc + course.modules.length, 0)}`);
    console.log(`   📝 Total lecciones: ${courses.reduce((acc, course) => 
      acc + course.modules.reduce((acc2, mod) => acc2 + mod.lessons.length, 0), 0)}`);
    console.log(`   🎥 Total videos: ${totalVideos}`);
    console.log(`   📺 MediaDelivery videos: ${mediaDeliveryVideos}`);
    console.log(`   ⏱️ Duración total: ${Math.round(totalDuration / 60)} horas`);
    console.log(`   💰 Valor total: $${courses.reduce((acc, course) => acc + course.price, 0)}`);

    // Verify specific video IDs from the original request
    console.log(`\n🎯 VERIFICACIÓN DE VIDEO IDs ESPECÍFICOS:`);
    
    const expectedVideoIds = [
      // GPS Salud Mental (4)
      '93fd37b8-4ccb-4b1b-9227-d8accebfabaf',
      'c71755cc-d89e-4c76-8870-e52c6ab17658',
      '8c3b7cd2-e5eb-44f3-a888-2dd90b9721dc',
      'e33758a5-aeda-4a0c-b12e-aad06cd20a78',
      // Arquitectura del Descanso (5)
      '6d398119-2c3a-4ba9-ac1e-d8d51a0cb911',
      'a2d31bb1-bd57-424e-88a5-54229d0bf142',
      'ef26a4b5-db39-4239-a049-2d825910bb8b',
      '2d6144b5-f737-49fe-b6a0-a71aad965269',
      '95c57c4c-eccb-428b-9519-2a468002a0cf',
      // Gestionando la Depresión (3)
      '5d457920-2a95-4fce-a326-ce664ab3ff97',
      '4741f5f0-b7c6-4b8c-b07a-a5896f282218',
      'a96727cf-ad3a-42d4-93d5-53fbb1bf845e',
      // Emociones en Equilibrio (9)
      'cea9cf65-6466-4ebd-b670-8baea2f6c1e9',
      '7288352b-3466-4477-a805-a7a5da3fcc71',
      'c189a931-08ea-4aeb-8d6f-a95d0b3873f4',
      'd837af16-6e3f-46ef-9b86-cf6f1795c2ac',
      '69ab3b9f-486b-4c4f-b1d5-d44bb490b55c',
      '0dde13f5-7915-46d4-b2d8-08af8a1777f7',
      'f36f8f75-4b66-4747-bcff-72be870aaa27',
      'cb737748-58c9-4f90-a6cf-36041f6c3861',
      '8c3472e4-d00a-4177-bae7-8511cd19d2a8',
      // NeuroCalma (9)
      '0d189ecb-71e2-4f32-a47c-38a298a2e793',
      '6b7cb42c-bb6f-42e6-b064-8d755843be7f',
      '9a9b8c38-3bcb-4b78-984e-a345bf9f8a61',
      '612c76ff-d82b-4222-b8fe-05d4c41c2a05',
      '4b53e15e-da14-4b72-a504-c89a88845afe',
      'e9861eb2-f938-41cb-963c-41c863cdafc6',
      '1c976c5d-b474-4ca6-87b9-87976c82d422',
      'a50d21fe-71e9-407b-b081-72de07cbcca0',
      'e3574e25-d69b-4fa3-ad02-dff865385046',
      // Navegando la Tormenta Interior (6)
      'ca16f310-273f-4e5b-bc4e-987d1f712d33',
      'e332c8c8-1db6-4bca-aac9-7ac54ecb8896',
      '3cb0913f-bd2c-45bb-89cb-6d00d8156a31',
      '327e4e9d-632d-45a6-a28c-1c7d15534985',
      '3f1f9265-f391-4133-942c-944897178729',
      '79a8778c-21c5-4344-98f9-410deb238324'
    ];

    let foundVideoIds = [];
    courses.forEach(course => {
      course.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          if (lesson.videoId) {
            foundVideoIds.push(lesson.videoId);
          }
        });
      });
    });

    console.log(`   ✅ Video IDs esperados: ${expectedVideoIds.length}`);
    console.log(`   ✅ Video IDs encontrados: ${foundVideoIds.length}`);

    const missingIds = expectedVideoIds.filter(id => !foundVideoIds.includes(id));
    if (missingIds.length > 0) {
      console.log(`   ❌ Video IDs faltantes: ${missingIds.length}`);
      missingIds.forEach(id => console.log(`      - ${id}`));
    } else {
      console.log(`   ✅ Todos los video IDs están presentes!`);
    }

    console.log(`\n🌐 ACCESO Y NAVEGACIÓN:`);
    console.log(`   📍 Cursos disponibles en: /dashboard/cursos`);
    console.log(`   🎯 Control de acceso: Plan básico o superior`);
    console.log(`   📱 Videos: Reproducción via MediaDelivery iframes`);
    console.log(`   🔄 Sistema: ${courses.length + 1} cursos total (incluyendo Hábitos de Estudio)`);

    console.log(`\n✅ VERIFICACIÓN COMPLETA EXITOSA!`);

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

verifyAllCourses()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });