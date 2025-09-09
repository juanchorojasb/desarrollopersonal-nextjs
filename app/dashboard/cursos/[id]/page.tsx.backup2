import { Metadata } from 'next';

interface DashboardCoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DashboardCoursePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Curso ${id} - Dashboard - DesarrolloPersonal.uno`,
  };
}

export default async function DashboardCoursePage({ params }: DashboardCoursePageProps) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXTJS_URL || 'http://localhost:3003'}/api/courses/${id}?dashboard=true`, {
      cache: 'no-store'
    });
    const course = await response.json();
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{course.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{course.description}</p>
          
          <div className="space-y-8">
            {course.modules?.map((module: any) => (
              <div key={module.id} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">{module.title}</h2>
                <p className="text-gray-600 mb-6">{module.description}</p>
                
                <div className="grid gap-4">
                  {module.lessons?.map((lesson: any) => (
                    <div key={lesson.id} className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 mb-4">{lesson.content}</p>
                      
                      {lesson.videoUrl && (
                        <div className="w-full h-96">
                          <iframe 
                            src={lesson.videoUrl} 
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                            title={lesson.title}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600">Error cargando curso</h1>
          <p className="text-gray-600">{String(error)}</p>
        </div>
      </div>
    );
  }
}
