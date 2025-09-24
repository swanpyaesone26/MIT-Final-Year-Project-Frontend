import { create } from 'zustand';
import { authAPI } from '../lib/api';

// TypeScript interface for our authentication state
interface AuthState {
  // Current state
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null; // We'll improve this type later
  isLoading: boolean;
  
  // Actions (functions to modify the state)
  login: (googleToken: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state - everything starts as null/false
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,

  // Login function - handles Google OAuth flow
  login: async (googleToken: string) => {
    try {
      // Set loading state
      set({ isLoading: true });

      // Call Django backend with Google token
      const response = await authAPI.googleLogin(googleToken);
      
      // Extract tokens and user data from Django response
      const { access_token, refresh_token, user } = response.data;

      // Create tokens object for sessionStorage
      const tokens = {
        access_token,
        refresh_token,
      };

      // Store tokens in sessionStorage (clears when tab closes)
      sessionStorage.setItem('auth_tokens', JSON.stringify(tokens));

      // Update Zustand state - user is now logged in!
      set({
        isAuthenticated: true,
        accessToken: access_token,
        refreshToken: refresh_token,
        user: user,
        isLoading: false,
      });

      console.log('Login successful:', user);
    } catch (error) {
      // Login failed - reset state and show error
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        isLoading: false,
      });
      
      console.error('Login failed:', error);
      throw error; // Re-throw so components can handle the error
    }
  },
  
  logout: () => {
    // TODO: Implement logout logic
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  initializeAuth: () => {
    // TODO: Check sessionStorage on app startup
  },
}));