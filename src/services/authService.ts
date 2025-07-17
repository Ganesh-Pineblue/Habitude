import { api, authApi, ApiResponse } from './api';

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  type?: string;
  role?: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  userId?: string;
  email?: string;
  phone?: string;
  status?: string;
  active?: boolean;
  retailerId?: string;
  previousLoginTime?: string;
}

export interface User {
  id?: string | number;
  email: string;
  name: string;
  role?: string;
  userType?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: string;
  active?: boolean;
  retailerId?: string;
  previousLoginTime?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Authentication Service Class
export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuth(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.authState.user = user;
        this.authState.isAuthenticated = true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * Login user with credentials
   * @param credentials - Login credentials
   * @returns Promise<AuthState>
   */
  async login(credentials: LoginCredentials): Promise<AuthState> {
    this.authState.isLoading = true;
    this.authState.error = null;

    try {
      console.log('Attempting login with:', { email: credentials.email, password: '***' });
      
      const response = await authApi.login(credentials);
      
      console.log('Login response:', response);

      if (response && response.token) {
        // Store user data in localStorage
        const userData: User = {
          id: response.userId || response.id,
          email: response.email,
          name: response.firstName || response.name || credentials.email.split('@')[0] || 'User',
          role: response.role,
          userType: response.userType,
          firstName: response.firstName,
          lastName: response.lastName,
          phone: response.phone,
          status: response.status,
          active: response.active,
          retailerId: response.retailerId,
          previousLoginTime: response.previousLoginTime
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        
        this.authState.user = userData;
        this.authState.isAuthenticated = true;
        this.authState.error = null;
        
        console.log('Login successful:', userData);
      } else {
        this.authState.error = response?.message || 'Login failed';
        this.authState.isAuthenticated = false;
        this.authState.user = null;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.authState.error = errorMessage;
      this.authState.isAuthenticated = false;
      this.authState.user = null;
    } finally {
      this.authState.isLoading = false;
    }

    return this.authState;
  }

  /**
   * Logout user
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, we should clear local data
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem('userData');
    this.authState.user = null;
    this.authState.isAuthenticated = false;
    this.authState.error = null;
  }

  /**
   * Get current authentication state
   * @returns AuthState
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!localStorage.getItem('authToken');
  }

  /**
   * Get current user
   * @returns User | null
   */
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  /**
   * Update user data
   * @param userData - Updated user data
   */
  updateUser(userData: Partial<User>): void {
    if (this.authState.user) {
      this.authState.user = { ...this.authState.user, ...userData };
      localStorage.setItem('userData', JSON.stringify(this.authState.user));
    }
  }

  /**
   * Change user password
   * @param request - Change password request
   * @returns Promise<boolean>
   */
  async changePassword(request: ChangePasswordRequest): Promise<boolean> {
    try {
      const response = await api.post('/auth/change-password', request);
      return response.status === 200;
    } catch (error: any) {
      console.error('Change password error:', error);
      return false;
    }
  }

  /**
   * Refresh authentication token
   * @returns Promise<string | null>
   */
  async refreshToken(): Promise<string | null> {
    try {
      return await authApi.refresh();
    } catch (error: any) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      return null;
    }
  }

  /**
   * Validate login credentials
   * @param credentials - Login credentials
   * @returns Validation result
   */
  validateCredentials(credentials: LoginCredentials): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.email || credentials.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(credentials.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!credentials.password || credentials.password.length === 0) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise<{ success: boolean; message: string }>
   */
  async register(userData: {
    email: string;
    password: string;
    name: string;
    authProvider?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response: ApiResponse<any> = await api.post<any>('/users', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        authProvider: userData.authProvider || 'email'
      });

      if (response.status === 201) {
        return {
          success: true,
          message: 'User registered successfully'
        };
      } else {
        return {
          success: false,
          message: 'Registration failed'
        };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Get user profile
   * @returns Promise<User | null>
   */
  async getUserProfile(): Promise<User | null> {
    try {
      const response: ApiResponse<User> = await api.get<User>('/users/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   * @param userData - Updated user data
   * @returns Promise<User | null>
   */
  async updateUserProfile(userData: Partial<User>): Promise<User | null> {
    try {
      const response: ApiResponse<User> = await api.put<User>('/users/profile', userData);
      const updatedUser = response.data;
      
      // Update local user data
      this.updateUser(updatedUser);
      
      return updatedUser;
    } catch (error: any) {
      console.error('Update user profile error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance(); 