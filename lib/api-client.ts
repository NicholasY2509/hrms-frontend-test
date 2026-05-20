import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // 'X-Test-As': 335 // Use this for local dev if needed
  },
  withCredentials: true,
});

// You can add interceptors here (e.g., for auth tokens)
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized: Clear token and redirect to unauthorized page or login
        Cookies.remove('access_token');
        if (typeof window !== 'undefined') {
          window.location.replace('/unauthorized');
        }
      } else if (status === 403) {
        // Forbidden: Redirect to forbidden page
        if (typeof window !== 'undefined') {
          window.location.replace('/forbidden');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
