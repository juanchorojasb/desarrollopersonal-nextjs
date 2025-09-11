import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type ForumCategoryWithStats = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string;
  icon: string | null;
  position: number;
  isActive: boolean;
  postsCount: number;
  lastPostAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastPost?: {
    id: string;
    title: string;
    author: {
      firstName: string | null;
      lastName: string | null;
    };
    createdAt: Date;
  } | null;
};

export type ForumPostWithAuthor = {
  id: string;
  title: string;
  content: string;
  slug: string;
  authorId: string;
  categoryId: string;
  isLocked: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  viewsCount: number;
  repliesCount: number;
  reactionsCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
  author: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  category: {
    name: string;
    slug: string;
    color: string;
  };
  lastReply?: {
    id: string;
    author: {
      firstName: string | null;
      lastName: string | null;
    };
    createdAt: Date;
  } | null;
};

export type ForumReplyWithAuthor = {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  isDeleted: boolean;
  reactionsCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  children?: ForumReplyWithAuthor[];
};

// Get all active forum categories with statistics
export async function getForumCategories(): Promise<ForumCategoryWithStats[]> {
  const categories = await prisma.forumCategory.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          posts: {
            where: { isDeleted: false }
          }
        }
      },
      posts: {
        where: { isDeleted: false },
        orderBy: { lastActivityAt: 'desc' },
        take: 1,
        include: {
          author: {
            select: { firstName: true, lastName: true }
          }
        }
      }
    },
    orderBy: { position: 'asc' }
  });

  return categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    color: category.color,
    icon: category.icon,
    position: category.position,
    isActive: category.isActive,
    postsCount: category._count.posts,
    lastPostAt: category.lastPostAt,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    lastPost: category.posts[0] ? {
      id: category.posts[0].id,
      title: category.posts[0].title,
      author: category.posts[0].author,
      createdAt: category.posts[0].createdAt
    } : null
  }));
}

// Get a forum category by slug
export async function getForumCategoryBySlug(slug: string) {
  return await prisma.forumCategory.findUnique({
    where: { slug, isActive: true }
  });
}

// Get posts for a category with pagination
export async function getForumPostsByCategory(
  categoryId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ posts: ForumPostWithAuthor[]; total: number; hasMore: boolean }> {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.forumPost.findMany({
      where: { categoryId, isDeleted: false },
      include: {
        author: {
          select: { firstName: true, lastName: true, imageUrl: true }
        },
        category: {
          select: { name: true, slug: true, color: true }
        },
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            author: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { lastActivityAt: 'desc' }
      ],
      skip,
      take: limit
    }),
    prisma.forumPost.count({
      where: { categoryId, isDeleted: false }
    })
  ]);

  return {
    posts: posts.map(post => ({
      ...post,
      lastReply: post.replies[0] || null
    })),
    total,
    hasMore: skip + posts.length < total
  };
}

// Get a single forum post with replies
export async function getForumPostBySlug(categorySlug: string, postSlug: string) {
  return await prisma.forumPost.findFirst({
    where: {
      slug: postSlug,
      isDeleted: false,
      category: {
        slug: categorySlug,
        isActive: true
      }
    },
    include: {
      author: {
        select: { firstName: true, lastName: true, imageUrl: true }
      },
      category: {
        select: { name: true, slug: true, color: true }
      },
      replies: {
        where: { 
          isDeleted: false,
          parentId: null // Solo replies de primer nivel
        },
        include: {
          author: {
            select: { firstName: true, lastName: true, imageUrl: true }
          },
          children: {
            where: { isDeleted: false },
            include: {
              author: {
                select: { firstName: true, lastName: true, imageUrl: true }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

// Create a new forum post
export async function createForumPost(data: {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
}) {
  const slug = generateSlug(data.title);
  
  // Check if slug exists in this category
  let finalSlug = slug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.forumPost.findUnique({
      where: { 
        categoryId_slug: { 
          categoryId: data.categoryId, 
          slug: finalSlug 
        } 
      }
    });
    
    if (!existing) break;
    
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const post = await prisma.forumPost.create({
    data: {
      ...data,
      slug: finalSlug,
      lastActivityAt: new Date()
    },
    include: {
      author: {
        select: { firstName: true, lastName: true, imageUrl: true }
      },
      category: {
        select: { name: true, slug: true, color: true }
      }
    }
  });

  // Update category statistics
  await updateCategoryStats(data.categoryId);

  return post;
}

// Create a new forum reply
export async function createForumReply(data: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) {
  const reply = await prisma.forumReply.create({
    data,
    include: {
      author: {
        select: { firstName: true, lastName: true, imageUrl: true }
      }
    }
  });

  // Update post statistics and last activity
  await prisma.forumPost.update({
    where: { id: data.postId },
    data: {
      repliesCount: { increment: 1 },
      lastActivityAt: new Date()
    }
  });

  return reply;
}

// Increment post view count
export async function incrementPostViews(postId: string) {
  await prisma.forumPost.update({
    where: { id: postId },
    data: { viewsCount: { increment: 1 } }
  });
}

// Update category statistics
async function updateCategoryStats(categoryId: string) {
  const postsCount = await prisma.forumPost.count({
    where: { categoryId, isDeleted: false }
  });

  const lastPost = await prisma.forumPost.findFirst({
    where: { categoryId, isDeleted: false },
    orderBy: { lastActivityAt: 'desc' },
    select: { lastActivityAt: true }
  });

  await prisma.forumCategory.update({
    where: { id: categoryId },
    data: {
      postsCount,
      lastPostAt: lastPost?.lastActivityAt || null
    }
  });
}

// Generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .trim()
    .substring(0, 50); // Limit length
}

// Search forum posts
export async function searchForumPosts(query: string, limit: number = 20) {
  return await prisma.forumPost.findMany({
    where: {
      isDeleted: false,
      OR: [
        { title: { contains: query } },
        { content: { contains: query } }
      ]
    },
    include: {
      author: {
        select: { firstName: true, lastName: true, imageUrl: true }
      },
      category: {
        select: { name: true, slug: true, color: true }
      }
    },
    orderBy: { lastActivityAt: 'desc' },
    take: limit
  });
}