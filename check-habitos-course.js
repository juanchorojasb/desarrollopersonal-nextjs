// check-habitos-course.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHabitosCourse() {
  console.log('🔍 Verificando curso actual: Hábitos de Estudio Efectivos...');
  
  try {
    const course = await prisma.course.findUnique({
      where: { id: '8ef86e1b-3c10-4131-a89d-baae3804d3ec' },
      include: {
        modules: {
          include: {
            lessons: true
          },
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log('✅ Curso encontrado:', course.title);
    console.log('📚 ID:', course.id);
    console.log('👨‍🏫 Instructor:', course.instructor);
    
    console.log('\n📖 Módulos y lecciones actuales:');
    course.modules.forEach((module, moduleIndex) => {
      console.log(`  ${moduleIndex + 1}. ${module.title} (${module.lessons.length} lecciones)`);
      module.lessons.forEach((lesson, lessonIndex) => {
        console.log(`     ${lessonIndex + 1}. ${lesson.title}`);
        console.log(`        Video URL: ${lesson.videoUrl || 'NO URL'}`);
        console.log(`        Video ID: ${lesson.videoId || 'NO ID'}`);
        console.log(`        Es preview: ${lesson.isPreview}`);
      });
    });

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const lessonsWithVideo = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.videoUrl).length, 0
    );

    console.log(`\n📊 Estadísticas actuales:`);
    console.log(`   Total lecciones: ${totalLessons}`);
    console.log(`   Lecciones con video: ${lessonsWithVideo}`);
    
    // Verificar los IDs específicos que deberían estar
    const expectedVideoIds = [
      '86e279ce-ee92-494d-aaad-47719c3b86fe',
      'f88c9edf-3c7a-4186-80c1-88237f32c40b',
      '846aa33a-ae7d-4531-95e1-a5e4c575d289',
      '3b8eb44e-39a6-480f-b87f-aa96334e4a8f',
      '014a0983-b268-4372-a94d-3699e86ee76c'
    ];

    const currentVideoIds = [];
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (lesson.videoId) {
          currentVideoIds.push(lesson.videoId);
        }
      });
    });

    console.log(`\n🎯 Verificación de video IDs:`);
    console.log(`   IDs esperados: ${expectedVideoIds.length}`);
    console.log(`   IDs actuales: ${currentVideoIds.length}`);
    
    expectedVideoIds.forEach((expectedId, index) => {
      const found = currentVideoIds.includes(expectedId);
      console.log(`   ${index + 1}. ${expectedId} ${found ? '✅' : '❌'}`);
    });

    const missingIds = expectedVideoIds.filter(id => !currentVideoIds.includes(id));
    if (missingIds.length > 0) {
      console.log(`\n❌ IDs faltantes: ${missingIds.length}`);
      missingIds.forEach(id => console.log(`   - ${id}`));
    } else {
      console.log(`\n✅ Todos los IDs están presentes`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkHabitosCourse()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });