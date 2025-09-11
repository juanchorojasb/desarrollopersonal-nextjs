import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeUsers: number;
  courseCompletions: number;
  forumPosts: number;
  recentGrowth: {
    users: number;
    enrollments: number;
    revenue: number;
  };
}

export interface UserWithStats {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  subscriptionStatus: string;
  totalXP: number;
  currentLevel: number;
  enrollmentsCount: number;
  completedCoursesCount: number;
  forumPostsCount: number;
  createdAt: Date;
  lastActivity: Date | null;
}

export interface CourseWithStats {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  level: string;
  category: string;
  price: number;
  status: string;
  featured: boolean;
  studentsCount: number;
  duration: number | null;
  enrollmentsCount: number;
  completionRate: number;
  averageRating: number;
  createdAt: Date;
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { sessionClaims } = await auth();
    return sessionClaims?.metadata?.role === 'admin';
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error('Admin access required');
  }
}

export async function logAdminAction(
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: any,
  success: boolean = true,
  errorMessage?: string
) {
  try {
    const { sessionClaims } = await auth();
    const adminId = sessionClaims?.sub;
    const adminEmail = sessionClaims?.email;

    if (!adminId || !adminEmail) {
      throw new Error('Admin information not available');
    }

    await prisma.adminLog.create({
      data: {
        adminId,
        adminEmail,
        action,
        resource,
        resourceId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress: null, // TODO: Extract from request
        userAgent: null, // TODO: Extract from request
        success,
        errorMessage,
      }
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}

export async function getAdminLogs({
  limit = 50,
  offset = 0,
  adminId,
  action,
  resource,
  success
}: {
  limit?: number;
  offset?: number;
  adminId?: string;
  action?: string;
  resource?: string;
  success?: boolean;
} = {}) {
  const where: any = {};
  
  if (adminId) where.adminId = adminId;
  if (action) where.action = action;
  if (resource) where.resource = resource;
  if (success !== undefined) where.success = success;
  
  return await prisma.adminLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
}

export async function getUsersWithStats({
  limit = 50,
  offset = 0,
  plan,
  status,
  search
}: {
  limit?: number;
  offset?: number;
  plan?: string;
  status?: string;
  search?: string;
} = {}) {
  const where: any = {};
  
  if (plan && plan !== 'all') {
    where.subscriptionStatus = plan;
  }
  
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        lessonProgress: true,
        forumPosts: true,
        forumReplies: true,
        _count: {
          select: {
            enrollments: true,
            lessonProgress: true,
            forumPosts: true,
            forumReplies: true
          }
        }
      }
    }),
    prisma.user.count({ where })
  ]);
  
  return { users, total };
}

export async function updateUserPlan(
  userId: string, 
  newPlan: string, 
  adminUser: AdminUser,
  ipAddress?: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const oldPlan = user.subscriptionStatus;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        subscriptionStatus: newPlan,
        subscriptionExpiry: newPlan === 'free' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
      }
    });
    
    // Log the action
    await logAdminAction({
      adminId: adminUser.id,
      adminEmail: adminUser.emailAddresses[0]?.emailAddress || '',
      action: 'update_user_plan',
      resource: 'user',
      resourceId: userId,
      metadata: { oldPlan, newPlan },
      ipAddress,
      success: true
    });
    
    return updatedUser;
  } catch (error) {
    // Log the error
    await logAdminAction({
      adminId: adminUser.id,
      adminEmail: adminUser.emailAddresses[0]?.emailAddress || '',
      action: 'update_user_plan',
      resource: 'user',
      resourceId: userId,
      metadata: { newPlan },
      ipAddress,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Error desconocido'
    });
    
    throw error;
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    activeUsers,
    courseCompletions,
    forumPosts,
    recentUsers,
    recentEnrollments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.user.count({
      where: {
        lastActivity: {
          gte: thirtyDaysAgo
        }
      }
    }),
    prisma.enrollment.count({
      where: {
        status: 'completed'
      }
    }),
    prisma.forumPost.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    }),
    prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: thirtyDaysAgo
        }
      }
    })
  ]);

  // Calculate total revenue (simplified - assuming enrollment = payment)
  const enrollmentsWithCourses = await prisma.enrollment.findMany({
    include: {
      course: {
        select: {
          price: true
        }
      }
    }
  });

  const totalRevenue = enrollmentsWithCourses.reduce((sum, enrollment) => 
    sum + enrollment.course.price, 0
  );

  const recentRevenue = enrollmentsWithCourses
    .filter(e => e.enrolledAt >= thirtyDaysAgo)
    .reduce((sum, enrollment) => sum + enrollment.course.price, 0);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    activeUsers,
    courseCompletions,
    forumPosts,
    recentGrowth: {
      users: recentUsers,
      enrollments: recentEnrollments,
      revenue: recentRevenue
    }
  };
}

export async function getSystemConfig(key: string) {
  const config = await prisma.systemConfig.findUnique({
    where: { key }
  });
  
  if (!config) return null;
  
  switch (config.type) {
    case 'number':
      return parseFloat(config.value);
    case 'boolean':
      return config.value === 'true';
    case 'json':
      return JSON.parse(config.value);
    default:
      return config.value;
  }
}

