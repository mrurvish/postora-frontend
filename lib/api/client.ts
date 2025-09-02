import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 🚀 API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 📝 API Response Types (matching backend structure)
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 🔐 Auth Token Management
class TokenManager {
  private static readonly TOKEN_KEY = 'postora_auth_token';
  private static readonly USER_KEY = 'postora_user_data';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUser(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

// 🏗️ Create Axios Instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // 🔄 Request Interceptor - Add auth token
  client.interceptors.request.use(
    (config) => {
      const token = TokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🔄 Response Interceptor - Handle errors and auth
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        TokenManager.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('Access forbidden:', error.response.data);
      }

      // Handle 500 Server Error
      if (error.response?.status >= 500) {
        console.error('Server error:', error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// 🚀 API Client Instance
export const apiClient = createApiClient();

// 🎯 API Service Base Class
export abstract class BaseApiService {
  protected static async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  protected static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // 📤 File Upload Helper
  protected static async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // ❌ Error Handler
  private static handleError(error: any): ApiResponse {
    if (error.response?.data) {
      // Backend error response
      return {
        success: false,
        message: error.response.data.message || 'An error occurred',
        error: error.response.data.error || error.message
      };
    }

    if (error.request) {
      // Network error
      return {
        success: false,
        message: 'Network error - please check your connection',
        error: 'No response received from server'
      };
    }

    // Other error
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      error: error.toString()
    };
  }
}

// 🔐 Export Token Manager for external use
export { TokenManager };

// 📡 Export API client for direct use if needed
export { apiClient as default };
