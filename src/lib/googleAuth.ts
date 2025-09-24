// Google OAuth configuration and helper functions

// TypeScript interfaces for Google OAuth responses
interface GoogleTokenResponse {
  access_token: string;
  error?: string;
  error_description?: string;
}

interface GoogleErrorResponse {
  error: string;
  error_description?: string;
}

interface GoogleInitializeConfig {
  client_id: string;
  callback: () => void;
}

// Google OAuth configuration interface
export interface GoogleOAuthConfig {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
  error_callback: (error: GoogleErrorResponse) => void;
}

// Google ID (One Tap) configuration interface
export interface GoogleIdConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  cancel_on_tap_outside: boolean;
}

// Google credential response from One Tap
export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

// Google Profile information from JWT token
export interface GoogleProfile {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

// Initialize Google OAuth when the library loads
export const initializeGoogleAuth = (): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    // Check if Google API is already loaded
    if (window.google) {
      resolve(window.google);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Initialize Google OAuth
      if (window.google) {
        const config: GoogleInitializeConfig = {
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: () => {}, // We'll handle this in components
        };
        window.google.accounts.id.initialize(config);
        resolve(window.google);
      } else {
        reject(new Error('Failed to load Google Identity Services'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services script'));
    };
    
    document.head.appendChild(script);
  });
};

// Request Google OAuth access token
export const getGoogleOAuthToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    // Configure Google OAuth popup
    const config: GoogleOAuthConfig = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: (response: GoogleTokenResponse) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error('Google OAuth failed: No access token received'));
        }
      },
      error_callback: (error: GoogleErrorResponse) => {
        reject(new Error(`Google OAuth error: ${error.error}`));
      },
    };

    const client = window.google.accounts.oauth2.initTokenClient(config);

    // Start the OAuth flow
    client.requestAccessToken();
  });
};

// Get user profile from Google One Tap
export const getUserProfile = (): Promise<GoogleProfile> => {
  return new Promise((resolve, reject) => {
    const config: GoogleIdConfig = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: GoogleCredentialResponse) => {
        try {
          // Decode JWT token to get user info
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          
          const profile: GoogleProfile = JSON.parse(jsonPayload);
          resolve(profile);
        } catch (error) {
          reject(error);
        }
      },
      cancel_on_tap_outside: false,
    };

    window.google?.accounts.id.initialize(config);
    window.google?.accounts.id.prompt();
  });
};

// TypeScript declaration for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig | GoogleIdConfig) => void;
          prompt: () => void;
        };
        oauth2: {
          initTokenClient: (config: GoogleOAuthConfig) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}