import { BaseApiService, ApiResponse, TokenManager } from '../api/client';

// 🔐 Auth Types
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
}

export interface GoogleAuthData {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
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

// 🚀 Auth Service
export class AuthService extends BaseApiService {
  /**
   * 🔐 Register a new user
   * Endpoint: POST /api/auth/register
   * Purpose: Create new user account
   * Use case: User registration, sign up flow
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', data);
    
    if (response.success && response.data) {
      // Store auth data
      TokenManager.setToken(response.data.token);
      TokenManager.setUser(response.data.user);
    }
    
    return response.data!;
  }

  /**
   * 🔑 Login user
   * Endpoint: POST /api/auth/login
   * Purpose: Authenticate existing user
   * Use case: User login, sign in flow
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store auth data
      TokenManager.setToken(response.data.token);
      TokenManager.setUser(response.data.user);
    }
    
    return response.data!;
  }

  /**
   * 🌐 Google OAuth authentication
   * Endpoint: POST /api/auth/google
   * Purpose: Authenticate with Google
   * Use case: Social login, OAuth flow
   */
  static async googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/google', data);
    
    if (response.success && response.data) {
      // Store auth data
      TokenManager.setToken(response.data.token);
      TokenManager.setUser(response.data.user);
    }
    
    return response.data!;
  }

  /**
   * 👤 Get current authenticated user
   * Endpoint: GET /api/auth/me
   * Purpose: Retrieve current user's profile
   * Use case: Profile display, auth state check
   */
  static async getCurrentUser(): Promise<User> {
    const response = await this.get<User>('/auth/me');
    
    if (response.success && response.data) {
      // Update stored user data
      TokenManager.setUser(response.data);
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get current user');
  }

  /**
   * 🔄 Refresh access token
   * Endpoint: POST /api/auth/refresh
   * Purpose: Get new access token
   * Use case: Token renewal, session management
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const currentUser = TokenManager.getUser();
    const userId = currentUser?._id;
    
    if (!userId) {
      throw new Error('No user ID available for token refresh');
    }
    
    const response = await this.post<RefreshTokenResponse>('/auth/refresh', { userId });
    
    if (response.success && response.data) {
      // Update stored token
      TokenManager.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to refresh token');
  }

  /**
   * 🚪 Logout user
   * Endpoint: POST /api/auth/logout
   * Purpose: End user session
   * Use case: User logout, session cleanup
   */
  static async logout(): Promise<ApiResponse> {
    const response = await this.post<ApiResponse>('/auth/logout');
    
    // Clear stored auth data regardless of response
    TokenManager.removeToken();
    
    return response;
  }

  /**
   * ✅ Check if user is authenticated
   * Purpose: Verify authentication status
   * Use case: Route protection, UI state
   */
  static isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }

  /**
   * 🔑 Get stored token
   * Purpose: Access current auth token
   * Use case: API calls, token validation
   */
  static getToken(): string | null {
    return TokenManager.getToken();
  }

  /**
   * 👤 Get stored user data
   * Purpose: Access current user information
   * Use case: UI display, user context
   */
  static getStoredUser(): User | null {
    return TokenManager.getUser();
  }

  /**
   * 🔄 Update stored user data
   * Purpose: Keep user data in sync
   * Use case: Profile updates, data consistency
   */
  static updateStoredUser(user: User): void {
    TokenManager.setUser(user);
  }

  /**
   * 🧹 Clear all auth data
   * Purpose: Complete logout
   * Use case: Logout, session reset
   */
  static clearAuthData(): void {
    TokenManager.removeToken();
  }

  /**
   * 🔍 Validate token format
   * Purpose: Basic token validation
   * Use case: Token verification, error prevention
   */
  static validateTokenFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * ⏰ Check if token is expired
   * Purpose: Token expiration check
   * Use case: Token validation, refresh logic
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * 📦 Store auth data (helper method)
   * Purpose: Centralized auth data storage
   * Use case: Consistent data storage across auth methods
   */
  static storeAuthData(user: User, token: string): void {
    TokenManager.setToken(token);
    TokenManager.setUser(user);
  }
}

export default AuthService;
