import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1'; // Update this to match your backend port

// Token management
interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Enhanced API response types
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

// Request options interface
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
const tokenManager = {
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  },

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  },

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!expiresAt) return false;
    return Date.now() > parseInt(expiresAt);
  },

  setTokenExpiration(expiresIn: number): void {
    const expiresAt = Date.now() + (expiresIn * 1000);
    localStorage.setItem('tokenExpiresAt', expiresAt.toString());
  },

  clearAllTokens(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }
};

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

// Health check for backend API
export const checkBackendHealth = async (): Promise<{ isHealthy: boolean; message: string }> => {
  // Temporarily disable health check - update this when backend is ready
  return {
    isHealthy: true,
    message: 'Backend health check disabled'
  };
  
  // Uncomment this when your backend is ready:
  /*
  try {
    const response = await apiClient.get('/health');
    return {
      isHealthy: response.status === 200,
      message: 'Backend is running'
    };
  } catch (error: any) {
    console.error('Backend health check failed:', error);
    return {
      isHealthy: false,
      message: error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' 
        ? 'Backend server is not running. Please start the backend server.'
        : 'Backend health check failed'
    };
  }
  */
};

// Refresh token function
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  const refreshTokenValue = tokenManager.getRefreshToken();

  if (!refreshTokenValue) {
    isRefreshing = false;
    processQueue(new Error('No refresh token available'));
    return null;
  }

  try {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken: refreshTokenValue
    });

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
    
    tokenManager.setToken(accessToken);
    if (newRefreshToken) {
      tokenManager.setRefreshToken(newRefreshToken);
    }
    if (expiresIn) {
      tokenManager.setTokenExpiration(expiresIn);
    }

    isRefreshing = false;
    processQueue(null, accessToken);
    return accessToken;
  } catch (error) {
    isRefreshing = false;
    tokenManager.clearAllTokens();
    processQueue(error);
    return null;
  }
};

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available and not expired
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired()) {
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

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          // Refresh failed, redirect to login
          tokenManager.clearAllTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        tokenManager.clearAllTokens();
        console.log('Authentication failed, clearing token');
        window.location.href = '/login';
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

// Enhanced API methods with better error handling
export const api = {
  request: async <T>(
    endpoint: string,
    options: RequestOptions = { requiresAuth: true }
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = tokenManager.getToken();
    
    const headers: HeadersInit = {};
    
    // Only set default Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
    }

    // Add Authorization header if token exists and request requires auth
    if (token && !tokenManager.isTokenExpired() && options.requiresAuth !== false) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 208 status code as success
      if (response.status === 208) {
        return { status: 208 } as T;
      }
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          // Only clear token and redirect if it's not a login attempt
          if (!endpoint.includes('/login') && !endpoint.includes('/refresh')) {
            tokenManager.clearAllTokens();
            window.location.href = '/login';
          }
          throw new Error('Invalid Username or Password');
        }
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorData;

        try {
          const text = await response.text();
          try {
            errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          // Error parsing error response
        }

        // Special handling for change-password endpoint
        if (response.status === 400 && endpoint.includes('change-password')) {
          errorMessage = 'Invalid current password. Please check your current password and try again.';
        }

        const error = new Error(errorMessage) as any;
        error.response = { status: response.status, data: errorData };
        throw error;
      }        

      // For file uploads, return success response without parsing JSON
      if (options.body instanceof FormData) {
        return { success: true } as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          return data as T;
        } catch (e) {
          throw new Error('Invalid JSON response from server');
        }
      } else {
        const text = await response.text();
        return text as T;
      }
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Please check your internet connection and try again.');
      }

      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond. Please try again.');
      }

      // Handle other errors
      if (error instanceof Error) {
        throw error;
      }

      // Handle unknown errors
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  },

  get: async <T>(url: string, config?: any): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  post: async <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  put: async <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  patch: async <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),

  delete: async <T>(url: string, config?: any): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
};

// Auth-specific endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<any> => {
    const response = await api.post<any>('/auth/login', credentials);
    if (response.data && response.data.token) {
      tokenManager.setToken(response.data.token);
      if (response.data.refreshToken) {
        tokenManager.setRefreshToken(response.data.refreshToken);
      }
      if (response.data.expiresIn) {
        tokenManager.setTokenExpiration(response.data.expiresIn);
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {}, { requiresAuth: true });
    } catch (error) {
      // Handle logout error silently
    } finally {
      tokenManager.clearAllTokens();
    }
  },

  refresh: async (): Promise<string | null> => {
    return await refreshToken();
  }
};

export default apiClient; 