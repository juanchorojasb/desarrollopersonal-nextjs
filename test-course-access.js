// test-course-access.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCourseAccess() {
  console.log('🧪 Testing course access and video setup...');
  
  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: '8ef86e1b-3c10-4131-a89d-baae3804d3ec' },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      console.log('❌ Course "Hábitos de Estudio Efectivos" not found');
      return;
    }

    console.log('✅ Course found:', course.title);
    console.log('📚 Course ID:', course.id);
    console.log('🎯 Status:', course.status);
    console.log('👨‍🏫 Instructor:', course.instructor);
    
    // Check modules and lessons
    console.log('\n📖 Modules and lessons:');
    course.modules.forEach((module, moduleIndex) => {
      console.log(`  ${moduleIndex + 1}. ${module.title} (${module.lessons.length} lessons)`);
      module.lessons.forEach((lesson, lessonIndex) => {
        const videoStatus = lesson.videoUrl ? '🎥 Video' : '📝 No video';
        const isMediaDelivery = lesson.videoUrl?.includes('iframe.mediadelivery.net') ? 'MediaDelivery' : 'Other';
        console.log(`     ${lessonIndex + 1}. ${lesson.title} - ${videoStatus} (${isMediaDelivery})`);
        if (lesson.videoUrl) {
          console.log(`        URL: ${lesson.videoUrl}`);
        }
      });
    });

    // Check total stats
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const mediaDeliveryLessons = course.modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => 
        lesson.videoUrl?.includes('iframe.mediadelivery.net')
      ).length, 0
    );

    console.log(`\n📊 Statistics:`);
    console.log(`   Total lessons: ${totalLessons}`);
    console.log(`   MediaDelivery videos: ${mediaDeliveryLessons}`);
    console.log(`   Duration: ${course.duration} minutes`);

    // Check if there are any users for testing (just count)
    const userCount = await prisma.user.count();
    console.log(`   Users in database: ${userCount}`);

    console.log('\n🎯 Video URLs to test:');
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (lesson.videoUrl && lesson.videoUrl.includes('iframe.mediadelivery.net')) {
          console.log(`   ${lesson.title}: ${lesson.videoUrl}`);
        }
      });
    });

    console.log('\n✅ Course access test completed successfully!');
    console.log('🌐 Next steps:');
    console.log('   1. Ensure users have active plans (basic, complete, or personal)');
    console.log('   2. Visit /dashboard/cursos to see the course');
    console.log('   3. Click on the course to access video content');

  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testCourseAccess()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });