import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseDetailView from '@/components/courses/CourseDetailView';

const prisma = new PrismaClient();

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    return course;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await getCourse(resolvedParams.id);

  if (!course) {
    return {
      title: 'Curso no encontrado',
      description: 'El curso que buscas no existe o no está disponible.',
    };
  }

  return {
    title: `${course.title} | DesarrolloPersonal.uno`,
    description: course.shortDesc || course.description?.substring(0, 160) || 'Curso de desarrollo personal',
    openGraph: {
      title: course.title,
      description: course.shortDesc || course.description || 'Curso de desarrollo personal',
      images: course.thumbnail ? [course.thumbnail] : [],
      type: 'website',
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  const course = await getCourse(resolvedParams.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseDetailView course={course} />
    </div>
  );
}
