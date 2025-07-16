import { api, ApiResponse } from './api';

// Onboarding types based on the backend OnboardingFlow model
export interface OnboardingFlow {
  id?: number;
  userId: number;
  firstName: string;
  generation: string;
  gender: string;
  selectedPersonality: string;
  personalityCategory: string;
  personalityDescription: string;
  personalityImage: string;
  personalityAchievements: string;
  selectedHabits: string;
  generatedHabits: string;
  generatedGoals: string;
  currentStep?: number;
  totalSteps?: number;
  isCompleted?: boolean;
  skippedPersonality?: boolean;
}

export interface OnboardingFlowRequest {
  userId: number;
  firstName: string;
  generation: string;
  gender: string;
  selectedPersonality: string;
  personalityCategory: string;
  personalityDescription: string;
  personalityImage: string;
  personalityAchievements: string[];
  selectedHabits: string[];
  generatedHabits: any[];
  generatedGoals: any[];
  currentStep?: number;
  totalSteps?: number;
  isCompleted?: boolean;
  skippedPersonality?: boolean;
}

export interface OnboardingFlowResponse {
  onboardingFlow: OnboardingFlow;
  success: boolean;
  message?: string;
}

// Onboarding Service Class
export class OnboardingService {
  private static instance: OnboardingService;

  private constructor() {}

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  /**
   * Create a new onboarding flow
   * @param onboardingData - Onboarding flow data
   * @returns Promise<OnboardingFlowResponse>
   */
  async createOnboardingFlow(onboardingData: OnboardingFlowRequest): Promise<OnboardingFlowResponse> {
    try {
      // Convert arrays to JSON strings for backend
      const backendData: OnboardingFlow = {
        userId: onboardingData.userId,
        firstName: onboardingData.firstName,
        generation: onboardingData.generation,
        gender: onboardingData.gender,
        selectedPersonality: onboardingData.selectedPersonality,
        personalityCategory: onboardingData.personalityCategory,
        personalityDescription: onboardingData.personalityDescription,
        personalityImage: onboardingData.personalityImage,
        personalityAchievements: JSON.stringify(onboardingData.personalityAchievements),
        selectedHabits: JSON.stringify(onboardingData.selectedHabits),
        generatedHabits: JSON.stringify(onboardingData.generatedHabits),
        generatedGoals: JSON.stringify(onboardingData.generatedGoals),
        currentStep: onboardingData.currentStep || 0,
        totalSteps: onboardingData.totalSteps || 2,
        isCompleted: onboardingData.isCompleted || false,
        skippedPersonality: onboardingData.skippedPersonality || false
      };

      const response: ApiResponse<OnboardingFlow> = await api.post<OnboardingFlow>('/onboarding', backendData);

      if (response.status === 201) {
        return {
          onboardingFlow: response.data,
          success: true,
          message: 'Onboarding flow created successfully'
        };
      } else {
        return {
          onboardingFlow: backendData,
          success: false,
          message: 'Failed to create onboarding flow'
        };
      }
    } catch (error: any) {
      console.error('Onboarding flow creation error:', error);
      
      if (error.response?.status === 400) {
        return {
          onboardingFlow: onboardingData as any,
          success: false,
          message: 'Invalid request data. Please check your input.'
        };
      }
      
      if (error.response?.status === 404) {
        return {
          onboardingFlow: onboardingData as any,
          success: false,
          message: 'User not found. Please try logging in again.'
        };
      }
      
      return {
        onboardingFlow: onboardingData as any,
        success: false,
        message: error.response?.data?.message || 'Failed to create onboarding flow. Please try again.'
      };
    }
  }

