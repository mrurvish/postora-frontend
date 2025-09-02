import { BaseApiService, ApiResponse, PaginatedResponse } from '../api/client';

// 📝 Blog Types
export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  coverImage?: string;
}

export interface UpdateBlogData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  coverImage?: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogComment {
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
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  blogId: string;
  parentCommentId?: string;
}

// 🚀 Blog Service
export class BlogService extends BaseApiService {
  /**
   * 📝 Get all blogs with filtering and pagination
   * Endpoint: GET /blogs
   * Purpose: Retrieve list of all blogs
   * Use case: Blog listing, search, category filtering
   */
  static async getAllBlogs(filters: BlogFilters = {}): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);
    if (filters.status) params.append('status', filters.status);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/blogs?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get blogs');
  }

  /**
   * 📖 Get blog by ID
   * Endpoint: GET /blogs/:id
   * Purpose: Retrieve specific blog post
   * Use case: Blog reading, blog details
   */
  static async getBlogById(blogId: string): Promise<Blog> {
    const response = await this.get<{ blog: Blog }>(`/blogs/${blogId}`);
    
    if (response.success && response.data) {
      return response.data.blog;
    }
    
    throw new Error(response.message || 'Failed to get blog');
  }

  /**
   * 📖 Get blog by slug
   * Endpoint: GET /blogs/slug/:slug
   * Purpose: Retrieve specific blog post by slug
   * Use case: Blog reading, SEO-friendly URLs
   */
  static async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await this.get<{ blog: Blog }>(`/blogs/slug/${slug}`);
    
    if (response.success && response.data) {
      return response.data.blog;
    }
    
    throw new Error(response.message || 'Failed to get blog');
  }

  /**
   * ✨ Get featured blogs
   * Endpoint: GET /blogs/featured
   * Purpose: Get featured blog posts
   * Use case: Homepage, featured content
   */
  static async getFeaturedBlogs(limit: number = 6): Promise<Blog[]> {
    try {
      console.log('Calling getFeaturedBlogs with limit:', limit);
      console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
      const response = await this.get<any>(`/blogs/featured?limit=${limit}`);
      console.log('Featured blogs API response:', response);
      
      if (response.success && response.data) {
        // Handle different possible response formats
        let blogs: Blog[] = [];
        
        if (response.data.blogs) {
          blogs = response.data.blogs;
        } else if (Array.isArray(response.data)) {
          blogs = response.data;
        } else if (response.data.items) {
          blogs = response.data.items;
        }
        
        console.log('Featured blogs data:', blogs);
        return blogs;
      }
      
      console.log('No featured blogs data, returning empty array');
      return [];
    } catch (error) {
      console.error('Error in getFeaturedBlogs:', error);
      return [];
    }
  }

  /**
   * 🔥 Get trending blogs
   * Endpoint: GET /blogs/trending
   * Purpose: Get trending blog posts
   * Use case: Homepage, trending content
   */
  static async getTrendingBlogs(limit: number = 6): Promise<Blog[]> {
    const response = await this.get<{ blogs: Blog[] }>(`/blogs/trending?limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data.blogs;
    }
    
    return [];
  }

  /**
   * 📝 Create new blog
   * Endpoint: POST /blogs
   * Purpose: Create a new blog post
   * Use case: Blog creation, content management
   */
  static async createBlog(data: CreateBlogData): Promise<Blog> {
    const response = await this.post<{ blog: Blog }>('/blogs', data);
    
    if (response.success && response.data) {
      return response.data.blog;
    }
    
    throw new Error(response.message || 'Failed to create blog');
  }

  /**
   * ✏️ Update blog
   * Endpoint: PUT /blogs/:id
   * Purpose: Update existing blog post
   * Use case: Blog editing, content management
   */
  static async updateBlog(blogId: string, data: UpdateBlogData): Promise<Blog> {
    const response = await this.put<{ blog: Blog }>(`/blogs/${blogId}`, data);
    
    if (response.success && response.data) {
      return response.data.blog;
    }
    
    throw new Error(response.message || 'Failed to update blog');
  }

  /**
   * 🗑️ Delete blog
   * Endpoint: DELETE /blogs/:id
   * Purpose: Delete blog post
   * Use case: Content removal, content management
   */
  static async deleteBlog(blogId: string): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>(`/blogs/${blogId}`);
    return response;
  }

  /**
   * ❤️ Like blog
   * Endpoint: POST /blogs/:id/like
   * Purpose: Like a blog post
   * Use case: User engagement, social interaction
   */
  static async likeBlog(blogId: string): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>(`/blogs/${blogId}/like`);
    return response;
  }

  /**
   * 💔 Unlike blog
   * Endpoint: DELETE /blogs/:id/like
   * Purpose: Remove like from blog post
   * Use case: User engagement, social interaction
   */
  static async unlikeBlog(blogId: string): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>(`/blogs/${blogId}/like`);
    return response;
  }

  /**
   * 📊 Get blog statistics
   * Endpoint: GET /blogs/:id/stats
   * Purpose: Get blog engagement statistics
   * Use case: Analytics, performance tracking
   */
  static async getBlogStats(blogId: string): Promise<any> {
    const response = await this.get<{ stats: any }>(`/blogs/${blogId}/stats`);
    
    if (response.success && response.data) {
      return response.data.stats;
    }
    
    throw new Error(response.message || 'Failed to get blog stats');
  }

  /**
   * 💬 Get blog comments
   * Endpoint: GET /blogs/:id/comments
   * Purpose: Get comments for a blog post
   * Use case: Comment display, user discussion
   */
  static async getBlogComments(
    blogId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<BlogComment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ comments: BlogComment[]; pagination: any }>(`/blogs/${blogId}/comments?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.comments,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get comments');
  }

  /**
   * 💬 Create comment
   * Endpoint: POST /blogs/:id/comments
   * Purpose: Add comment to blog post
   * Use case: User discussion, engagement
   */
  static async createComment(data: CreateCommentData): Promise<BlogComment> {
    const response = await this.post<{ comment: BlogComment }>(`/blogs/${data.blogId}/comments`, {
      content: data.content,
      parentCommentId: data.parentCommentId
    });
    
    if (response.success && response.data) {
      return response.data.comment;
    }
    
    throw new Error(response.message || 'Failed to create comment');
  }

  /**
   * 💬 Update comment
   * Endpoint: PUT /blogs/:id/comments/:commentId
   * Purpose: Update existing comment
   * Use case: Comment editing
   */
  static async updateComment(
    blogId: string,
    commentId: string,
    content: string
  ): Promise<BlogComment> {
    const response = await this.put<{ comment: BlogComment }>(`/blogs/${blogId}/comments/${commentId}`, { content });
    
    if (response.success && response.data) {
      return response.data.comment;
    }
    
    throw new Error(response.message || 'Failed to update comment');
  }

  /**
   * 💬 Delete comment
   * Endpoint: DELETE /blogs/:id/comments/:commentId
   * Purpose: Delete comment
   * Use case: Comment removal
   */
  static async deleteComment(blogId: string, commentId: string): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>(`/blogs/${blogId}/comments/${commentId}`);
    return response;
  }

  /**
   * ❤️ Like comment
   * Endpoint: POST /blogs/:id/comments/:commentId/like
   * Purpose: Like a comment
   * Use case: User engagement
   */
  static async likeComment(blogId: string, commentId: string): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>(`/blogs/${blogId}/comments/${commentId}/like`);
    return response;
  }

  /**
   * 💔 Unlike comment
   * Endpoint: DELETE /blogs/:id/comments/:commentId/like
   * Purpose: Remove like from comment
   * Use case: User engagement
   */
  static async unlikeComment(blogId: string, commentId: string): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>(`/blogs/${blogId}/comments/${commentId}/like`);
    return response;
  }

  /**
   * 🔍 Search blogs
   * Endpoint: GET /blogs/search
   * Purpose: Search blogs by query
   * Use case: Content discovery, search functionality
   */
  static async searchBlogs(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/blogs/search?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to search blogs');
  }

  /**
   * 📊 Get blog categories
   * Endpoint: GET /blogs/categories
   * Purpose: Get available blog categories
   * Use case: Category filtering, navigation
   */
  static async getBlogCategories(): Promise<string[]> {
    const response = await this.get<{ categories: string[] }>('/blogs/categories');
    
    if (response.success && response.data) {
      return response.data.categories;
    }
    
    return [];
  }

  /**
   * 📊 Get blogs by category
   * Endpoint: GET /blogs/category/:category
   * Purpose: Get blogs in specific category
   * Use case: Category browsing, content organization
   */
  static async getBlogsByCategory(
    category: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/blogs/category/${category}?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get blogs by category');
  }

  /**
   * 📊 Get blogs by user
   * Endpoint: GET /blogs/user/:username
   * Purpose: Get blogs by specific user
   * Use case: User profiles, content discovery
   */
  static async getBlogsByUser(
    username: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/blogs/user/${username}?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get blogs by user');
  }

  /**
   * ❤️ Toggle like on a blog post
   * Endpoint: POST /blogs/:id/like
   * Purpose: Like or unlike a blog post
   * Use case: Like buttons, user engagement
   */
  static async toggleLike(blogId: string): Promise<{ liked: boolean; likeCount: number }> {
    const response = await this.post<{ liked: boolean; likeCount: number }>(`/blogs/${blogId}/like`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle like');
  }

  /**
   * 👎 Toggle dislike on a blog post
   * Endpoint: POST /blogs/:id/dislike
   * Purpose: Dislike or undislike a blog post
   * Use case: Dislike buttons, user feedback
   */
  static async toggleDislike(blogId: string): Promise<{ disliked: boolean; dislikeCount: number }> {
    const response = await this.post<{ disliked: boolean; dislikeCount: number }>(`/blogs/${blogId}/dislike`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle dislike');
  }

  /**
   * 🔖 Toggle bookmark on a blog post
   * Endpoint: POST /blogs/:id/bookmark
   * Purpose: Bookmark or unbookmark a blog post
   * Use case: Bookmark buttons, save for later
   */
  static async toggleBookmark(blogId: string): Promise<{ bookmarked: boolean; bookmarkCount: number }> {
    const response = await this.post<{ bookmarked: boolean; bookmarkCount: number }>(`/blogs/${blogId}/bookmark`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle bookmark');
  }

  /**
   * 📊 Get user's bookmarked blogs
   * Endpoint: GET /blogs/bookmarks
   * Purpose: Get list of user's bookmarked blogs
   * Use case: Bookmarks page, saved content
   */
  static async getBookmarkedBlogs(
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/blogs/bookmarks?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get bookmarked blogs');
  }

  /**
   * 📈 Get blog analytics
   * Endpoint: GET /blogs/:id/analytics
   * Purpose: Get detailed analytics for a blog post
   * Use case: Analytics dashboard, performance tracking
   */
  static async getBlogAnalytics(blogId: string): Promise<any> {
    const response = await this.get<{ analytics: any }>(`/blogs/${blogId}/analytics`);
    
    if (response.success && response.data) {
      return response.data.analytics;
    }
    
    throw new Error(response.message || 'Failed to get blog analytics');
  }

  /**
   * 🔍 Get related blogs
   * Endpoint: GET /blogs/:id/related
   * Purpose: Get related blog posts based on tags, category, or content
   * Use case: Related posts section, content discovery
   */
  static async getRelatedBlogs(
    blogId: string,
    limit: number = 6
  ): Promise<Blog[]> {
    const params = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await this.get<{ blogs: Blog[] }>(`/blogs/${blogId}/related?${params}`);
    
    if (response.success && response.data) {
      return response.data.blogs;
    }
    
    throw new Error(response.message || 'Failed to get related blogs');
  }
}

export default BlogService;
