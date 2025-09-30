// types/forum.ts
export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  color: string;
  icon?: string;
  position: number;
  isActive: boolean;
  postsCount: number;
  lastPostAt?: Date;
  posts?: ForumPost[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumPost {
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
  
  // Relaciones opcionales
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    email: string;
  };
  category?: ForumCategory;
  replies?: ForumReply[];
  reactions?: ForumReaction[];
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
  isDeleted: boolean;
  reactionsCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones opcionales
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    email: string;
  };
  post?: ForumPost;
  parent?: ForumReply;
  children?: ForumReply[];
  reactions?: ForumReaction[];
}

export interface ForumReaction {
  id: string;
  type: string;
  userId: string;
  postId?: string;
  replyId?: string;
  createdAt: Date;
  
  // Relaciones opcionales
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
}

export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';

export interface CreatePostData {
  title: string;
  content: string;
  categoryId: string;
}

export interface CreateReplyData {
  content: string;
  postId: string;
  parentId?: string;
}

export interface ForumStats {
  totalPosts: number;
  totalReplies: number;
  totalUsers: number;
  mostActiveCategory: string;
  recentActivity: {
    type: 'post' | 'reply';
    title: string;
    authorName: string;
    createdAt: Date;
    categoryName?: string;
  }[];
}
