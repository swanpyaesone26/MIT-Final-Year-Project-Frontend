import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();

  // Initialize auth when app loads
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show appropriate page based on auth state
  return isAuthenticated ? <HomePage /> : <LoginPage />;
}

export default App;
