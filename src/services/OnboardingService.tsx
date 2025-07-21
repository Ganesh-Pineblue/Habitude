import { api, ApiResponse } from './api';

// Onboarding types based on the backend OnboardingFlow model
export interface OnboardingFlow {
  id?: number;
  userId: number;
  firstName: string;
  ageGroup: string;
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
  ageGroup: string;
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
        ...onboardingData,
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
    } catch (error) {
      console.error('Error creating onboarding flow:', error);
      return {
        onboardingFlow: {} as OnboardingFlow,
        success: false,
        message: 'Network error occurred'
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
      
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching onboarding flow:', error);
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
      
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user onboarding flow:', error);
      return null;
    }
  }

  /**
   * Update onboarding flow
   * @param id - Onboarding flow ID
   * @param onboardingData - Updated onboarding data
   * @returns Promise<OnboardingFlow | null>
   */
  async updateOnboardingFlow(id: number, onboardingData: OnboardingFlowRequest): Promise<OnboardingFlow | null> {
    try {
      // Convert arrays to JSON strings for backend
      const backendData: OnboardingFlow = {
        userId: onboardingData.userId,
        firstName: onboardingData.firstName,
        ageGroup: onboardingData.ageGroup,
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
      
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating onboarding flow:', error);
      return null;
    }
  }

  /**
   * Get all onboarding flows (admin only)
   * @returns Promise<OnboardingFlow[]>
   */
  async getAllOnboardingFlows(): Promise<OnboardingFlow[]> {
    try {
      const response: ApiResponse<OnboardingFlow[]> = await api.get<OnboardingFlow[]>('/onboarding');
      
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching all onboarding flows:', error);
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
      const response: ApiResponse<void> = await api.delete<void>(`/onboarding/${id}`);
      
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting onboarding flow:', error);
      return false;
    }
  }

  /**
   * Validate onboarding data
   * @param onboardingData - Onboarding data to validate
   * @returns Validation result
   */
  validateOnboardingData(onboardingData: OnboardingFlowRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!onboardingData.userId || onboardingData.userId <= 0) {
      errors.push('Valid user ID is required');
    }

    if (!onboardingData.firstName || onboardingData.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!onboardingData.ageGroup || onboardingData.ageGroup.trim().length === 0) {
      errors.push('Age group is required');
    }

    if (!onboardingData.gender || onboardingData.gender.trim().length === 0) {
      errors.push('Gender is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const onboardingService = OnboardingService.getInstance();
