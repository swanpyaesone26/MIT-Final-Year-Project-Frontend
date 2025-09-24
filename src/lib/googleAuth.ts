// Google OAuth configuration and helper functions

// Initialize Google OAuth when the library loads
export const initializeGoogleAuth = () => {
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
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: () => {}, // We'll handle this in components
        });
        resolve(window.google);
      } else {
        reject(new Error('Google Identity Services failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Identity Services script'));
    };

    document.head.appendChild(script);
  });
};

// Function to handle Google OAuth login
export const signInWithGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    // Configure Google OAuth popup
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: (response: any) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error('Google OAuth failed: No access token received'));
        }
      },
      error_callback: (error: any) => {
        reject(new Error(`Google OAuth error: ${error.error}`));
      },
    });

    // Start the OAuth flow
    client.requestAccessToken();
  });
};

// TypeScript declaration for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
        };
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}