import { BaseApiService, ApiResponse, PaginatedResponse } from '../api/client';
import { User } from './auth.service';
import { Blog } from './blog.service';

// 👤 Profile Types
export interface UserProfile extends User {
  // Override stats to include additional fields
  stats: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    followers: number;
    following: number;
    monthlyViews?: number;
    monthlyPosts?: number;
    engagementRate?: number;
  };
  // Additional profile-specific fields
  isPremium?: boolean;
  joinedAt?: string;
  lastActive?: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
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
  };
}

export interface ProfileStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followers: number;
  following: number;
  monthlyViews: number;
  monthlyPosts: number;
  engagementRate: number;
}

export interface UserActivity {
  _id: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'share';
  description: string;
  targetId?: string;
  targetType?: 'blog' | 'user' | 'comment';
  createdAt: string;
}

// 🚀 Profile Service
export class ProfileService extends BaseApiService {
  /**
   * 👤 Get current user's profile
   * Endpoint: GET /api/users/profile/me
   * Purpose: Retrieve current user's complete profile information
   * Use case: Profile page, user dashboard, profile editing
   */
  static async getCurrentUserProfile(): Promise<UserProfile> {
    const response = await this.get<UserProfile>('/users/profile/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get profile');
  }

  /**
   * 👤 Get user profile by ID
   * Endpoint: GET /api/users/profile/:id
   * Purpose: Retrieve another user's profile information
   * Use case: User profiles, user discovery, social connections
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await this.get<UserProfile>(`/users/profile/${userId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get user profile');
  }

  /**
   * ✏️ Update current user's profile
   * Endpoint: PUT /api/users/profile
   * Purpose: Modify current user's profile details
   * Use case: Profile editing, settings management
   */
  static async updateProfile(data: UpdateProfileData): Promise<{ profile: UserProfile; message: string }> {
    const response = await this.put<UserProfile>('/users/profile', data);
    
    if (response.success && response.data) {
      return {
        profile: response.data,
        message: response.message || 'Profile updated successfully'
      };
    }
    
    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * 📊 Get current user's statistics
   * Endpoint: GET /profile/stats
   * Purpose: Retrieve current user's activity statistics
   * Use case: Profile display, analytics, user insights
   */
  static async getCurrentUserStats(): Promise<ProfileStats> {
    const response = await this.get<{ stats: ProfileStats }>('/profile/stats');
    
    if (response.success && response.data) {
      return response.data.stats;
    }
    
    throw new Error(response.message || 'Failed to get profile stats');
  }

  /**
   * 📊 Get user statistics by ID
   * Endpoint: GET /profile/:id/stats
   * Purpose: Retrieve another user's activity statistics
   * Use case: User profiles, analytics, user insights
   */
  static async getUserStats(userId: string): Promise<ProfileStats> {
    const response = await this.get<{ stats: ProfileStats }>(`/profile/${userId}/stats`);
    
    if (response.success && response.data) {
      return response.data.stats;
    }
    
    throw new Error(response.message || 'Failed to get user stats');
  }

  /**
   * 📝 Get current user's published posts
   * Endpoint: GET /profile/posts
   * Purpose: Retrieve current user's published blog posts
   * Use case: Profile page, user dashboard, content management
   */
  static async getUserPublishedPosts(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'published'
    });

    const response = await this.get<{ posts: Blog[]; pagination: any }>(`/profile/posts?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.posts,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get published posts');
  }

  /**
   * 📝 Get current user's draft posts
   * Endpoint: GET /profile/drafts
   * Purpose: Retrieve current user's draft blog posts
   * Use case: Profile page, user dashboard, content management
   */
  static async getUserDrafts(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'draft'
    });

    const response = await this.get<{ drafts: Blog[]; pagination: any }>(`/profile/drafts?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.drafts,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get drafts');
  }

  /**
   * 📝 Get user's published posts by ID
   * Endpoint: GET /profile/:id/posts
   * Purpose: Retrieve another user's published blog posts
   * Use case: User profiles, content discovery
   */
  static async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Blog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'published'
    });

    const response = await this.get<{ posts: Blog[]; pagination: any }>(`/profile/${userId}/posts?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.posts,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get user posts');
  }

  /**
   * 👥 Get current user's followers
   * Endpoint: GET /profile/followers
   * Purpose: Get list of users following current user
   * Use case: Profile display, social connections
   */
  static async getCurrentUserFollowers(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ followers: User[]; pagination: any }>(`/profile/followers?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.followers,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get followers');
  }

  /**
   * 👥 Get current user's following
   * Endpoint: GET /profile/following
   * Purpose: Get list of users current user is following
   * Use case: Profile display, social connections
   */
  static async getCurrentUserFollowing(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ following: User[]; pagination: any }>(`/profile/following?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.following,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get following');
  }

  /**
   * 👥 Get user's followers by ID
   * Endpoint: GET /profile/:id/followers
   * Purpose: Get list of users following another user
   * Use case: User profiles, social connections
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

    const response = await this.get<{ followers: User[]; pagination: any }>(`/profile/${userId}/followers?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.followers,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get user followers');
  }

  /**
   * 👥 Get user's following by ID
   * Endpoint: GET /profile/:id/following
   * Purpose: Get list of users another user is following
   * Use case: User profiles, social connections
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

    const response = await this.get<{ following: User[]; pagination: any }>(`/profile/${userId}/following?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.following,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get user following');
  }

  /**
   * 📊 Get current user's activity
   * Endpoint: GET /profile/activity
   * Purpose: Retrieve current user's recent activity
   * Use case: Activity feed, user dashboard
   */
  static async getCurrentUserActivity(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<UserActivity>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ activity: UserActivity[]; pagination: any }>(`/profile/activity?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.activity,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get user activity');
  }

  /**
   * 📊 Get user's activity by ID
   * Endpoint: GET /profile/:id/activity
   * Purpose: Retrieve another user's recent activity
   * Use case: User profiles, activity feeds
   */
  static async getUserActivity(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<UserActivity>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await this.get<{ activity: UserActivity[]; pagination: any }>(`/profile/${userId}/activity?${params}`);
    
    if (response.success && response.data) {
      return {
        items: response.data.activity,
        pagination: response.data.pagination
      };
    }
    
    throw new Error(response.message || 'Failed to get user activity');
  }

  /**
   * 🔍 Check if current user is following another user
   * Endpoint: GET /profile/:id/follow
   * Purpose: Determine follow relationship status
   * Use case: Follow button state, relationship display
   */
  static async isFollowingUser(userId: string): Promise<boolean> {
    try {
      await this.get(`/profile/${userId}/follow`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * 📸 Update profile avatar
   * Endpoint: PUT /profile/avatar
   * Purpose: Change user's profile picture
   * Use case: Profile customization, avatar management
   */
  static async updateAvatar(avatarFile: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await this.uploadFile<{ avatar: string }>('/profile/avatar', formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update avatar');
  }

  /**
   * 🔒 Change password
   * Endpoint: PUT /profile/password
   * Purpose: Update user's password
   * Use case: Security settings, password management
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse> {
    const response = await this.put<ApiResponse>('/profile/password', {
      currentPassword,
      newPassword,
      confirmPassword
    });
    return response;
  }

  /**
   * 🗑️ Delete account
   * Endpoint: DELETE /profile/account
   * Purpose: Permanently remove user account
   * Use case: Account deletion, data privacy
   */
  static async deleteAccount(): Promise<ApiResponse> {
    const response = await this.delete<ApiResponse>('/profile/account');
    return response;
  }
}

export default ProfileService;
