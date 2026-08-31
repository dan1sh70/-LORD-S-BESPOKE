import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s (token refresh logic would go here in prod)
apiClient.interceptors.response.use(
  (response) => response.data, // Unwrap the axios response object
  (error) => {
    if (error.response?.status === 401) {
      // In a full implementation, trigger token refresh here. 
      // For now, clear storage and let AuthContext redirect to login.
      localStorage.removeItem('erp_access_token');
      localStorage.removeItem('erp_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
