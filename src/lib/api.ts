import axios from 'axios';

//use axios for fetching
//create a "template" for all API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

// Request interceptor - automatically attach JWT token to requests
// This runs BEFORE every API call
api.interceptors.request.use(
  (config) => {
    // Try to get tokens from sessionStorage
    const tokens = sessionStorage.getItem('auth_tokens');
    
    if (tokens) {
      // Parse the JSON string back to object
      const { access_token } = JSON.parse(tokens);
      
      if (access_token) {
        // Add the Authorization header with Bearer token
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    }
    
    // Return the modified config so the request can proceed
    return config;
  },
  (error) => {
    // If something goes wrong with the request setup, reject it
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401 errors
// This runs AFTER every API call
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  async (error) => {
    // Store the original request that failed
    const originalRequest = error.config;

    // Check if the error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark that we're trying to refresh (prevent infinite loops)
      originalRequest._retry = true;

      try {
        // Try to get the refresh token
        const tokens = sessionStorage.getItem('auth_tokens');
        
        if (tokens) {
          const { refresh_token } = JSON.parse(tokens);
          
          if (refresh_token) {
            // Call Django's refresh endpoint
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
              { refresh: refresh_token }
            );

            // Get the new access token
            const { access } = response.data;
            
            // Update stored tokens with new access token
            const updatedTokens = JSON.parse(sessionStorage.getItem('auth_tokens') || '{}');
            updatedTokens.access_token = access;
            sessionStorage.setItem('auth_tokens', JSON.stringify(updatedTokens));

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - user needs to login again
        // Clear all tokens and redirect to login
        sessionStorage.removeItem('auth_tokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just pass them through
    return Promise.reject(error);
  }
);

// ===== API ENDPOINT FUNCTIONS =====

// Authentication API - all auth-related endpoints
export const authAPI = {
  // Google OAuth login - the main way users sign in
  googleLogin: (accessToken: string) =>
    api.post('/dj-rest-auth/google/', { access_token: accessToken }),

  // Get current logged-in user information
  getCurrentUser: () =>
    api.get('/dj-rest-auth/user/'),

  // Logout current user
  logout: () =>
    api.post('/dj-rest-auth/logout/'),

  // Verify if a JWT token is still valid
  verifyToken: (token: string) =>
    api.post('/dj-rest-auth/token/verify/', { token }),
};

// User Management API - only what we need
export const userAPI = {
  // Get specific user by ID
  getUser: (id: number) =>
    api.get(`/api/users/${id}/`),

  // Create new user (for registration if needed later)
  createUser: (userData: any) =>
    api.post('/api/users/', userData),
};

// Chatbot API - public endpoints (no authentication needed)
export const chatAPI = {
  // Chat with the AI assistant
  chat: (message: string, threadId?: string) =>
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/assistant/chat/`, {
      message,
      thread_id: threadId,
    }),
};

export default api;