import { api, ApiResponse } from './api';

// Habit types based on the backend Habit model
export interface Habit {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category?: string;
  goalId?: number;
  suggestions?: string;
  scheduleType?: string;
  scheduleDetails?: string;
  startDate: string;
  endDate?: string;
  status: string;
  streak: number;
  completedToday: boolean;
  targetTime?: string;
  weeklyTarget: number;
  currentWeekCompleted: number;
  targetDuration?: number; // Number of days needed to complete the habit
  createdAt: string;
  updatedAt: string;
}

// Frontend Habit interface for compatibility with existing components
export interface FrontendHabit {
  id: string;
  title: string;
  description: string;
  streak: number;
  completedToday: boolean;
  targetTime?: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social';
  habitType?: 'good' | 'bad';
  aiSuggestion?: string;
  weeklyTarget?: number;
  currentWeekCompleted?: number;
  bestStreak?: number;
  completionRate?: number;
  targetDuration?: number; // Number of days needed to complete the habit
  isCompleted?: boolean; // Whether the habit has reached its target duration
  badHabitDetails?: {
    frequency: number;
    frequencyUnit: 'times_per_day' | 'times_per_week';
    timeOfDay: string[];
    triggers: string[];
    severity: 'low' | 'medium' | 'high';
    impact: string;
  };
  aiGenerated?: boolean;
  sourcePersonality?: string;
  reminder?: {
    enabled: boolean;
    time: string;
    frequency: 'daily' | 'weekly' | 'custom';
    daysOfWeek?: number[];
    customInterval?: number;
    customUnit?: 'days' | 'weeks' | 'months';
  };
}

export interface HabitResponse {
  habits: Habit[];
  success: boolean;
  message?: string;
}

export interface HabitCreateRequest {
  userId: number;
  title: string;
  description?: string;
  category?: string;
  goalId?: number;
  suggestions?: string;
  scheduleType?: string;
  scheduleDetails?: string;
  startDate: string;
  endDate?: string;
  status?: string;
  targetTime?: string;
  weeklyTarget?: number;
  targetDuration?: number; // Number of days needed to complete the habit
}

export interface HabitUpdateRequest {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  goalId?: number;
  suggestions?: string;
  scheduleType?: string;
  scheduleDetails?: string;
  endDate?: string;
  status?: string;
  streak?: number;
  completedToday?: boolean;
  targetTime?: string;
  weeklyTarget?: number;
  currentWeekCompleted?: number;
}

// Habit Service Class
export class HabitService {
  private static instance: HabitService;

  private constructor() {}

  public static getInstance(): HabitService {
    if (!HabitService.instance) {
      HabitService.instance = new HabitService();
    }
    return HabitService.instance;
  }

  /**
   * Get habits by user ID
   * @param userId - User ID
   * @returns Promise<HabitResponse>
   */
  async getHabitsByUserId(userId: number): Promise<HabitResponse> {
    try {
      console.log('habitService.getHabitsByUserId called with userId:', userId);
      console.log('Making API call to:', `/habits/user/${userId}`);
      
      const response: ApiResponse<Habit[]> = await api.get<Habit[]>(`/habits/user/${userId}`);
      
      console.log('API response received:', response);
      console.log('API response data:', response.data);
      console.log('API response data type:', typeof response.data);
      console.log('API response data is array:', Array.isArray(response.data));
      
      // Handle different possible response structures
      let habitsArray: Habit[] = [];
      
      if (Array.isArray(response.data)) {
        habitsArray = response.data;
      } else if (response.data && Array.isArray(response.data.habits)) {
        habitsArray = response.data.habits;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        habitsArray = response.data.data;
      } else {
        console.warn('Unexpected response structure:', response.data);
        habitsArray = [];
      }
      
      console.log('Processed habits array:', habitsArray);
      
      return {
        habits: habitsArray,
        success: true,
        message: 'Habits retrieved successfully'
      };
    } catch (error: any) {
      console.error('Get habits error:', error);
      console.error('Error details:', error.response?.data);
      

      
      return {
        habits: [],
        success: false,
        message: error.response?.data?.message || 'Failed to retrieve habits'
      };
    }
  }

