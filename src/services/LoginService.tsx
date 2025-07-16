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
   * Login user via backend API
   * @param email - User email
   * @param password - User password
   * @returns Promise with user data
   */
  async loginUser(email: string, password: string): Promise<{ success: boolean; user: any; message?: string }> {
    try {
      const response = await userService.loginUser({ email, password });
      return {
        success: response.success,
        user: response.user,
        message: response.message
      };
    } catch (error) {
      console.error('Login service error:', error);
      return {
        success: false,
        user: { email, name: email.split('@')[0] || 'User' },
        message: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Validate login data
   * @param email - User email
   * @param password - User password
   * @returns Validation result
   */
  validateLoginData(email: string, password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password || password.length === 0) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Login user with validation
   * @param email - User email
   * @param password - User password
   * @returns Promise with login result
   */
  async login(email: string, password: string): Promise<{ success: boolean; user: any; message?: string }> {
    // Validate login data first
    const validation = this.validateLoginData(email, password);
    
    if (!validation.isValid) {
      return {
        success: false,
        user: { email, name: email.split('@')[0] || 'User' },
        message: validation.errors.join(', ')
      };
    }

    // Call the login API
    return await this.loginUser(email, password);
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
