import { create } from 'zustand';
import { UserProfile, UpdateProfileData } from '../services/profile.service';
import ProfileService from '../services/profile.service';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  // Actions
  getCurrentUserProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; message: string }>;
  
  // State setters
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearProfile: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>((set, get) => ({
  // Initial state
  profile: null,
  isLoading: false,
  error: null,

  // Actions
  getCurrentUserProfile: async () => {
    try {
      console.log('ProfileStore: getCurrentUserProfile called');
      set({ isLoading: true, error: null });
      
      const profile = await ProfileService.getCurrentUserProfile();
      console.log('ProfileStore: Profile data received:', profile);
      
      set({
        profile,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('ProfileStore: Error getting profile:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to get profile',
      });
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    try {
      set({ isLoading: true, error: null });
      
      const result = await ProfileService.updateProfile(data);
      
      set({
        profile: result.profile,
        isLoading: false,
        error: null,
      });
      
      return { success: true, message: result.message };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  },

  // State setters
  setProfile: (profile: UserProfile | null) => {
    set({ profile });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  clearProfile: () => {
    set({
      profile: null,
      error: null,
    });
  },
}));

// Selectors for better performance
export const useProfile = () => useProfileStore((state) => state.profile);
export const useProfileLoading = () => useProfileStore((state) => state.isLoading);
export const useProfileError = () => useProfileStore((state) => state.error);
