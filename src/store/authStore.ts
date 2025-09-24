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
  
  // Logout function - clear everything and redirect
  logout: () => {
    try {
      // Optional: Call Django logout endpoint
      // We don't await this since we want to logout regardless
      authAPI.logout().catch(error => {
        console.warn('Server logout failed, but local logout continues:', error);
      });

      // Clear tokens from sessionStorage
      sessionStorage.removeItem('auth_tokens');

      // Reset all Zustand state to initial values
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        isLoading: false,
      });

      // Redirect to login page
      window.location.href = '/login';
      
      console.log('Logout successful');
    } catch (error) {
      // Even if logout fails, we still clear local state
      console.error('Logout error:', error);
      
      // Force clear local state anyway
      sessionStorage.removeItem('auth_tokens');
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        isLoading: false,
      });
      
      // Still redirect to login
      window.location.href = '/login';
    }
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  initializeAuth: () => {
    // TODO: Check sessionStorage on app startup
  },
}));