  /**
   * Create a new habit
   * @param habitData - Habit creation data
   * @returns Promise<HabitResponse>
   */
  async createHabit(habitData: HabitCreateRequest): Promise<HabitResponse> {
    try {
      const response: ApiResponse<Habit> = await api.post<Habit>('/habits', habitData);
      
      return {
        habits: [response.data],
        success: true,
        message: 'Habit created successfully'
      };
    } catch (error: any) {
      console.error('Create habit error:', error);
      

      
      return {
        habits: [],
        success: false,
        message: error.response?.data?.message || 'Failed to create habit'
      };
    }
  }

  /**
   * Update an existing habit
   * @param habitData - Habit update data
   * @returns Promise<HabitResponse>
   */
  async updateHabit(habitData: HabitUpdateRequest): Promise<HabitResponse> {
    try {
      console.log('habitService.updateHabit called with:', habitData);
      console.log('Making API call to:', `/habits/${habitData.id}`);
      
      const response: ApiResponse<Habit> = await api.put<Habit>(`/habits/${habitData.id}`, habitData);
      
      console.log('Update habit API response:', response);
      
      return {
        habits: [response.data],
        success: true,
        message: 'Habit updated successfully'
      };
    } catch (error: any) {
      console.error('Update habit error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      

      
      return {
        habits: [],
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update habit'
      };
    }
  }

  /**
   * Delete a habit
   * @param habitId - Habit ID
   * @returns Promise<HabitResponse>
   */
  async deleteHabit(habitId: number): Promise<HabitResponse> {
    try {
      await api.delete(`/habits/${habitId}`);
      
      return {
        habits: [],
        success: true,
        message: 'Habit deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete habit error:', error);
      

      
      return {
        habits: [],
        success: false,
        message: error.response?.data?.message || 'Failed to delete habit'
      };
    }
  }

  /**
   * Toggle habit completion for today
   * @param habitId - Habit ID
   * @param completedToday - Whether habit is completed today
   * @returns Promise<HabitResponse>
   */
  async toggleHabitCompletion(habitId: number, completedToday: boolean): Promise<HabitResponse> {
    try {
      console.log('toggleHabitCompletion called with:', { habitId, completedToday });
      
      // Try different approaches to update habit completion
      let response: ApiResponse<Habit>;
      
      try {
        // First try: Use PATCH request with minimal data
        response = await api.patch<Habit>(`/habits/${habitId}/toggle`, {
          completedToday
        });
      } catch (patchError) {
        console.log('PATCH /toggle failed, trying PUT with minimal data');
        
        try {
          // Second try: Use PUT with minimal data
          response = await api.put<Habit>(`/habits/${habitId}`, {
            completedToday
          });
        } catch (putError) {
          console.log('PUT with minimal data failed, trying PUT with full habit data');
          
          // Third try: Use PUT with full habit data (fallback)
          response = await api.put<Habit>(`/habits/${habitId}`, {
            completedToday,
            status: 'active' // Ensure status is set
          });
        }
      }
      
      console.log('Toggle completion response:', response);
      
      return {
        habits: [response.data],
        success: true,
        message: 'Habit completion updated successfully'
      };
    } catch (error: any) {
      console.error('Toggle habit completion error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      

      
      return {
        habits: [],
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update habit completion'
      };
    }
  }

  /**
   * Convert backend Habit to frontend Habit format
   * @param habit - Backend habit object
   * @returns FrontendHabit
   */
  convertToFrontendHabit(habit: Habit): FrontendHabit {
    // Parse suggestions JSON if it exists
    let aiSuggestion: string | undefined;
    if (habit.suggestions) {
      try {
        const suggestions = JSON.parse(habit.suggestions);
        aiSuggestion = suggestions.tips?.[0] || suggestions.advice || suggestions.message;
      } catch (e) {
        aiSuggestion = habit.suggestions;
      }
    }

    // Parse schedule details JSON if it exists
    let reminder: FrontendHabit['reminder'] = {
      enabled: false,
      time: '09:00',
      frequency: 'daily',
      daysOfWeek: [1, 2, 3, 4, 5],
      customInterval: 1,
      customUnit: 'days'
    };
    if (habit.scheduleDetails) {
      try {
        const scheduleDetails = JSON.parse(habit.scheduleDetails);
        reminder = {
          enabled: true,
          time: scheduleDetails.time || '09:00',
          frequency: scheduleDetails.frequency || 'daily',
          daysOfWeek: scheduleDetails.days || [1, 2, 3, 4, 5],
          customInterval: scheduleDetails.interval || 1,
          customUnit: scheduleDetails.unit || 'days'
        };
      } catch (e) {
        // fallback to default above
      }
    }

    // Determine habit type based on category or other indicators
    const habitType: 'good' | 'bad' = this.determineHabitType(habit);

    // Calculate completion rate based on streak and weekly target
    const weeklyTarget = habit.weeklyTarget ?? 7;
    const currentWeekCompleted = habit.currentWeekCompleted ?? 0;
    const completionRate = weeklyTarget > 0 
      ? Math.round((currentWeekCompleted / weeklyTarget) * 100)
      : 0;

    // Use user-defined target duration or default to 7 days
    const targetDuration = habit.targetDuration || 7;

    // Calculate if habit is completed based on target duration
    const isCompleted = habit.streak >= targetDuration;

    // Provide all fields with safe defaults
    return {
      id: habit.id.toString(),
      title: habit.title,
      description: habit.description || '',
      streak: habit.streak ?? 0,
      completedToday: habit.completedToday ?? false,
      targetTime: habit.targetTime || '',
      category: this.mapCategory(habit.category),
      habitType,
      aiSuggestion,
      weeklyTarget,
      currentWeekCompleted,
      bestStreak: habit.streak ?? 0,
      completionRate,
      targetDuration,
      isCompleted,
      aiGenerated: false, // This would need to be determined from backend data
      reminder,
      badHabitDetails: habitType === 'bad' ? {
        frequency: 0,
        frequencyUnit: 'times_per_day',
        timeOfDay: [],
        triggers: [],
        severity: 'low',
        impact: ''
      } : undefined,
      sourcePersonality: undefined
    };
  }

  /**
   * Convert frontend Habit to backend Habit format
   * @param habit - Frontend habit object
   * @param userId - User ID
   * @returns HabitCreateRequest
   */
  convertToBackendHabit(habit: FrontendHabit, userId: number): HabitCreateRequest {
    const suggestions = habit.aiSuggestion ? JSON.stringify({ tips: [habit.aiSuggestion] }) : undefined;
    
    let scheduleDetails: string | undefined;
    if (habit.reminder?.enabled) {
      scheduleDetails = JSON.stringify({
        time: habit.reminder.time,
        frequency: habit.reminder.frequency,
        days: habit.reminder.daysOfWeek,
        interval: habit.reminder.customInterval,
        unit: habit.reminder.customUnit
      });
    }

    return {
      userId,
      title: habit.title,
      description: habit.description,
      category: habit.category,
      scheduleType: habit.reminder?.frequency || 'daily',
      scheduleDetails,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      targetTime: habit.targetTime,
      weeklyTarget: habit.weeklyTarget || 7,
      targetDuration: habit.targetDuration || 7,
      suggestions
    };
  }

  /**
   * Determine habit type based on category and other factors
   * @param habit - Backend habit object
   * @returns 'good' | 'bad'
   */
  private determineHabitType(habit: Habit): 'good' | 'bad' {
    // This is a simple heuristic - in a real app, this might be stored explicitly
    const badHabitKeywords = ['smoking', 'drinking', 'procrastination', 'junk food', 'social media'];
    const habitTitle = habit.title.toLowerCase();
    
    return badHabitKeywords.some(keyword => habitTitle.includes(keyword)) ? 'bad' : 'good';
  }

  /**
   * Map backend category to frontend category
   * @param category - Backend category string
   * @returns Frontend category
   */
  private mapCategory(category?: string): 'health' | 'productivity' | 'mindfulness' | 'social' {
    if (!category) return 'health';
    
    const categoryMap: { [key: string]: 'health' | 'productivity' | 'mindfulness' | 'social' } = {
      'Health': 'health',
      'Productivity': 'productivity',
      'Mindfulness': 'mindfulness',
      'Social': 'social',
      'health': 'health',
      'productivity': 'productivity',
      'mindfulness': 'mindfulness',
      'social': 'social'
    };
    
    return categoryMap[category] || 'health';
  }
}

// Export singleton instance
export const habitService = HabitService.getInstance(); 