export async function setSystemConfig(
  key: string, 
  value: any, 
  type: string = 'string',
  description?: string,
  isPublic: boolean = false
) {
  await requireAdmin();
  
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  
  const result = await prisma.systemConfig.upsert({
    where: { key },
    update: { 
      value: stringValue, 
      type, 
      description,
      isPublic 
    },
    create: { 
      key, 
      value: stringValue, 
      type, 
      description,
      isPublic 
    }
  });

  await logAdminAction('update_system_config', 'system_config', key, {
    value,
    type,
    description,
    isPublic
  });

  return result;
}

export async function getCoursesWithStats(): Promise<CourseWithStats[]> {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    include: {
      enrollments: true,
      reviews: true,
      modules: {
        include: {
          lessons: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return courses.map(course => {
    const completedEnrollments = course.enrollments.filter(e => 
      e.status === 'completed'
    ).length;
    
    const completionRate = course.enrollments.length > 0 
      ? (completedEnrollments / course.enrollments.length) * 100 
      : 0;

    const averageRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      level: course.level,
      category: course.category,
      price: course.price,
      status: course.status,
      featured: course.featured,
      studentsCount: course.studentsCount,
      duration: course.duration,
      enrollmentsCount: course.enrollments.length,
      completionRate,
      averageRating,
      createdAt: course.createdAt
    };
  });
}

export async function updateUserSubscription(
  userId: string,
  newStatus: string,
  expiryDate?: Date
): Promise<void> {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: newStatus,
      subscriptionExpiry: expiryDate
    }
  });

  await logAdminAction('update_user_subscription', 'user', userId, {
    oldStatus: user.subscriptionStatus,
    newStatus,
    expiryDate
  });
}

export async function deleteUser(userId: string): Promise<void> {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Delete from Clerk first
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(user.clerkId);
  } catch (error) {
    console.error('Error deleting user from Clerk:', error);
    // Continue with database deletion even if Clerk fails
  }

  // Delete from database (cascading will handle related records)
  await prisma.user.delete({
    where: { id: userId }
  });

  await logAdminAction('delete_user', 'user', userId, {
    email: user.email,
    clerkId: user.clerkId
  });
}

export async function toggleCourseStatus(courseId: string): Promise<string> {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const newStatus = course.status === 'published' ? 'draft' : 'published';

  await prisma.course.update({
    where: { id: courseId },
    data: {
      status: newStatus
    }
  });

  await logAdminAction('toggle_course_status', 'course', courseId, {
    oldStatus: course.status,
    newStatus
  });

  return newStatus;
}

export async function toggleCourseFeatured(courseId: string): Promise<boolean> {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const newFeatured = !course.featured;

  await prisma.course.update({
    where: { id: courseId },
    data: {
      featured: newFeatured
    }
  });

  await logAdminAction('toggle_course_featured', 'course', courseId, {
    featured: newFeatured
  });

  return newFeatured;
}

export async function getPromoCodes(): Promise<any[]> {
  await requireAdmin();

  return prisma.promoCode.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function createPromoCode(data: {
  code: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  validFrom: Date;
  validUntil: Date;
  applicablePlans?: string[];
  minPurchase?: number;
  description?: string;
}): Promise<any> {
  await requireAdmin();

  const { sessionClaims } = await auth();
  const adminId = sessionClaims?.sub;

  const promoCode = await prisma.promoCode.create({
    data: {
      ...data,
      applicablePlans: data.applicablePlans ? JSON.stringify(data.applicablePlans) : null,
      createdBy: adminId
    }
  });

  await logAdminAction('create_promo_code', 'promo_code', promoCode.id, data);

  return promoCode;
}

export async function updatePromoCode(
  id: string,
  data: Partial<{
    code: string;
    discountType: string;
    discountValue: number;
    maxUses: number;
    validFrom: Date;
    validUntil: Date;
    applicablePlans: string[];
    minPurchase: number;
    description: string;
    isActive: boolean;
  }>
): Promise<any> {
  await requireAdmin();

  const updateData: any = { ...data };
  if (data.applicablePlans) {
    updateData.applicablePlans = JSON.stringify(data.applicablePlans);
  }

  const promoCode = await prisma.promoCode.update({
    where: { id },
    data: updateData
  });

  await logAdminAction('update_promo_code', 'promo_code', id, data);

  return promoCode;
}

export async function deletePromoCode(id: string): Promise<void> {
  await requireAdmin();

  const promoCode = await prisma.promoCode.findUnique({
    where: { id }
  });

  if (!promoCode) {
    throw new Error('Promo code not found');
  }

  await prisma.promoCode.delete({
    where: { id }
  });

  await logAdminAction('delete_promo_code', 'promo_code', id, {
    code: promoCode.code
  });
}

export function withAdminAuth(handler: Function) {
  return async (...args: any[]) => {
    try {
      await requireAdmin();
      return handler(...args);
    } catch (error) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
  };
}

export async function searchUsers(query: string, limit: number = 10): Promise<UserWithStats[]> {
  await requireAdmin();

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          email: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          firstName: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          lastName: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    },
    take: limit,
    include: {
      enrollments: {
        include: {
          course: true
        }
      },
      forumPosts: {
        where: {
          isDeleted: false
        }
      }
    }
  });

  return users.map(user => ({
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    subscriptionStatus: user.subscriptionStatus,
    totalXP: user.totalXP,
    currentLevel: user.currentLevel,
    enrollmentsCount: user.enrollments.length,
    completedCoursesCount: user.enrollments.filter(e => e.status === 'completed').length,
    forumPostsCount: user.forumPosts.length,
    createdAt: user.createdAt,
    lastActivity: user.lastActivity
  }));
}