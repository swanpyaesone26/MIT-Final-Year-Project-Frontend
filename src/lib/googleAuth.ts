// Google OAuth configuration and helper functions for Django backend integration

// Redirect to Django Google OAuth endpoint
export const initiateGoogleLogin = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const googleAuthUrl = `${baseUrl}/accounts/google/login/`;
  
  // Redirect to Django OAuth endpoint
  window.location.href = googleAuthUrl;
};

// Initialize Google OAuth (not needed for backend flow, but keeping for compatibility)
export const initializeGoogleAuth = (): Promise<boolean> => {
  return Promise.resolve(true);
};

// Handle OAuth callback from Django (called when redirected back)
export const handleOAuthCallback = (): { access_token?: string; error?: string } => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const error = urlParams.get('error');
  
  if (error) {
    return { error };
  }
  
  if (accessToken) {
    return { access_token: accessToken };
  }
  
  return {};
};