// User Types
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'moderator' | 'admin';
  isVerified: boolean;
  isActive: boolean;
  googleId?: string;
  website?: string;
  location?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  stats: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    followers: number;
    following: number;
  };
  followers: string[];
  following: string[];
  bookmarks: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profileUrl?: string;
}

// User Update Types
export interface UpdateUserData {
  name?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newsletter?: boolean;
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  role?: 'user' | 'moderator' | 'admin';
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newsletter?: boolean;
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface GoogleAuthData {
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
  };
}

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  isPublic: boolean;
  allowComments: boolean;
  readTime: number;
  wordCount: number;
  views: number;
  likes: string[];
  dislikes: string[];
  bookmarks: string[];
  shares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    whatsapp: number;
    total: number;
  };
  comments: string[];
  commentCount: number;
  publishedAt?: Date;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    ogImage: string;
    ogTitle: string;
    ogDescription: string;
  };
  relatedPosts: string[];
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
  likeCount?: number;
  dislikeCount?: number;
  bookmarkCount?: number;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  isPublic?: boolean;
  allowComments?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  isPublic?: boolean;
  allowComments?: boolean;
  slug?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  tags?: string[];
  status?: string;
  featured?: boolean;
  isPublic?: boolean;
  allowComments?: boolean;
  author?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
}

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  blog: string;
  parentComment?: string;
  replies: string[];
  likes: string[];
  dislikes: string[];
  isEdited: boolean;
  isSpam: boolean;
  isApproved: boolean;
  reportedBy: string[];
  depth: number;
  path: string;
  score: number;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  content: string;
  blogId: string;
  parentCommentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  blogId?: string;
  authorId?: string;
  status?: 'approved' | 'pending' | 'spam';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    currentPage?: number;
    totalItems?: number;
    itemsPerPage?: number;
  };
}

// Blog List Response
export interface BlogListResponse {
  blogs: Blog[];
  featuredBlogs?: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Single Blog Response
export interface SingleBlogResponse {
  blog: Blog;
  relatedBlogs?: Blog[];
}

// User Profile Response
export interface UserProfileResponse {
  user: User;
  recentBlogs?: Blog[];
}

// Admin Types
export interface AdminDashboardStats {
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
  activeUsers: number;
  publishedBlogs: number;
  pendingComments: number;
  recentActivity: Array<{
    type: 'user_registered' | 'blog_created' | 'comment_added';
    data: any;
    timestamp: Date;
  }>;
}

export interface AdminUserUpdateData {
  role?: 'user' | 'moderator' | 'admin';
  isActive?: boolean;
  isVerified?: boolean;
}

export interface AdminBlogUpdateData {
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  isSponsored?: boolean;
  allowComments?: boolean;
}

export interface AdminCommentUpdateData {
  isApproved?: boolean;
  isSpam?: boolean;
}

// Upload Types
export interface UploadImageData {
  image: File;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'gif' | 'original';
}

export interface UploadResponse {
  original: string;
  responsive: {
    thumb: string;
    small: string;
    medium: string;
  };
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: Date;
}

// Search Types
export interface SearchResult {
  blogs: Blog[];
  users: User[];
  total: number;
}

export interface SearchFilters {
  query: string;
  type?: 'blogs' | 'users' | 'all';
  page?: number;
  limit?: number;
  filters?: BlogFilters;
}

// Notification Types
export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  recipient: string;
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  blog?: string;
  comment?: string;
  isRead: boolean;
  createdAt: Date;
}

// Bookmark Types
export interface Bookmark {
  _id: string;
  user: string;
  blog: Blog;
  createdAt: Date;
}

// Follow Types
export interface Follow {
  _id: string;
  follower: string;
  following: string;
  createdAt: Date;
}

// Analytics Types
export interface BlogAnalytics {
  views: number;
  likes: number;
  dislikes: number;
  shares: number;
  comments: number;
  bookmarks: number;
  readTime: number;
  engagementRate: number;
}

export interface UserAnalytics {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
  following: number;
  engagementRate: number;
  topPosts: Blog[];
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
  };
  options?: { value: string; label: string }[];
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Health Check Types
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  statusCode?: number;
}
