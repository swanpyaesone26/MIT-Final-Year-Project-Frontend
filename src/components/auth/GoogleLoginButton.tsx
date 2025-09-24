import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { initializeGoogleAuth, initiateGoogleLogin, handleOAuthCallback } from '../../lib/googleAuth';

const GoogleLoginButton = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get auth state and functions from Zustand store
  const { login, isLoading } = useAuthStore();

  // Initialize Google OAuth when component mounts
  useEffect(() => {
    const loadGoogle = async () => {
      try {
        await initializeGoogleAuth();
        setIsGoogleLoaded(true);
        console.log('Google OAuth initialized successfully');
        
        // Check if we're returning from OAuth callback
        const callbackResult = handleOAuthCallback();
        if (callbackResult.access_token) {
          // We have a token from Django callback
          console.log('Processing OAuth callback...');
          await login(callbackResult.access_token);
          
          // Clean up URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (callbackResult.error) {
          setError(callbackResult.error);
        }
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
        setError('Failed to load Google authentication');
      }
    };

    loadGoogle();
  }, [login]);

  // Handle Google login button click
  const handleGoogleLogin = () => {
    try {
      setError(null); // Clear any previous errors
      console.log('Redirecting to Django Google OAuth...');
      
      // Redirect to Django backend for OAuth
      initiateGoogleLogin();
      
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={!isGoogleLoaded || isLoading}
        className={`
          flex items-center justify-center space-x-3 px-6 py-3 
          border border-gray-300 rounded-lg shadow-sm bg-white 
          text-gray-700 hover:bg-gray-50 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          transition-colors duration-200 min-w-[240px]
          ${(!isGoogleLoaded || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        `}
      >
        {isLoading ? (
          <>
            {/* Loading spinner */}
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            {/* Google logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm text-center max-w-[240px]">
          {error}
        </div>
      )}

      {/* Loading status */}
      {!isGoogleLoaded && !error && (
        <div className="text-gray-500 text-sm">
          Loading Google authentication...
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;