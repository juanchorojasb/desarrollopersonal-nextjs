import { redirect } from 'next/navigation';
import { isAdmin, getCoursesWithStats } from '@/lib/admin';
import { PrismaClient } from '@prisma/client';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Eye,
  Edit3,
  Trash2,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

const prisma = new PrismaClient();

export default async function AdminContentPage() {
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    redirect('/dashboard');
  }

  // Get content statistics
  const [courses, forumStats, recentPosts] = await Promise.all([
    // Courses with enrollment stats
    getCoursesWithStats(),
    
    // Forum statistics
    Promise.all([
      prisma.forumCategory.findMany({
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      }),
      prisma.forumPost.count(),
      prisma.forumReply.count(),
      prisma.forumPost.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]),
    
    // Recent forum posts
    prisma.forumPost.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        category: true,
        _count: {
          select: {
            replies: true,
            reactions: true
          }
        }
      }
    })
  ]);

  const [forumCategories, totalPosts, totalReplies, postsThisWeek] = forumStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-600" />
                Gestión de Contenido
              </h1>
              <p className="mt-2 text-gray-600">
                Administrar cursos, módulos y comunidad
              </p>
            </div>
          </div>
        </div>

        {/* Content Overview Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                <p className="text-sm text-blue-600">
                  {courses.filter(c => c.status === 'published').length} publicados
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inscripciones</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courses.reduce((acc, course) => acc + course.enrollmentsCount, 0)}
                </p>
                <p className="text-sm text-green-600">Total activas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Posts Foros</p>
                <p className="text-2xl font-semibold text-gray-900">{totalPosts}</p>
                <p className="text-sm text-purple-600">+{postsThisWeek} esta semana</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-2xl font-semibold text-gray-900">{totalReplies}</p>
                <p className="text-sm text-orange-600">Respuestas totales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Cursos</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Nuevo Curso
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contenido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => {
                  return (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.category}</div>
                          <div className="text-xs text-gray-400">
                            Nivel {course.level}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : course.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status === 'published' ? 'Publicado' : 
                           course.status === 'draft' ? 'Borrador' : course.status}
                        </span>
                        {course.featured && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Destacado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-blue-500 mr-1" />
                            <span>{course.enrollmentsCount}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span>{course.completionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>
                          <div>Estudiantes: {course.studentsCount}</div>
                          <div>Rating: {course.averageRating.toFixed(1)}/5</div>
                          <div>${course.price}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </button>
                          <button className="text-green-600 hover:text-green-700 flex items-center">
                            <Edit3 className="w-4 h-4 mr-1" />
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forum Management */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Forum Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Categorías del Foro</h2>
                <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Nueva
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {forumCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {category._count.posts} posts
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Forum Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {post.author.imageUrl ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={post.author.imageUrl}
                          alt=""
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        por {post.author.firstName} en {post.category.name}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {post._count.replies} respuestas
                        <span className="mx-2">•</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}