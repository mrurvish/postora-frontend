import { BaseApiService, PaginatedResponse } from '../api/client';
import { User } from './auth.service';
import { Blog } from './blog.service';

// 🔍 Search Types
export interface SearchResult {
  blogs: Blog[];
  users: User[];
  totalBlogs: number;
  totalUsers: number;
}

export interface SearchFilters {
  query: string;
  type?: 'all' | 'blogs' | 'users';
  category?: string;
  author?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface GlobalSearchResult {
  blogs: Blog[];
  users: User[];
  categories: string[];
  tags: string[];
  totalResults: number;
}

// 🚀 Search Service
export class SearchService extends BaseApiService {
  /**
   * 🔍 Global search across all content
   * Endpoint: GET /search
   * Purpose: Search across blogs, users, categories, and tags
   * Use case: Main search functionality, content discovery
   */
  static async globalSearch(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<GlobalSearchResult> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<GlobalSearchResult>(`/search?${params}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to perform global search');
  }

  /**
   * 🔍 Search blogs
   * Endpoint: GET /search/blogs
   * Purpose: Search specifically within blog posts
   * Use case: Blog search, content discovery
   */
  static async searchBlogs(
    query: string,
    page: number = 1,
    limit: number = 20,
    filters?: Partial<SearchFilters>
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters?.category) params.append('category', filters.category);
    if (filters?.author) params.append('author', filters.author);
    if (filters?.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/search/blogs?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to search blogs');
  }

  /**
   * 🔍 Search users
   * Endpoint: GET /search/users
   * Purpose: Search specifically within user profiles
   * Use case: User discovery, finding people
   */
  static async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      role?: string;
      isVerified?: boolean;
      location?: string;
      sortBy?: 'name' | 'username' | 'followers' | 'createdAt';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters?.role) params.append('role', filters.role);
    if (filters?.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString());
    if (filters?.location) params.append('location', filters.location);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await this.get<{ users: User[]; pagination: any }>(`/search/users?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.users,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to search users');
  }

  /**
   * 🔍 Search by category
   * Endpoint: GET /search/category/:category
   * Purpose: Find content within a specific category
   * Use case: Category browsing, topic exploration
   */
  static async searchByCategory(
    category: string,
    query?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (query) params.append('q', query);

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/search/category/${category}?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to search by category');
  }

  /**
   * 🔍 Search by tag
   * Endpoint: GET /search/tag/:tag
   * Purpose: Find content with specific tags
   * Use case: Tag browsing, topic exploration
   */
  static async searchByTag(
    tag: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ blogs: Blog[]; pagination: any }>(`/search/tag/${tag}?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.blogs,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to search by tag');
  }

  /**
   * 🔍 Advanced search with multiple filters
   * Endpoint: POST /search/advanced
   * Purpose: Complex search with multiple criteria
   * Use case: Advanced search forms, detailed filtering
   */
  static async advancedSearch(filters: SearchFilters): Promise<SearchResult> {
    const response = await this.post<SearchResult>('/search/advanced', filters);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to perform advanced search');
  }

  /**
   * 🔍 Get search suggestions
   * Endpoint: GET /search/suggestions
   * Purpose: Get search suggestions based on partial query
   * Use case: Autocomplete, search suggestions
   */
  static async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });

    const response = await this.get<{ suggestions: string[] }>(`/search/suggestions?${params}`);
    
    if (response.success && response.data) {
      return response.data.suggestions;
    }
    
    return [];
  }

  /**
   * 🔍 Get popular search terms
   * Endpoint: GET /search/popular
   * Purpose: Get trending search terms
   * Use case: Search trends, popular topics
   */
  static async getPopularSearches(limit: number = 10): Promise<string[]> {
    const params = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await this.get<{ searches: string[] }>(`/search/popular?${params}`);
    
    if (response.success && response.data) {
      return response.data.searches;
    }
    
    return [];
  }

  /**
   * 🔍 Get recent search history for current user
   * Endpoint: GET /search/history
   * Purpose: Get user's recent search queries
   * Use case: Search history, recent searches
   */
  static async getSearchHistory(limit: number = 10): Promise<string[]> {
    const params = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await this.get<{ history: string[] }>(`/search/history?${params}`);
    
    if (response.success && response.data) {
      return response.data.history;
    }
    
    return [];
  }

  /**
   * 🔍 Clear search history for current user
   * Endpoint: DELETE /search/history
   * Purpose: Clear user's search history
   * Use case: Privacy settings, data cleanup
   */
  static async clearSearchHistory(): Promise<void> {
    await this.delete('/search/history');
  }

  /**
   * 🔍 Get search analytics
   * Endpoint: GET /search/analytics
   * Purpose: Get search performance metrics
   * Use case: Analytics, search optimization
   */
  static async getSearchAnalytics(): Promise<any> {
    const response = await this.get('/search/analytics');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get search analytics');
  }
}

export default SearchService;
