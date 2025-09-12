import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ForumUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  postCount?: number;
  lastPost?: {
    id: string;
    title: string;
    createdAt: Date;
    author: ForumUser;
  } | null;
}

export interface ForumCategoryWithStats extends ForumCategory {
  postCount: number;
  replyCount: number;
  lastPost?: {
    id: string;
    title: string;
    createdAt: Date;
    author: ForumUser;
  } | null;
}

// Corregir la interfaz ForumReaction para coincidir con Prisma
export interface ForumReaction {
  id: string;
  type: string;
  userId: string;
  postId: string | null;  // Prisma usa null, no undefined
  replyId: string | null; // Prisma usa null, no undefined
  createdAt: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  createdAt: Date;
  author: ForumUser;
  reactions: ForumReaction[];
}

export interface ForumPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: ForumUser;
  category: ForumCategory;
  replyCount: number;
  reactionCount: number;
  lastReply?: {
    id: string;
    createdAt: Date;
    author: ForumUser;
  } | null;
}

export async function getForumCategories(): Promise<ForumCategoryWithStats[]> {
  const categories = await prisma.forumCategory.findMany({
    include: {
      _count: {
        select: {
          posts: true
        }
      },
      posts: {
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          replies: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return categories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    postCount: category._count.posts,
    replyCount: category.posts.reduce((acc, post) => acc + post.replies.length, 0),
    lastPost: category.posts[0] ? {
      id: category.posts[0].id,
      title: category.posts[0].title,
      createdAt: category.posts[0].createdAt,
      author: {
        id: category.posts[0].author.id,
        firstName: category.posts[0].author.firstName,
        lastName: category.posts[0].author.lastName,
        email: category.posts[0].author.email
      }
    } : null
  }));
}

export async function getCategoryPosts(categorySlug: string): Promise<ForumPost[]> {
  try {
    const posts = await prisma.forumPost.findMany({
      where: {
        category: { slug: categorySlug }
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        category: true,
        replies: {
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        reactions: true,
        _count: {
          select: { replies: true, reactions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        email: post.author.email
      },
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description,
        icon: post.category.icon
      },
      replyCount: post._count.replies,
      reactionCount: post._count.reactions,
      lastReply: post.replies[0] ? {
        id: post.replies[0].id,
        createdAt: post.replies[0].createdAt,
        author: {
          id: post.replies[0].author.id,
          firstName: post.replies[0].author.firstName,
          lastName: post.replies[0].author.lastName,
          email: post.replies[0].author.email
        }
      } : null
    }));
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

export async function getPostWithReplies(slug: string): Promise<ForumPost & { replies: ForumReply[] } | null> {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        category: true,
        replies: {
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, email: true }
            },
            reactions: true
          },
          orderBy: { createdAt: 'asc' }
        },
        reactions: true,
        _count: {
          select: { replies: true, reactions: true }
        }
      }
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        email: post.author.email
      },
      category: {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description,
        icon: post.category.icon
      },
      replyCount: post._count.replies,
      reactionCount: post._count.reactions,
      replies: post.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        author: {
          id: reply.author.id,
          firstName: reply.author.firstName,
          lastName: reply.author.lastName,
          email: reply.author.email
        },
        reactions: reply.reactions
      }))
    };
  } catch (error) {
    console.error('Error fetching post with replies:', error);
    return null;
  }
}
