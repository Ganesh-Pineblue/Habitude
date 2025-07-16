import { userService, UserRegistrationRequest, UserRegistrationResponse } from './userService';

/**
 * LoginService - Handles authentication operations
 * Currently handles registration via backend API and login locally
 */
export class LoginService {
  private static instance: LoginService;

  private constructor() {}

  public static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  /**
   * Register a new user via backend API
   * @param userData - User registration data
   * @returns Promise<UserRegistrationResponse>
   */
  async registerUser(userData: UserRegistrationRequest): Promise<UserRegistrationResponse> {
    try {
      const response = await userService.registerUser(userData);
      return response;
    } catch (error) {
      console.error('Registration service error:', error);
      return {
        user: userData as any,
        success: false,
        message: 'Registration service error. Please try again.'
      };
    }
  }

  /**
   * Login user (handled locally as requested)
   * @param email - User email
   * @param password - User password
   * @returns Promise with user data
   */
  async loginUser(email: string, password: string): Promise<{ success: boolean; user: any; message?: string }> {
    // Local login implementation as requested
    // In a real application, this would call the backend API
    const name = email.split('@')[0] || 'User';
    
    return {
      success: true,
      user: {
        name,
        email,
        authProvider: 'email'
      },
      message: 'Login successful (local)'
    };
  }

  /**
   * Validate user registration data
   * @param userData - User registration data
   * @returns Validation result
   */
  validateRegistrationData(userData: UserRegistrationRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
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
}

// Export singleton instance
export const loginService = LoginService.getInstance();
