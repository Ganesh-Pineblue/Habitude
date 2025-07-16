import { api, ApiResponse } from './api';

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
      const response: ApiResponse<User> = await api.post<User>('/users', {
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
   * Login user via backend API
   * @param loginData - User login data
   * @returns Promise<UserLoginResponse>
   */
  async loginUser(loginData: UserLoginRequest): Promise<UserLoginResponse> {
    try {
      const response: ApiResponse<any> = await api.post<any>('/auth/login', {
        email: loginData.email,
        password: loginData.password
      });

      if (response.status === 200 && response.data.success) {
        return {
          user: response.data.user,
          success: true,
          message: response.data.message || 'Login successful'
        };
      } else {
        return {
          user: { email: loginData.email, name: loginData.email.split('@')[0] || 'User' },
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error: any) {
      console.error('User login error:', error);
      
      if (error.response?.status === 401) {
        return {
          user: { email: loginData.email, name: loginData.email.split('@')[0] || 'User' },
          success: false,
          message: 'Invalid email or password'
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
}

// Export singleton instance
export const userService = UserService.getInstance(); 