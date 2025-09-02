import { BaseApiService, ApiResponse, PaginatedResponse } from '../api/client';
import { User } from './auth.service';

// 👥 User Types
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

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: 'name' | 'username' | 'createdAt' | 'followers';
  sortOrder?: 'asc' | 'desc';
}

// 🚀 User Service
export class UserService extends BaseApiService {
  /**
   * 👥 Get all users with filtering and pagination
   * Endpoint: GET /users
   * Purpose: Retrieve list of all users (typically admin functionality)
   * Use case: Admin dashboard, user management, user discovery
   */
  static async getAllUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await this.get<{ users: User[]; pagination: any }>(`/users?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.users,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get users');
  }

  /**
   * 👤 Get user by ID
   * Endpoint: GET /users/:id
   * Purpose: Retrieve specific user's profile information
   * Use case: User profile pages, user lookup, user references
   */
  static async getUserById(userId: string): Promise<User> {
    const response = await this.get<{ user: User }>(`/users/${userId}`);
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    throw new Error(response.message || 'Failed to get user');
  }

  /**
   * 🔄 Update current user's profile
   * Endpoint: PUT /users/profile
   * Purpose: Modify user's profile details
   * Use case: Profile editing, settings management
   */
  static async updateProfile(data: UpdateUserData): Promise<User> {
    const response = await this.put<{ user: User }>('/users/profile', data);
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * 🔑 Change user password
   * Endpoint: PUT /users/password
   * Purpose: Update user's password
   * Use case: Security settings, password management
   */
  static async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    const response = await this.put<ApiResponse>('/users/password', data);
    return response;
  }

  /**
   * 📧 Request password reset
   * Endpoint: POST /users/forgot-password
   * Purpose: Send password reset email
   * Use case: Password recovery, account security
   */
  static async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>('/users/forgot-password', data);
    return response;
  }

  /**
   * 🔒 Reset password with token
   * Endpoint: POST /users/reset-password
   * Purpose: Complete password reset process
   * Use case: Password recovery completion
   */
  static async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>('/users/reset-password', data);
    return response;
  }

  /**
   * ✅ Verify email with token
   * Endpoint: POST /users/verify-email
   * Purpose: Confirm user's email address
   * Use case: Email verification, account activation
   */
  static async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>('/users/verify-email', { token });
    return response;
  }

  /**
   * 📧 Resend verification email
   * Endpoint: POST /users/resend-verification
   * Purpose: Send new verification email
   * Use case: Email verification retry
   */
  static async resendVerificationEmail(email: string): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>('/users/resend-verification', { email });
    return response;
  }

  /**
   * 🗑️ Delete user account
   * Endpoint: DELETE /users/account
   * Purpose: Permanently remove user account
   * Use case: Account deletion, data privacy
   */
  static async deleteAccount(): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>('/users/account');
    return response;
  }

  /**
   * 👥 Follow another user
   * Endpoint: POST /users/follow/:id
   * Purpose: Establish a follow relationship with another user
   * Use case: Follow buttons, user discovery, social connections
   */
  static async followUser(userId: string): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>(`/users/follow/${userId}`);
    return response;
  }

  /**
   * 👥 Unfollow another user
   * Endpoint: DELETE /users/unfollow/:id
   * Purpose: Remove a follow relationship with another user
   * Use case: Unfollow buttons, relationship management
   */
  static async unfollowUser(userId: string): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>(`/users/unfollow/${userId}`);
    return response;
  }

  /**
   * 📊 Get user statistics
   * Endpoint: GET /users/:id/stats
   * Purpose: Retrieve user's activity statistics
   * Use case: Profile display, analytics, user insights
   */
  static async getUserStats(userId: string): Promise<any> {
    const response = await this.get<{ stats: any }>(`/users/${userId}/stats`);
    
    if (response.success && response.data) {
      return response.data.stats;
    }
    
    throw new Error(response.message || 'Failed to get user stats');
  }

  /**
   * 🔍 Get suggested users for current user
   * Endpoint: GET /users (with sorting by followers)
   * Purpose: Get users to follow based on popularity
   * Use case: User discovery, follow suggestions
   */
  static async getSuggestedUsers(limit: number = 5): Promise<User[]> {
    try {
      // Use getAllUsers with sorting by followers to get popular users
      const response = await this.getAllUsers({
        limit: limit,
        sortBy: 'followers',
        sortOrder: 'desc'
      });
      
      return response.items || [];
    } catch (error) {
      console.error('Failed to get suggested users:', error);
      return [];
    }
  }

  /**
   * 📊 Get user's followers
   * Endpoint: GET /users/:id/followers
   * Purpose: Get list of users following this user
   * Use case: Profile display, social connections
   */
  static async getUserFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ followers: User[]; pagination: any }>(`/users/${userId}/followers?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.followers,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get followers');
  }

  /**
   * 📊 Get user's following
   * Endpoint: GET /users/:id/following
   * Purpose: Get list of users this user is following
   * Use case: Profile display, social connections
   */
  static async getUserFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ following: User[]; pagination: any }>(`/users/${userId}/following?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.following,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get following');
  }

  /**
   * 🔍 Check if current user is following another user
   * Endpoint: GET /users/:id/follow
   * Purpose: Determine follow relationship status
   * Use case: Follow button state, relationship display
   */
  static async isFollowing(userId: string): Promise<boolean> {
    try {
      await this.get(`/users/${userId}/follow`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
}

export default UserService;
