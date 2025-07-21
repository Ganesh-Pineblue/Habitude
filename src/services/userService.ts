import { api, ApiResponse, authApi } from './api';

// User types based on the backend Users model
export interface User {
  id?: number;
  email: string;
  password?: string;
  authProvider?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  name: string;
  authProvider?: string;
}

export interface UserRegistrationResponse {
  user: User;
  success: boolean;
  message?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  token?: string;
  success: boolean;
  message?: string;
}

// User Service Class
export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise<UserRegistrationResponse>
   */
  async registerUser(userData: UserRegistrationRequest): Promise<UserRegistrationResponse> {
    try {
      const response: ApiResponse<User> = await api.post<User>('/auth/signup', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        authProvider: userData.authProvider || 'email'
      });

      if (response.status === 201) {
        return {
          user: response.data,
          success: true,
          message: 'User registered successfully'
        };
      } else {
        return {
          user: response.data,
          success: false,
          message: 'Registration failed'
        };
      }
    } catch (error: any) {
      console.error('User registration error:', error);
      
      if (error.response?.status === 409) {
        return {
          user: userData as any,
          success: false,
          message: 'User with this email already exists'
        };
      }
      
      return {
        user: userData as any,
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Login user via backend API using enhanced authApi
   * @param loginData - User login data
   * @returns Promise<UserLoginResponse>
   */
  async loginUser(loginData: UserLoginRequest): Promise<UserLoginResponse> {
    try {
      console.log('Attempting login with:', { email: loginData.email, password: '***' });
      console.log('API base URL:', 'http://localhost:8080/api/v1');
      console.log('Login endpoint:', '/auth/login');
      
      // Use the enhanced authApi for login
      const response = await authApi.login({
        email: loginData.email,
        password: loginData.password
      });

      console.log('Login response:', response);

      if (response && response.token) {
        return {
          user: {
            id: response.userId || response.id,
            email: response.email,
            name: response.name || response.firstName || loginData.email.split('@')[0] || 'User'
          },
          token: response.token,
          success: true,
          message: 'Login successful'
        };
      } else {
        console.log('Login failed - response:', response);
        return {
          user: { email: loginData.email, name: loginData.email.split('@')[0] || 'User' },
          success: false,
          message: response?.message || 'Login failed'
        };
      }
    } catch (error: any) {
      console.error('User login error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.response?.status === 401) {
        return {
          user: { email: loginData.email, name: loginData.email.split('@')[0] || 'User' },
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return {
          user: { email: loginData.email, name: loginData.email.split('@')[0] || 'User' },
          success: false,
          message: 'Unable to connect to server. Please check if the backend is running.'
        };
      }
      
      return {
        user: { email: loginData.email, name: loginData.email.split('@')[0] || 'User' },
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Logout user using enhanced authApi
   * @returns Promise<void>
   */
  async logoutUser(): Promise<void> {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, we should clear local tokens
    }
  }

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns Promise<User | null>
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const response: ApiResponse<User> = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Update user
   * @param userData - Updated user data
   * @returns Promise<User | null>
   */
  async updateUser(userData: User): Promise<User | null> {
    try {
      const response: ApiResponse<User> = await api.put<User>('/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      return null;
    }
  }

  /**
   * Get all users (admin function)
   * @returns Promise<User[]>
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response: ApiResponse<User[]> = await api.get<User[]>('/users');
      return response.data;
    } catch (error: any) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise<boolean>
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.status === 200;
    } catch (error: any) {
      console.error('Change password error:', error);
      return false;
    }
  }

  /**
   * Refresh user token
   * @returns Promise<string | null>
   */
  async refreshToken(): Promise<string | null> {
    try {
      return await authApi.refresh();
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance(); 