  /**
   * Get onboarding flow by ID
   * @param id - Onboarding flow ID
   * @returns Promise<OnboardingFlow | null>
   */
  async getOnboardingFlowById(id: number): Promise<OnboardingFlow | null> {
    try {
      const response: ApiResponse<OnboardingFlow> = await api.get<OnboardingFlow>(`/onboarding/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get onboarding flow error:', error);
      return null;
    }
  }

  /**
   * Get onboarding flow by user ID
   * @param userId - User ID
   * @returns Promise<OnboardingFlow | null>
   */
  async getOnboardingFlowByUserId(userId: number): Promise<OnboardingFlow | null> {
    try {
      const response: ApiResponse<OnboardingFlow> = await api.get<OnboardingFlow>(`/onboarding/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get onboarding flow by user error:', error);
      return null;
    }
  }

  /**
   * Update onboarding flow
   * @param id - Onboarding flow ID
   * @param onboardingData - Updated onboarding flow data
   * @returns Promise<OnboardingFlow | null>
   */
  async updateOnboardingFlow(id: number, onboardingData: OnboardingFlowRequest): Promise<OnboardingFlow | null> {
    try {
      // Convert arrays to JSON strings for backend
      const backendData: OnboardingFlow = {
        id,
        userId: onboardingData.userId,
        firstName: onboardingData.firstName,
        generation: onboardingData.generation,
        gender: onboardingData.gender,
        selectedPersonality: onboardingData.selectedPersonality,
        personalityCategory: onboardingData.personalityCategory,
        personalityDescription: onboardingData.personalityDescription,
        personalityImage: onboardingData.personalityImage,
        personalityAchievements: JSON.stringify(onboardingData.personalityAchievements),
        selectedHabits: JSON.stringify(onboardingData.selectedHabits),
        generatedHabits: JSON.stringify(onboardingData.generatedHabits),
        generatedGoals: JSON.stringify(onboardingData.generatedGoals),
        currentStep: onboardingData.currentStep || 0,
        totalSteps: onboardingData.totalSteps || 2,
        isCompleted: onboardingData.isCompleted || false,
        skippedPersonality: onboardingData.skippedPersonality || false
      };

      const response: ApiResponse<OnboardingFlow> = await api.put<OnboardingFlow>(`/onboarding/${id}`, backendData);
      return response.data;
    } catch (error: any) {
      console.error('Update onboarding flow error:', error);
      return null;
    }
  }

  /**
   * Get all onboarding flows
   * @returns Promise<OnboardingFlow[]>
   */
  async getAllOnboardingFlows(): Promise<OnboardingFlow[]> {
    try {
      const response: ApiResponse<OnboardingFlow[]> = await api.get<OnboardingFlow[]>('/onboarding');
      return response.data;
    } catch (error: any) {
      console.error('Get all onboarding flows error:', error);
      return [];
    }
  }

  /**
   * Delete onboarding flow
   * @param id - Onboarding flow ID
   * @returns Promise<boolean>
   */
  async deleteOnboardingFlow(id: number): Promise<boolean> {
    try {
      await api.delete(`/onboarding/${id}`);
      return true;
    } catch (error: any) {
      console.error('Delete onboarding flow error:', error);
      return false;
    }
  }

  /**
   * Validate onboarding data
   * @param onboardingData - Onboarding flow data to validate
   * @returns Validation result
   */
  validateOnboardingData(onboardingData: OnboardingFlowRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!onboardingData.userId) {
      errors.push('User ID is required');
    }

    if (!onboardingData.firstName || onboardingData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!onboardingData.generation || onboardingData.generation.trim().length === 0) {
      errors.push('Generation is required');
    }

    if (!onboardingData.gender || onboardingData.gender.trim().length === 0) {
      errors.push('Gender is required');
    }

    if (!onboardingData.selectedPersonality || onboardingData.selectedPersonality.trim().length === 0) {
      errors.push('Selected personality is required');
    }

    if (!onboardingData.personalityCategory || onboardingData.personalityCategory.trim().length === 0) {
      errors.push('Personality category is required');
    }

    if (!onboardingData.personalityDescription || onboardingData.personalityDescription.trim().length === 0) {
      errors.push('Personality description is required');
    }

    if (!onboardingData.personalityImage || onboardingData.personalityImage.trim().length === 0) {
      errors.push('Personality image is required');
    }

    if (!onboardingData.selectedHabits || onboardingData.selectedHabits.length === 0) {
      errors.push('At least one habit must be selected');
    }

    if (!onboardingData.generatedHabits || onboardingData.generatedHabits.length === 0) {
      errors.push('Generated habits are required');
    }

    if (!onboardingData.generatedGoals || onboardingData.generatedGoals.length === 0) {
      errors.push('Generated goals are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const onboardingService = OnboardingService.getInstance();
