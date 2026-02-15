import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MessageCircle, Trash2, Eye, AlertCircle } from 'lucide-react';

async function getForumData() {
  const [posts, categories, recentPosts] = await Promise.all([
    prisma.forumPost.count(),
    prisma.forumCategory.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { position: 'asc' }
    }),
    prisma.forumPost.findMany({
      take: 20,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            replies: true,
            reactions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    totalPosts: posts,
    categories,
    recentPosts,
  };
}

export default async function AdminForumPage() {
  const data = await getForumData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moderación del Foro</h1>
        <p className="text-gray-600 mt-2">{data.totalPosts} posts totales</p>
      </div>

      {/* Categories Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categorías</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category._count.posts} posts</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <MessageCircle className="w-5 h-5" style={{ color: category.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Posts Recientes</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {post.content}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post.user.name || post.user.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-500">{post.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {post.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {post._count.replies} respuestas
                      </div>
                      <div className="text-xs text-gray-500">
                        {post._count.reactions} reacciones
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/dashboard/community/${post.category.slug}/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
