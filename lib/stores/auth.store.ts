import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, GoogleAuthData } from '../services/auth.service';
import AuthService from '../services/auth.service';
import { debounce } from '../utils';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastAuthAttempt: number | null;
}

interface AuthActions {
  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  googleAuth: (data: GoogleAuthData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  getCurrentUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  
  // State setters
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

// Rate limiting protection - prevent rapid auth attempts
const RATE_LIMIT_DELAY = 2000; // 2 seconds between auth attempts

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      lastAuthAttempt: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          // Rate limiting protection
          const now = Date.now();
          const lastAttempt = get().lastAuthAttempt;
          if (lastAttempt && now - lastAttempt < RATE_LIMIT_DELAY) {
            return { 
              success: false, 
              message: 'Please wait a moment before trying again' 
            };
          }

          set({ isLoading: true, error: null, lastAuthAttempt: now });
          console.log('Login attempt with credentials:', credentials);
          
          const response = await AuthService.login(credentials);
          console.log('Login response:', response);
          
          // Store in localStorage
          AuthService.storeAuthData(response.user, response.token);
          console.log('Auth data stored in localStorage');
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          console.log('Auth state updated');
          
          return { success: true, message: 'Login successful!' };
        } catch (error: any) {
          console.error('Login error:', error);
          const errorMessage = error.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, message: errorMessage };
        }
      },

      register: async (data: RegisterData) => {
        try {
          // Rate limiting protection
          const now = Date.now();
          const lastAttempt = get().lastAuthAttempt;
          if (lastAttempt && now - lastAttempt < RATE_LIMIT_DELAY) {
            return { 
              success: false, 
              message: 'Please wait a moment before trying again' 
            };
          }

          set({ isLoading: true, error: null, lastAuthAttempt: now });
          
          const response = await AuthService.register(data);
          console.log('Register response:', response);
          
          // Store in localStorage
          AuthService.storeAuthData(response.user, response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return { success: true, message: 'Registration successful!' };
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, message: errorMessage };
        }
      },

      googleAuth: async (data: GoogleAuthData) => {
        try {
          // Rate limiting protection
          const now = Date.now();
          const lastAttempt = get().lastAuthAttempt;
          if (lastAttempt && now - lastAttempt < RATE_LIMIT_DELAY) {
            return { 
              success: false, 
              message: 'Please wait a moment before trying again' 
            };
          }

          set({ isLoading: true, error: null, lastAuthAttempt: now });
          
          const response = await AuthService.googleAuth(data);
          console.log('Google auth response:', response);
          
          // Store in localStorage
          AuthService.storeAuthData(response.user, response.token);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return { success: true, message: 'Google authentication successful!' };
        } catch (error: any) {
          const errorMessage = error.message || 'Google authentication failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, message: errorMessage };
        }
      },

      logout: async () => {
        try {
          const response = await AuthService.logout();
          console.log('Logout response:', response);
          
          // Clear local storage and state
          AuthService.clearAuthData();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          return { success: true, message: 'Logged out successfully' };
        } catch (error: any) {
          // Continue with logout even if API call fails
          console.error('Logout API call failed:', error);
          
          // Clear local storage and state anyway
          AuthService.clearAuthData();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          return { success: true, message: 'Logged out successfully' };
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // First try to get from localStorage
          const storedUser = AuthService.getStoredUser();
          const storedToken = AuthService.getToken();
          
          console.log('getCurrentUser - storedUser:', storedUser);
          console.log('getCurrentUser - storedToken:', storedToken);
          
          if (storedUser && storedToken) {
            // Check if token is expired
            if (AuthService.isTokenExpired(storedToken)) {
              console.log('Token expired, trying to refresh...');
              // Token expired, try to refresh
              try {
                const response = await AuthService.refreshToken();
                // Note: RefreshTokenResponse only provides a new token, not user data
                // We'll keep the existing user data and just update the token
                AuthService.storeAuthData(storedUser, response.token);
                set({
                  user: storedUser,
                  token: response.token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                return;
              } catch (refreshError) {
                console.log('Token refresh failed, clearing auth...');
                // Refresh failed, clear auth
                AuthService.clearAuthData();
                set({
                  user: null,
                  token: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: null,
                });
                return;
              }
            }
            
            console.log('Using stored user data');
            // Token is valid, use stored user
            set({
              user: storedUser,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
          
          console.log('No stored data, trying API...');
          // No stored data, try to get from API
          const user = await AuthService.getCurrentUser();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.log('getCurrentUser failed:', error);
          // If getting current user fails, user might not be authenticated
          AuthService.clearAuthData();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await AuthService.refreshToken();
          
          // Update stored token - RefreshTokenResponse only provides token, not user
          if (response.token) {
            const currentUser = get().user;
            if (currentUser) {
              AuthService.storeAuthData(currentUser, response.token);
              set({
                token: response.token,
                isAuthenticated: true,
              });
            }
          }
        } catch (error: any) {
          // If refresh fails, logout user
          get().logout();
        }
      },

      // State setters
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          AuthService.updateStoredUser(user);
        }
      },

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      clearAuth: () => {
        AuthService.clearAuthData();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if token is still valid on rehydration
          if (state.token && state.user) {
            // You could add token validation logic here
            state.isAuthenticated = true;
          }
        }
      },
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
