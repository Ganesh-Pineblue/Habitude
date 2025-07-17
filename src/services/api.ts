import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Network connectivity check
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Try to fetch a small resource to check connectivity
    await fetch(`${API_BASE_URL}/health`, { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    return true;
  } catch (error) {
    console.log('Network connectivity check failed:', error);
    return false;
  }
};

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        console.log('Authentication failed, clearing token');
      } else if (error.response.status === 503) {
        // Service unavailable
        console.log('Backend service is temporarily unavailable');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      console.log('No response received - possible network connectivity issue');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Generic API methods with enhanced error handling
export const api = {
  get: <T>(url: string, config?: any): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  post: <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  put: <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  patch: <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  delete: <T>(url: string, config?: any): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
};

export default apiClient; 