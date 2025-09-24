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
export const useAuthStore = create<AuthState>((set) => ({
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
  
  // Initialize auth - check if user was already logged in
  initializeAuth: () => {
    try {
      // Check if tokens exist in sessionStorage
      const tokens = sessionStorage.getItem('auth_tokens');
      
      if (tokens) {
        // Parse the stored tokens
        const { access_token, refresh_token } = JSON.parse(tokens);
        
        if (access_token && refresh_token) {
          // Set loading while we verify the user
          set({ isLoading: true });
          
          // Verify token and get current user info
          authAPI.getCurrentUser()
            .then(response => {
              // Token is valid, user data received
              const user = response.data;
              
              // Restore authenticated state
              set({
                isAuthenticated: true,
                accessToken: access_token,
                refreshToken: refresh_token,
                user: user,
                isLoading: false,
              });
              
              console.log('Auth restored from session:', user);
            })
            .catch(error => {
              // Token is invalid/expired, clear everything
              console.warn('Stored tokens are invalid, clearing session:', error);
              
              sessionStorage.removeItem('auth_tokens');
              set({
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null,
                user: null,
                isLoading: false,
              });
            });
        } else {
          // Tokens exist but are malformed
          console.warn('Invalid token format in sessionStorage');
          sessionStorage.removeItem('auth_tokens');
        }
      } else {
        // No tokens found - user needs to login
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      // Error parsing stored tokens
      console.error('Auth initialization error:', error);
      sessionStorage.removeItem('auth_tokens');
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        isLoading: false,
      });
    }
  },
}));