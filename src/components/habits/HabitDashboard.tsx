import { useState, useEffect, useCallback, useMemo } from 'react';
import { HabitCard } from './HabitCard';
import { HabitChallenges } from './HabitChallenges';
import { SocialSharing } from '../social/SocialSharing';
import { AccountabilityBuddies } from '../gamification/AccountabilityBuddies';
import { AIMotivator } from '../ai/AIMotivator';
import { habitService, type FrontendHabit } from '../../services/habitService';
import { useUser } from '../../contexts/UserContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target, Plus, CalendarDays, Sparkles, AlertTriangle, Activity, Trophy, Users, Share2, UserPlus, Brain, Facebook, Twitter, Instagram, Linkedin, Heart, CheckCircle2, Flame, Bell, TrendingUp, CheckCircle, Stethoscope, Video } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';

// Using FrontendHabit from the service instead of local interface

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'fitness';
  priority: 'low' | 'medium' | 'high';
  aiGenerated?: boolean;
  sourceHabit?: string;
}

// Utility function to check if user is 45 or older
const isUser45OrOlder = (ageGroup?: string): boolean => {
  if (!ageGroup) return false;
  
  // Age groups that represent 45 years and above
  const ageGroups45Plus = [
    'mid-forties',      // 45-49
    'early-fifties',    // 50-54
    'mid-fifties',      // 55-59
    'sixties',          // 60-69
    'seventies-plus'    // 70+
  ];
  
  return ageGroups45Plus.includes(ageGroup);
};

export const HabitDashboard = ({ 
  tabValue = 'habits', 
  onTabChange,
  initialHabits = [],
  onHabitsUpdate,
  onGoalGenerated
}: { 
  tabValue?: string; 
  onTabChange?: (value: string) => void;
  initialHabits?: any[];
  onHabitsUpdate?: (habits: any[]) => void;
  onGoalGenerated?: (goal: Goal) => void;
} = {}) => {
  const { currentUser } = useUser();
  const [habits, setHabits] = useState<FrontendHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch habits from API when user is available
  useEffect(() => {
    const fetchHabits = async () => {
      console.log('Fetching habits for user:', currentUser?.id);
      console.log('Current user object:', currentUser);
      
      if (!currentUser?.id) {
        console.log('No user ID available, skipping habit fetch');
        console.log('Current user state:', currentUser);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Calling habitService.getHabitsByUserId with user ID:', currentUser.id);
        const response = await habitService.getHabitsByUserId(currentUser.id);
        
        console.log('Habit service response:', response);
        console.log('Response habits:', response.habits);
        console.log('Response habits type:', typeof response.habits);
        console.log('Response habits is array:', Array.isArray(response.habits));
        
        if (response.success && response.habits && Array.isArray(response.habits)) {
          // Convert backend habits to frontend format
          const frontendHabits = response.habits.map(habit => 
            habitService.convertToFrontendHabit(habit)
          );
          console.log('Converted frontend habits:', frontendHabits);
          setHabits(frontendHabits);
        } else {
          console.error('Habit service returned error or invalid data:', response);
          console.error('Response structure:', {
            success: response.success,
            habits: response.habits,
            habitsType: typeof response.habits,
            isArray: Array.isArray(response.habits)
          });
          
          // Try to use initialHabits as fallback
          if (initialHabits.length > 0) {
            console.log('Using initial habits as fallback');
            setHabits(initialHabits);
          } else {
            setError(response.message || 'Failed to fetch habits - invalid response format');
          }
        }
      } catch (error) {
        console.error('Error fetching habits:', error);
        console.error('Error details:', error);
        
        // Try to use initialHabits as fallback
        if (initialHabits.length > 0) {
          console.log('Using initial habits as fallback due to error');
          setHabits(initialHabits);
        } else {
          setError('Failed to fetch habits. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [currentUser?.id]); // Removed initialHabits from dependencies

  // Notify parent component when habits change
  useEffect(() => {
    if (onHabitsUpdate) {
      onHabitsUpdate(habits);
    }
  }, [habits, onHabitsUpdate]);

  const [currentMood] = useState<number>(4);
  const [habitsView, setHabitsView] = useState<'ongoing' | 'completed'>('ongoing');
  const [editingHabit, setEditingHabit] = useState<FrontendHabit | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [schedulingHabit, setSchedulingHabit] = useState<FrontendHabit | null>(null);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    targetTime: '',
    category: 'health' as 'health' | 'productivity' | 'mindfulness' | 'social',
    habitType: 'good' as 'good' | 'bad',
    weeklyTarget: 7,
    targetDuration: undefined as number | undefined, // User must set their own target duration
    badHabitDetails: {
      frequency: 0,
      frequencyUnit: 'times_per_day' as 'times_per_day' | 'times_per_week',
      timeOfDay: [] as string[],
      triggers: [] as string[],
      severity: 'low' as 'low' | 'medium' | 'high',
      impact: ''
    },
    reminder: {
      enabled: false,
      time: '09:00',
      frequency: 'daily' as 'daily' | 'weekly' | 'custom',
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday by default
      customInterval: 1,
      customUnit: 'days' as 'days' | 'weeks' | 'months'
    }
  });

  const addHabit = useCallback(async () => {
    if (!currentUser?.id) {
      alert('Please log in to add habits');
      return;
    }

    // Validate required fields
    if (!newHabit.title.trim()) {
      alert('Please enter a habit title');
      return;
    }

    if (!newHabit.targetDuration || newHabit.targetDuration < 1) {
      alert('Please set a target duration (minimum 1 day)');
      return;
    }

    try {
      // Create a proper FrontendHabit object with required properties
      const frontendHabit: FrontendHabit = {
        ...newHabit,
        id: 'temp-' + Date.now(), // Temporary ID for conversion
        streak: 0,
        completedToday: false
      };
      const habitData = habitService.convertToBackendHabit(frontendHabit, currentUser.id);
      const response = await habitService.createHabit(habitData);
      
      if (response.success) {
        const newHabitFrontend = habitService.convertToFrontendHabit(response.habits[0]);
        setHabits(prevHabits => [...prevHabits, newHabitFrontend]);
        
        // Reset form
        setNewHabit({
          title: '',
          description: '',
          targetTime: '',
          category: 'health',
          habitType: 'good',
          weeklyTarget: 7,
          targetDuration: undefined,
          badHabitDetails: {
            frequency: 0,
            frequencyUnit: 'times_per_day',
            timeOfDay: [],
            triggers: [],
            severity: 'low',
            impact: ''
          },
          reminder: {
            enabled: false,
            time: '09:00',
            frequency: 'daily',
            daysOfWeek: [1, 2, 3, 4, 5],
            customInterval: 1,
            customUnit: 'days'
          }
        });
        setShowAddForm(false);
      } else {
        alert(response.message || 'Failed to create habit');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Please try again.');
    }
  }, [currentUser?.id, newHabit]);

  // Function to add a habit from suggestions
  const addHabitFromSuggestion = useCallback(async (newHabit: FrontendHabit) => {
    if (!currentUser?.id) {
      alert('Please log in to add habits');
      return;
    }

    try {
      // The newHabit parameter is already a FrontendHabit, so we can use it directly
      const habitData = habitService.convertToBackendHabit(newHabit, currentUser.id);
      const response = await habitService.createHabit(habitData);
      
      if (response.success) {
        const newHabitFrontend = habitService.convertToFrontendHabit(response.habits[0]);
        setHabits(prevHabits => [...prevHabits, newHabitFrontend]);
      } else {
        alert(response.message || 'Failed to create habit');
      }
    } catch (error) {
      console.error('Error creating habit from suggestion:', error);
      alert('Failed to create habit. Please try again.');
    }
  }, [currentUser?.id]);

  const updateHabit = useCallback(async (updatedHabit: FrontendHabit) => {
    try {
      // Validate habit ID
      const habitId = parseInt(updatedHabit.id);
      if (isNaN(habitId)) {
        console.error('Invalid habit ID:', updatedHabit.id);
        alert('Invalid habit ID. Please try again.');
        return;
      }

      const habitData = {
        id: habitId,
        title: updatedHabit.title,
        description: updatedHabit.description,
        category: updatedHabit.category,
        targetTime: updatedHabit.targetTime,
        weeklyTarget: updatedHabit.weeklyTarget,
        targetDuration: updatedHabit.targetDuration,
        scheduleType: updatedHabit.reminder?.frequency || 'daily',
        scheduleDetails: updatedHabit.reminder?.enabled ? JSON.stringify({
          time: updatedHabit.reminder.time,
          frequency: updatedHabit.reminder.frequency,
          days: updatedHabit.reminder.daysOfWeek,
          interval: updatedHabit.reminder.customInterval,
          unit: updatedHabit.reminder.customUnit
        }) : undefined
      };

      console.log('Updating habit with data:-------------------------', habitData);

      const response = await habitService.updateHabit(habitData);
      
      if (response.success) {
        // Update local state with the updated habit (preserving frontend fields)
        setHabits(prevHabits => prevHabits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        setEditingHabit(null);
      } else {
        console.error('Backend returned error:', response.message);
        // Fallback: update local state even if backend fails
        console.log('Backend update failed, updating local state as fallback');
        setHabits(prevHabits => prevHabits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        setEditingHabit(null);
        alert('Habit updated locally (backend connection issue). Please refresh to sync with server.');
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      alert('Failed to update habit. Please try again.');
    }
  }, []);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      const response = await habitService.deleteHabit(parseInt(habitId));
      
      if (response.success) {
        setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
      } else {
        alert(response.message || 'Failed to delete habit');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  }, []);

  const toggleHabit = useCallback(async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      console.log('Toggling habit:', habit.title, 'from', habit.completedToday, 'to', !habit.completedToday);

      // Try the main toggle method first
      let response = await habitService.toggleHabitCompletion(
        parseInt(habitId), 
        !habit.completedToday
      );
      
      console.log('Toggle response:', response);
      
      // If main method fails, try the simple toggle method
      if (!response.success) {
        console.log('Main toggle failed, trying simple toggle method');
        response = await habitService.simpleToggleHabitCompletion(
          parseInt(habitId), 
          !habit.completedToday
        );
        console.log('Simple toggle response:', response);
      }
      
      if (response.success) {
        const updatedHabit = habitService.convertToFrontendHabit(response.habits[0]);
        setHabits(prevHabits => prevHabits.map(h => h.id === habitId ? updatedHabit : h));
        console.log('Habit toggled successfully');
      } else {
        console.error('Backend returned error:', response.message);
        // Fallback: update local state even if backend fails
        console.log('Backend toggle failed, updating local state as fallback');
        const updatedHabit = { ...habit, completedToday: !habit.completedToday };
        setHabits(prevHabits => prevHabits.map(h => h.id === habitId ? updatedHabit : h));
        
        // Show a more user-friendly message
        console.log('Habit updated locally due to backend connection issue');
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      console.error('Error details:', error);
      
      // Fallback: update local state even if backend fails
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        console.log('Updating local state as fallback due to error');
        const updatedHabit = { ...habit, completedToday: !habit.completedToday };
        setHabits(prevHabits => prevHabits.map(h => h.id === habitId ? updatedHabit : h));
        console.log('Habit updated locally due to error');
      } else {
        console.error('Failed to find habit for local update');
      }
    }
  }, [habits]);

  // Separate AI-generated and user-created habits
  const aiGeneratedHabits = useMemo(() => habits.filter(h => h.aiGenerated), [habits]);
  const userCreatedHabits = useMemo(() => habits.filter(h => !h.aiGenerated), [habits]);
  
  // Separate bad habits
  const badHabits = useMemo(() => habits.filter(h => h.habitType === 'bad'), [habits]);

  // Function to get positive habit alternatives for bad habits
  const getPositiveHabitAlternatives = (badHabitTitle: string, badHabitCategory: string) => {
    const alternatives: { [key: string]: { title: string; description: string; category: string }[] } = {
      'smoking': [
        { title: 'Deep Breathing Exercise', description: 'Take 5 deep breaths when you feel the urge to smoke', category: 'health' },
        { title: 'Drink a Glass of Water', description: 'Hydrate yourself instead of smoking', category: 'health' },
        { title: 'Take a Short Walk', description: 'Go for a 5-minute walk to distract yourself', category: 'health' },
        { title: 'Chew Gum', description: 'Chew sugar-free gum when you crave a cigarette', category: 'health' }
      ],
      'drinking': [
        { title: 'Drink Water Instead', description: 'Replace alcoholic drinks with water or herbal tea', category: 'health' },
        { title: 'Call a Friend', description: 'Reach out to a friend for support', category: 'social' },
        { title: 'Go for a Walk', description: 'Take a walk to clear your mind', category: 'health' }
      ],
      'junk food': [
        { title: 'Healthy Snack Alternative', description: 'Choose fruits, nuts, or healthy snacks instead of junk food', category: 'health' },
        { title: 'Drink Water', description: 'Drink a glass of water before snacking', category: 'health' },
        { title: 'Eat a Salad', description: 'Prepare a fresh salad as a snack', category: 'health' }
      ],
      'procrastination': [
        { title: '5-Minute Rule', description: 'Start any task for just 5 minutes to overcome procrastination', category: 'productivity' },
        { title: 'Make a To-Do List', description: 'Write down your tasks and pick one to start', category: 'productivity' },
        { title: 'Set a Timer for 10 Minutes', description: 'Work on a task for just 10 minutes', category: 'productivity' }
      ],
      'social media': [
        { title: 'Digital Detox Time', description: 'Spend time reading, meditating, or connecting with people in person', category: 'mindfulness' },
        { title: 'Read a Book', description: 'Pick up a book instead of scrolling', category: 'productivity' },
        { title: 'Go for a Walk', description: 'Take a walk outside without your phone', category: 'health' }
      ],
      'negative thinking': [
        { title: "Gratitude Practice", description: "Write down 3 things you're grateful for when negative thoughts arise", category: "mindfulness" },
        { title: "Positive Affirmations", description: "Say a positive affirmation out loud", category: "mindfulness" },
        { title: "Smile at Yourself", description: "Smile in the mirror to boost your mood", category: "mindfulness" }
      ],
      'overspending': [
        { title: 'Mindful Spending', description: 'Wait 24 hours before making non-essential purchases', category: 'productivity' },
        { title: 'Track Your Expenses', description: 'Write down every purchase for a week', category: 'productivity' },
        { title: 'Set a Savings Goal', description: 'Set aside a small amount for savings', category: 'productivity' }
      ],
      'skipping exercise': [
        { title: 'Quick Movement Break', description: 'Do 10 jumping jacks or take a 5-minute walk', category: 'health' },
        { title: 'Stretch for 5 Minutes', description: 'Do a short stretching routine', category: 'health' },
        { title: 'Dance to a Song', description: 'Put on your favorite song and dance', category: 'health' }
      ],
      'staying up late': [
        { title: 'Bedtime Routine', description: 'Create a relaxing bedtime routine to improve sleep', category: 'health' },
        { title: 'Read Before Bed', description: 'Read a book instead of using screens', category: 'mindfulness' },
        { title: 'Meditate for 10 Minutes', description: 'Do a short meditation before sleep', category: 'mindfulness' }
      ],
      'complaining': [
        { title: 'Solution-Focused Thinking', description: 'Instead of complaining, think of one solution to the problem', category: 'mindfulness' },
        { title: 'Gratitude List', description: 'Write down something positive about your day', category: 'mindfulness' },
        { title: 'Compliment Someone', description: 'Say something nice to someone today', category: 'social' }
      ]
    };

    // Try to find a match based on the bad habit title
    const lowerTitle = badHabitTitle.toLowerCase();
    for (const [key, alternativesList] of Object.entries(alternatives)) {
      if (lowerTitle.includes(key)) {
        return alternativesList;
      }
    }

    // Default alternatives based on category
    const defaultAlternatives = {
      'health': [
        { title: 'Healthy Alternative', description: 'Replace this habit with a healthier option', category: 'health' }
      ],
      'productivity': [
        { title: 'Productive Alternative', description: 'Replace this habit with a more productive activity', category: 'productivity' }
      ],
      'mindfulness': [
        { title: 'Mindful Alternative', description: 'Replace this habit with a mindful practice', category: 'mindfulness' }
      ],
      'social': [
        { title: 'Positive Social Habit', description: 'Replace this habit with a positive social interaction', category: 'social' }
      ]
    };

    return defaultAlternatives[badHabitCategory as keyof typeof defaultAlternatives] || defaultAlternatives.health;
  };



  // Function to find paired habits (bad habit + positive alternative)
  const findPairedHabits = () => {
    const pairedHabits: { badHabit: FrontendHabit; positiveHabit: FrontendHabit }[] = [];
    badHabits.forEach(badHabit => {
      const positiveHabit = habits.find(h =>
        h.habitType === 'good' &&
        h.id.includes('_positive') &&
        h.pairedBadHabitId === badHabit.id
      );
      if (positiveHabit) {
        pairedHabits.push({ badHabit, positiveHabit });
      }
    });
    return pairedHabits;
  };

  const pairedHabits = findPairedHabits();

  // Compact Strength Meter Component for inline display
  const CompactStrengthMeter = ({ habit }: { habit: FrontendHabit }) => {
    const calculateStrengthScore = () => {
      const factors = {
        consistency: habit.completionRate || 0,
        streak: Math.min((habit.streak / 30) * 100, 100),
        timing: habit.targetTime ? 100 : 0,
        emotional: habit.completedToday ? 100 : 0,
        weeklyProgress: Math.min((habit.currentWeekCompleted || 0) / (habit.weeklyTarget || 7) * 100, 100)
      };

      const score = (
        factors.consistency * 0.4 +
        factors.streak * 0.25 +
        factors.timing * 0.15 +
        factors.emotional * 0.2 +
        factors.weeklyProgress * 0.2
      );

      return Math.round(score);
    };

    const strengthScore = calculateStrengthScore();
    
    const getStrengthColor = (score: number) => {
      if (score >= 90) return 'text-orange-600 bg-orange-100';
      if (score >= 75) return 'text-purple-600 bg-purple-100';
      if (score >= 50) return 'text-blue-600 bg-blue-100';
      if (score >= 25) return 'text-green-600 bg-green-100';
      return 'text-gray-600 bg-gray-100';
    };

    const getStrengthLevel = (score: number) => {
      if (score >= 90) return 'Identity';
      if (score >= 75) return 'Automatic';
      if (score >= 50) return 'Established';
      if (score >= 25) return 'Rooted';
      return 'Seed';
    };

    return (
      <div className="flex items-center space-x-2 mt-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strengthScore).split(' ')[1]}`}
            style={{ width: `${strengthScore}%` }}
          />
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStrengthColor(strengthScore)}`}>
          {strengthScore}%
        </div>
        <div className="text-xs text-gray-500">
          {getStrengthLevel(strengthScore)}
        </div>
      </div>
    );
  };

  // Goal Generation Service for Individual Habits
  class IndividualHabitGoalService {
    private static instance: IndividualHabitGoalService;
    
    static getInstance(): IndividualHabitGoalService {
      if (!IndividualHabitGoalService.instance) {
        IndividualHabitGoalService.instance = new IndividualHabitGoalService();
      }
      return IndividualHabitGoalService.instance;
    }

    generateGoalForHabit(habit: FrontendHabit): Goal {
      const habitTitle = habit.title.toLowerCase();
      const habitCategory = habit.category;
      
      // Generate complementary goals based on habit category
      const complementaryGoals = this.getComplementaryGoalsForCategory(habitCategory, habitTitle);
      
      // Select a random complementary goal
      const selectedGoal = complementaryGoals[Math.floor(Math.random() * complementaryGoals.length)];
      
      return {
        ...selectedGoal,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        aiGenerated: true,
        sourceHabit: habit.title,
        createdAt: new Date().toISOString()
      };
    }

    private getComplementaryGoalsForCategory(category: string, habitTitle: string): any[] {
      const goals: any[] = [];
      
      switch (category) {
        case 'health':
          goals.push(
            {
              title: 'Complete a 30-Day Fitness Challenge',
              description: `Build on your "${habitTitle}" habit by taking on a comprehensive fitness challenge`,
              target: 30,
              current: 0,
              unit: 'days',
              deadline: this.getFutureDate(45),
              category: 'fitness' as const,
              priority: 'high' as const
            },
            {
              title: 'Achieve 10,000 Steps Daily for 21 Days',
              description: 'Enhance your physical activity with a consistent step count goal',
              target: 21,
              current: 0,
              unit: 'days',
              deadline: this.getFutureDate(30),
              category: 'health' as const,
              priority: 'medium' as const
            },
            {
              title: 'Improve Sleep Quality Score to 85+',
              description: 'Track and optimize your sleep quality for better overall health',
              target: 85,
              current: 0,
              unit: 'sleep score',
              deadline: this.getFutureDate(90),
              category: 'health' as const,
              priority: 'high' as const
            },
            {
              title: 'Complete 3 Different Types of Workouts',
              description: 'Diversify your exercise routine with strength, cardio, and flexibility training',
              target: 3,
              current: 0,
              unit: 'workout types',
              deadline: this.getFutureDate(60),
              category: 'fitness' as const,
              priority: 'medium' as const
            },
            {
              title: 'Run Your First 5K Race',
              description: 'Train for and complete a 5K race to challenge your fitness level',
              target: 1,
              current: 0,
              unit: 'races',
              deadline: this.getFutureDate(120),
              category: 'fitness' as const,
              priority: 'medium' as const
            }
          );
          break;
          
        case 'mindfulness':
          goals.push(
            {
              title: 'Complete a 7-Day Digital Detox',
              description: 'Enhance your mindfulness practice by taking a break from screens',
              target: 7,
              current: 0,
              unit: 'days',
              deadline: this.getFutureDate(30),
              category: 'mindfulness' as const,
              priority: 'medium' as const
            },
            {
              title: 'Learn 3 New Breathing Techniques',
              description: 'Expand your mindfulness toolkit with different breathing exercises',
              target: 3,
              current: 0,
              unit: 'techniques',
              deadline: this.getFutureDate(60),
              category: 'mindfulness' as const,
              priority: 'medium' as const
            },
            {
              title: 'Write 50 Gratitude Letters',
              description: 'Express gratitude to people who have positively impacted your life',
              target: 50,
              current: 0,
              unit: 'letters',
              deadline: this.getFutureDate(180),
              category: 'mindfulness' as const,
              priority: 'medium' as const
            },
            {
              title: 'Complete a Mindfulness Course',
              description: 'Deepen your understanding through a structured mindfulness course',
              target: 1,
              current: 0,
              unit: 'courses',
              deadline: this.getFutureDate(90),
              category: 'mindfulness' as const,
              priority: 'high' as const
            },
            {
              title: 'Practice Mindful Eating for 30 Days',
              description: 'Apply mindfulness to your eating habits for better health and awareness',
              target: 30,
              current: 0,
              unit: 'days',
              deadline: this.getFutureDate(45),
              category: 'mindfulness' as const,
              priority: 'medium' as const
            }
          );
          break;
          
        case 'productivity':
          goals.push(
            {
              title: 'Read 12 Books This Year',
              description: 'Expand your knowledge and vocabulary through diverse reading',
              target: 12,
              current: 0,
              unit: 'books',
              deadline: this.getFutureDate(365),
              category: 'productivity' as const,
              priority: 'medium' as const
            },
            {
              title: 'Complete 3 Online Courses',
              description: 'Develop new skills through structured online learning',
              target: 3,
              current: 0,
              unit: 'courses',
              deadline: this.getFutureDate(180),
              category: 'productivity' as const,
              priority: 'high' as const
            },
            {
              title: 'Learn a New Language - Basic Proficiency',
              description: 'Achieve basic conversational skills in a new language',
              target: 1,
              current: 0,
              unit: 'languages',
              deadline: this.getFutureDate(365),
              category: 'productivity' as const,
              priority: 'medium' as const
            },
            {
              title: 'Write 30 Blog Posts or Articles',
              description: 'Share your knowledge and improve your writing skills',
              target: 30,
              current: 0,
              unit: 'posts',
              deadline: this.getFutureDate(180),
              category: 'productivity' as const,
              priority: 'medium' as const
            },
            {
              title: 'Master 5 New Skills',
              description: 'Learn and become proficient in 5 different skills or hobbies',
              target: 5,
              current: 0,
              unit: 'skills',
              deadline: this.getFutureDate(365),
              category: 'productivity' as const,
              priority: 'high' as const
            }
          );
          break;
          
        case 'social':
          goals.push(
            {
              title: 'Volunteer 50 Hours This Year',
              description: 'Give back to your community through regular volunteer work',
              target: 50,
              current: 0,
              unit: 'hours',
              deadline: this.getFutureDate(365),
              category: 'social' as const,
              priority: 'medium' as const
            },
            {
              title: 'Reconnect with 10 Old Friends',
              description: 'Reach out and rebuild connections with people from your past',
              target: 10,
              current: 0,
              unit: 'friends',
              deadline: this.getFutureDate(90),
              category: 'social' as const,
              priority: 'medium' as const
            },
            {
              title: 'Join 3 New Social Groups or Clubs',
              description: 'Expand your social network by joining new communities',
              target: 3,
              current: 0,
              unit: 'groups',
              deadline: this.getFutureDate(120),
              category: 'social' as const,
              priority: 'medium' as const
            },
            {
              title: 'Organize 5 Community Events',
              description: 'Take initiative to bring people together through events',
              target: 5,
              current: 0,
              unit: 'events',
              deadline: this.getFutureDate(180),
              category: 'social' as const,
              priority: 'medium' as const
            },
            {
              title: 'Mentor Someone for 6 Months',
              description: 'Share your knowledge and experience by mentoring another person',
              target: 6,
              current: 0,
              unit: 'months',
              deadline: this.getFutureDate(180),
              category: 'social' as const,
              priority: 'high' as const
            }
          );
          break;
          
        default:
          // Fallback goals for any category
          goals.push(
            {
              title: 'Complete a Personal Development Challenge',
              description: 'Take on a 90-day challenge that combines multiple areas of improvement',
              target: 90,
              current: 0,
              unit: 'days',
              deadline: this.getFutureDate(120),
              category: 'productivity' as const,
              priority: 'high' as const
            },
            {
              title: 'Create a Morning Routine Mastery',
              description: 'Design and perfect a comprehensive morning routine that sets you up for success',
              target: 30,
              current: 0,
              unit: 'days',
              deadline: this.getFutureDate(45),
              category: 'productivity' as const,
              priority: 'high' as const
            },
            {
              title: 'Achieve Work-Life Balance Score of 8/10',
              description: 'Improve your work-life balance through better time management and boundaries',
              target: 8,
              current: 0,
              unit: 'score',
              deadline: this.getFutureDate(90),
              category: 'productivity' as const,
              priority: 'high' as const
            }
          );
      }
      
      return goals;
    }

    private getFutureDate(days: number): string {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    }
  }

  // Function to generate goal for a specific habit
  const generateGoalForHabit = (habit: FrontendHabit) => {
    const goalService = IndividualHabitGoalService.getInstance();
    const generatedGoal = goalService.generateGoalForHabit(habit);
    
    // Notify parent component about the generated goal
    if (onGoalGenerated) {
      onGoalGenerated(generatedGoal);
    }
    
    // Show success notification
    setTimeout(() => {
      alert(`🎯 Goal generated for "${habit.title}"!\n\nGoal: ${generatedGoal.title}\n\nCheck your Goals tab to see the new goal!`);
    }, 100);
  };

  const handleScheduleHabit = (habit: FrontendHabit) => {
    setSchedulingHabit(habit);
  };

  const updateHabitSchedule = async (updatedHabit: FrontendHabit) => {
    try {
      console.log('Updating habit schedule for:', updatedHabit.title);
      console.log('Updated habit data:', updatedHabit);
      
      // Validate habit ID
      const habitId = parseInt(updatedHabit.id);
      if (isNaN(habitId)) {
        console.error('Invalid habit ID:', updatedHabit.id);
        alert('Invalid habit ID. Please try again.');
        return;
      }

      // Convert frontend habit to backend format for API call
      const habitData = {
        id: habitId,
        title: updatedHabit.title,
        description: updatedHabit.description,
        category: updatedHabit.category,
        targetTime: updatedHabit.targetTime,
        weeklyTarget: updatedHabit.weeklyTarget,
        scheduleType: updatedHabit.reminder?.frequency || 'daily',
        scheduleDetails: updatedHabit.reminder?.enabled ? JSON.stringify({
          time: updatedHabit.reminder.time,
          frequency: updatedHabit.reminder.frequency,
          days: updatedHabit.reminder.daysOfWeek,
          interval: updatedHabit.reminder.customInterval,
          unit: updatedHabit.reminder.customUnit
        }) : undefined
      };

      console.log('Sending habit data to backend:', habitData);

      const response = await habitService.updateHabit(habitData);
      
      console.log('Backend response:', response);
      
      if (response.success) {
        // Update local state with the updated habit (preserving frontend fields)
        setHabits(prevHabits => prevHabits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        setSchedulingHabit(null);
        console.log('Habit schedule updated successfully');
      } else {
        console.error('Backend returned error:', response.message);
        // Fallback: update local state even if backend fails
        console.log('Backend update failed, updating local state as fallback');
        setHabits(prevHabits => prevHabits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
        setSchedulingHabit(null);
        alert('Schedule updated locally (backend connection issue). Please refresh to sync with server.');
      }
    } catch (error) {
      console.error('Error updating habit schedule:', error);
      console.error('Error details:', error);
      alert('Failed to update habit schedule. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Loading Habits...</h3>
          <p className="text-gray-600 text-lg">Fetching your habits from the server</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Habits</h3>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-8">


      {/* Enhanced Quick Stats - Integrated */}
      {(() => {
        const completedToday = habits.filter(h => h.completedToday).length;
        const totalHabits = habits.length;
        const completionRate = Math.round((completedToday / totalHabits) * 100);
        const avgStreak = Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length);
        const longestStreak = Math.max(...habits.map(h => h.streak));
        const weeklyCompletion = Math.round(
          habits.reduce((sum, h) => {
            if (h.weeklyTarget && h.currentWeekCompleted !== undefined) {
              return sum + (h.currentWeekCompleted / h.weeklyTarget);
            }
            return sum;
          }, 0) / habits.length * 100
        );

        const stats = [
          {
            label: 'Today\'s Progress',
            value: `${completedToday}/${totalHabits}`,
            subtext: `${completionRate}% complete`,
            icon: Target,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
            textColor: 'text-blue-900',
            subtextColor: 'text-blue-700'
          },
          {
            label: 'Weekly Success',
            value: `${weeklyCompletion}%`,
            subtext: 'This week\'s avg',
            icon: CheckCircle2,
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100',
            textColor: 'text-green-900',
            subtextColor: 'text-green-700'
          },
          {
            label: 'Current Streak',
            value: `${avgStreak} days`,
            subtext: 'Average across all',
            icon: Flame,
            gradient: 'from-orange-500 to-orange-600',
            bgGradient: 'from-orange-50 to-orange-100',
            textColor: 'text-orange-900',
            subtextColor: 'text-orange-700'
          },
          {
            label: 'Best Streak',
            value: `${longestStreak} days`,
            subtext: 'Personal record',
            icon: Activity,
            gradient: 'from-purple-500 to-purple-600',
            bgGradient: 'from-purple-50 to-purple-100',
            textColor: 'text-purple-900',
            subtextColor: 'text-purple-700'
          }
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${stat.subtextColor}`}>{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>
                        <AnimatedNumber 
                          value={stat.value.replace(/[^\d.]/g, '')} 
                          duration={1200} 
                          delay={index * 100} 
                          className={stat.textColor}
                          suffix={stat.value.includes('%') ? '%' : stat.value.includes('days') ? ' days' : ''}
                        />
                      </p>
                      <p className={`text-xs ${stat.subtextColor}`}>{stat.subtext}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })()}
      
      {/* Streak Celebration */}
      {false && habits.some(h => h.streak >= 7) && (
        <Card className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white border-0 shadow-xl animate-pulse">
          <CardContent className="p-6 text-center">
            {/* <div className="flex items-center justify-center space-x-3">
              <Zap className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">🔥 Streak Master! 🔥</h3>
                <p className="text-green-100">You're on fire! Keep the momentum going!</p>
              </div>
              <Zap className="w-8 h-8" />
            </div> */}
          </CardContent>
        </Card>
      )}
      
      {/* Tabbed Content */}
      <Tabs defaultValue="habits" className="w-full" value={tabValue} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
          <TabsTrigger value="habits" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Target className="w-4 h-4" />
            <span>My Habits</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Trophy className="w-4 h-4" />
            <span>Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Share2 className="w-4 h-4" />
            <span>Social</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="habits" className="space-y-6">
          {/* Header Row with Toggle Buttons */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">My Habits</h2>
            
            {/* Toggle Buttons */}
            <div className="bg-gray-100 p-1 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex space-x-1">
                <button
                  onClick={() => setHabitsView('ongoing')}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                    habitsView === 'ongoing'
                      ? 'bg-white text-green-600 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Ongoing</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {habits.filter(h => !h.isCompleted).length}
                  </span>
                </button>
                <button
                  onClick={() => setHabitsView('completed')}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2 ${
                    habitsView === 'completed'
                      ? 'bg-white text-green-600 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {habits.filter(h => h.isCompleted && h.habitType !== 'bad').length}
                  </span>
                </button>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 font-semibold rounded-xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Habit
            </Button>
          </div>

          {/* Add/Edit Form */}
          {(showAddForm || editingHabit) && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Habit title"
                  value={editingHabit ? editingHabit.title : newHabit.title}
                  onChange={(e) => editingHabit 
                    ? setEditingHabit({...editingHabit, title: e.target.value})
                    : setNewHabit({...newHabit, title: e.target.value})
                  }
                  className="border-gray-200"
                />
                <Input
                  placeholder="Description"
                  value={editingHabit ? editingHabit.description : newHabit.description}
                  onChange={(e) => editingHabit 
                    ? setEditingHabit({...editingHabit, description: e.target.value})
                    : setNewHabit({...newHabit, description: e.target.value})
                  }
                  className="border-gray-200"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    placeholder="Target time (optional)"
                    value={editingHabit ? editingHabit.targetTime : newHabit.targetTime}
                    onChange={(e) => editingHabit 
                      ? setEditingHabit({...editingHabit, targetTime: e.target.value})
                      : setNewHabit({...newHabit, targetTime: e.target.value})
                    }
                    className="border-gray-200"
                  />
                  <select
                    value={editingHabit ? editingHabit.category : newHabit.category}
                    onChange={(e) => editingHabit 
                      ? setEditingHabit({...editingHabit, category: e.target.value as FrontendHabit['category']})
                      : setNewHabit({...newHabit, category: e.target.value as FrontendHabit['category']})
                    }
                    className="p-2 border border-gray-200 rounded-md text-gray-600"
                  >
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="social">Social</option>
                  </select>
                  <select
                    value={editingHabit ? editingHabit.habitType : newHabit.habitType}
                    onChange={(e) => editingHabit 
                      ? setEditingHabit({...editingHabit, habitType: e.target.value as 'good' | 'bad'})
                      : setNewHabit({...newHabit, habitType: e.target.value as 'good' | 'bad'})
                    }
                    className="p-2 border border-gray-200 rounded-md text-gray-600"
                  >
                    <option value="good">Healthy Routine</option>
                    <option value="bad">Unhealthy Routine</option>
                  </select>
                </div>
                
                {/* Target Duration Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Target Duration (days) *</Label>
                    <Input
                      type="number"
                      placeholder="How many days to establish this habit?"
                      value={editingHabit ? editingHabit.targetDuration : newHabit.targetDuration}
                      onChange={(e) => editingHabit 
                        ? setEditingHabit({...editingHabit, targetDuration: Number(e.target.value)})
                        : setNewHabit({...newHabit, targetDuration: Number(e.target.value)})
                      }
                      className="border-gray-200"
                      required
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Set how many consecutive days you want to complete this habit to consider it established
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-700">Weekly Target</Label>
                    <Input
                      type="number"
                      placeholder="How many times per week?"
                      value={editingHabit ? editingHabit.weeklyTarget : newHabit.weeklyTarget}
                      onChange={(e) => editingHabit 
                        ? setEditingHabit({...editingHabit, weeklyTarget: Number(e.target.value)})
                        : setNewHabit({...newHabit, weeklyTarget: Number(e.target.value)})
                      }
                      className="border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      How many times you want to do this habit per week
                    </p>
                  </div>
                </div>
                
                {/* Bad Habit Specific Fields */}
                {(editingHabit ? editingHabit.habitType : newHabit.habitType) === 'bad' && (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800">Bad Habit Details</h4>
                    
                    {/* Auto-positive habit notification */}
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Positive Habit Will Be Created Automatically</p>
                          <p className="text-xs text-green-700 mt-1">
                            When you save this bad habit, we'll automatically create a positive alternative. You can set a reminder time, but only the positive habit will be reminded!
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-red-700">Frequency</Label>
                        <Input
                          type="number"
                          placeholder="How many times?"
                          value={editingHabit ? editingHabit.badHabitDetails?.frequency : newHabit.badHabitDetails?.frequency}
                          onChange={(e) => {
                            const badHabitDetails = editingHabit ? editingHabit.badHabitDetails : newHabit.badHabitDetails;
                            const updatedDetails = { 
                              frequency: Number(e.target.value),
                              frequencyUnit: badHabitDetails?.frequencyUnit || 'times_per_day',
                              timeOfDay: badHabitDetails?.timeOfDay || [],
                              triggers: badHabitDetails?.triggers || [],
                              severity: badHabitDetails?.severity || 'low',
                              impact: badHabitDetails?.impact || ''
                            };
                            if (editingHabit) {
                              setEditingHabit({...editingHabit, badHabitDetails: updatedDetails});
                            } else {
                              setNewHabit({...newHabit, badHabitDetails: updatedDetails});
                            }
                          }}
                          className="border-red-200"
                        />
                      </div>
                      <div>
                        <Label className="text-red-700">Frequency Unit</Label>
                        <select
                          value={editingHabit ? editingHabit.badHabitDetails?.frequencyUnit : newHabit.badHabitDetails?.frequencyUnit}
                          onChange={(e) => {
                            const badHabitDetails = editingHabit ? editingHabit.badHabitDetails : newHabit.badHabitDetails;
                            const updatedDetails = { 
                              frequency: badHabitDetails?.frequency || 0,
                              frequencyUnit: e.target.value as 'times_per_day' | 'times_per_week',
                              timeOfDay: badHabitDetails?.timeOfDay || [],
                              triggers: badHabitDetails?.triggers || [],
                              severity: badHabitDetails?.severity || 'low',
                              impact: badHabitDetails?.impact || ''
                            };
                            if (editingHabit) {
                              setEditingHabit({...editingHabit, badHabitDetails: updatedDetails});
                            } else {
                              setNewHabit({...newHabit, badHabitDetails: updatedDetails});
                            }
                          }}
                          className="p-2 border border-red-200 rounded-md text-gray-600"
                        >
                          <option value="times_per_day">Times per day</option>
                          <option value="times_per_week">Times per week</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-red-700">Time of Day (comma separated)</Label>
                      <Input
                        placeholder="e.g., 8:00 AM, 12:00 PM, 6:00 PM"
                        value={editingHabit ? editingHabit.badHabitDetails?.timeOfDay?.join(', ') : newHabit.badHabitDetails?.timeOfDay?.join(', ')}
                        onChange={(e) => {
                                                      const badHabitDetails = editingHabit ? editingHabit.badHabitDetails : newHabit.badHabitDetails;
                            const updatedDetails = { 
                              frequency: badHabitDetails?.frequency || 0,
                              frequencyUnit: badHabitDetails?.frequencyUnit || 'times_per_day',
                              timeOfDay: e.target.value.split(',').map(t => t.trim()),
                              triggers: badHabitDetails?.triggers || [],
                              severity: badHabitDetails?.severity || 'low',
                              impact: badHabitDetails?.impact || ''
                            };
                          if (editingHabit) {
                            setEditingHabit({...editingHabit, badHabitDetails: updatedDetails});
                          } else {
                            setNewHabit({...newHabit, badHabitDetails: updatedDetails});
                          }
                        }}
                        className="border-red-200"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-700">Triggers (comma separated)</Label>
                      <Input
                        placeholder="e.g., Stress, After meals, Social situations"
                        value={editingHabit ? editingHabit.badHabitDetails?.triggers?.join(', ') : newHabit.badHabitDetails?.triggers?.join(', ')}
                        onChange={(e) => {
                                                      const badHabitDetails = editingHabit ? editingHabit.badHabitDetails : newHabit.badHabitDetails;
                            const updatedDetails = { 
                              frequency: badHabitDetails?.frequency || 0,
                              frequencyUnit: badHabitDetails?.frequencyUnit || 'times_per_day',
                              timeOfDay: badHabitDetails?.timeOfDay || [],
                              triggers: e.target.value.split(',').map(t => t.trim()),
                              severity: badHabitDetails?.severity || 'low',
                              impact: badHabitDetails?.impact || ''
                            };
                          if (editingHabit) {
                            setEditingHabit({...editingHabit, badHabitDetails: updatedDetails});
                          } else {
                            setNewHabit({...newHabit, badHabitDetails: updatedDetails});
                          }
                        }}
                        className="border-red-200"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-700">Severity</Label>
                      <select
                        value={editingHabit ? editingHabit.badHabitDetails?.severity : newHabit.badHabitDetails?.severity}
                        onChange={(e) => {
                                                      const badHabitDetails = editingHabit ? editingHabit.badHabitDetails : newHabit.badHabitDetails;
                            const updatedDetails = { 
                              frequency: badHabitDetails?.frequency || 0,
                              frequencyUnit: badHabitDetails?.frequencyUnit || 'times_per_day',
                              timeOfDay: badHabitDetails?.timeOfDay || [],
                              triggers: badHabitDetails?.triggers || [],
                              severity: e.target.value as 'low' | 'medium' | 'high',
                              impact: badHabitDetails?.impact || ''
                            };
                          if (editingHabit) {
                            setEditingHabit({...editingHabit, badHabitDetails: updatedDetails});
                          } else {
                            setNewHabit({...newHabit, badHabitDetails: updatedDetails});
                          }
                        }}
                        className="p-2 border border-red-200 rounded-md text-gray-600"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label className="text-red-700">Impact Description</Label>
                      <Input
                        placeholder="Describe the negative impact of this habit"
                        value={editingHabit ? editingHabit.badHabitDetails?.impact : newHabit.badHabitDetails?.impact}
                        onChange={(e) => {
                                                      const badHabitDetails = editingHabit ? editingHabit.badHabitDetails : newHabit.badHabitDetails;
                            const updatedDetails = { 
                              frequency: badHabitDetails?.frequency || 0,
                              frequencyUnit: badHabitDetails?.frequencyUnit || 'times_per_day',
                              timeOfDay: badHabitDetails?.timeOfDay || [],
                              triggers: badHabitDetails?.triggers || [],
                              severity: badHabitDetails?.severity || 'low',
                              impact: e.target.value
                            };
                          if (editingHabit) {
                            setEditingHabit({...editingHabit, badHabitDetails: updatedDetails});
                          } else {
                            setNewHabit({...newHabit, badHabitDetails: updatedDetails});
                          }
                        }}
                        className="border-red-200"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Show different reminder UI for bad habits */}
                  {(editingHabit ? editingHabit.habitType : newHabit.habitType) === 'bad' ? (
                    <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingHabit ? editingHabit.reminder?.enabled : newHabit.reminder.enabled}
                          onCheckedChange={(checked) => {
                            const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                            const updatedReminder = { 
                              enabled: checked,
                              time: reminder?.time || '09:00',
                              frequency: reminder?.frequency || 'daily',
                              daysOfWeek: reminder?.daysOfWeek || [1, 2, 3, 4, 5],
                              customInterval: reminder?.customInterval || 1,
                              customUnit: reminder?.customUnit || 'days'
                            };
                            if (editingHabit) {
                              setEditingHabit({...editingHabit, reminder: updatedReminder});
                            } else {
                              setNewHabit({...newHabit, reminder: updatedReminder});
                            }
                          }}
                        />
                        <Label className="text-red-700">Set Reminder Time (for positive habit)</Label>
                      </div>
                      
                      <div className="p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Reminder Policy for Bad Habits</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          You can set a reminder time, but only the positive alternative habit will be reminded. This helps you focus on replacement rather than reinforcement!
                        </p>
                      </div>
                      
                      {(editingHabit ? editingHabit.reminder?.enabled : newHabit.reminder.enabled) && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label>Time</Label>
                              <Input
                                type="time"
                                value={editingHabit ? editingHabit.reminder?.time : newHabit.reminder.time}
                                onChange={() => {
                                  const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                  const updatedReminder = { 
                                    enabled: reminder && reminder.enabled !== undefined ? reminder.enabled : false,
                                    time: reminder && reminder.time ? reminder.time : '09:00',
                                    frequency: reminder?.frequency || 'daily',
                                    daysOfWeek: reminder && reminder.daysOfWeek !== undefined ? reminder.daysOfWeek : [1, 2, 3, 4, 5],
                                    customInterval: reminder && reminder.customInterval !== undefined ? reminder.customInterval : 1,
                                    customUnit: reminder && reminder.customUnit !== undefined ? reminder.customUnit : 'days'
                                  };
                                  if (editingHabit) {
                                    setEditingHabit({...editingHabit, reminder: updatedReminder});
                                  } else {
                                    setNewHabit({...newHabit, reminder: updatedReminder});
                                  }
                                }}
                                className="border-gray-200"
                              />
                            </div>
                            <div>
                              <Label>Frequency</Label>
                              <Select
                                value={editingHabit ? editingHabit.reminder?.frequency : newHabit.reminder.frequency}
                                onValueChange={(value) => {
                                  const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                  const updatedReminder = { 
                                    enabled: reminder && reminder.enabled !== undefined ? reminder.enabled : false,
                                    time: reminder && reminder.time ? reminder.time : '09:00',
                                    frequency: value as 'daily' | 'weekly' | 'custom',
                                    daysOfWeek: reminder && reminder.daysOfWeek !== undefined ? reminder.daysOfWeek : [1, 2, 3, 4, 5],
                                    customInterval: reminder && reminder.customInterval !== undefined ? reminder.customInterval : 1,
                                    customUnit: reminder && reminder.customUnit !== undefined ? reminder.customUnit : 'days'
                                  };
                                  if (editingHabit) {
                                    setEditingHabit({...editingHabit, reminder: updatedReminder});
                                  } else {
                                    setNewHabit({...newHabit, reminder: updatedReminder});
                                  }
                                }}
                              >
                                <SelectTrigger className="border-gray-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2">
                              <Bell className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Positive Habit Reminder Preview:</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              {(() => {
                                const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                if (!reminder) return '';
                                
                                const time = reminder.time;
                                const frequency = reminder.frequency;
                                
                                if (frequency === 'daily') {
                                  return `Daily at ${time} - Only the positive habit will be reminded!`;
                                } else if (frequency === 'weekly') {
                                  const days = reminder.daysOfWeek?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'Mon, Tue, Wed, Thu, Fri';
                                  return `Weekly on ${days} at ${time} - Only the positive habit will be reminded!`;
                                } else if (frequency === 'custom') {
                                  const interval = reminder.customInterval;
                                  const unit = reminder.customUnit;
                                  return `Every ${interval} ${unit} at ${time} - Only the positive habit will be reminded!`;
                                }
                                return '';
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingHabit ? editingHabit.reminder?.enabled : newHabit.reminder.enabled}
                                                      onCheckedChange={(checked) => {
                              const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                              const updatedReminder = { 
                                enabled: checked,
                                time: reminder?.time || '09:00',
                                frequency: reminder?.frequency || 'daily',
                                daysOfWeek: reminder?.daysOfWeek !== undefined ? reminder.daysOfWeek : [1, 2, 3, 4, 5],
                                customInterval: reminder?.customInterval !== undefined ? reminder.customInterval : 1,
                                customUnit: reminder?.customUnit !== undefined ? reminder.customUnit : 'days'
                              };
                              if (editingHabit) {
                                setEditingHabit({...editingHabit, reminder: updatedReminder});
                              } else {
                                setNewHabit({...newHabit, reminder: updatedReminder});
                              }
                            }}
                        />
                        <Label>Enable Reminders</Label>
                      </div>
                      
                      {(editingHabit ? editingHabit.reminder?.enabled : newHabit.reminder.enabled) && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label>Time</Label>
                              <Input
                                type="time"
                                value={editingHabit ? editingHabit.reminder?.time : newHabit.reminder.time}
                                onChange={() => {
                                  const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                  const updatedReminder = { 
                                    enabled: reminder && reminder.enabled !== undefined ? reminder.enabled : false,
                                    time: reminder && reminder.time ? reminder.time : '09:00',
                                    frequency: reminder?.frequency || 'daily',
                                    daysOfWeek: reminder && reminder.daysOfWeek !== undefined ? reminder.daysOfWeek : [1, 2, 3, 4, 5],
                                    customInterval: reminder && reminder.customInterval !== undefined ? reminder.customInterval : 1,
                                    customUnit: reminder && reminder.customUnit !== undefined ? reminder.customUnit : 'days'
                                  };
                                  if (editingHabit) {
                                    setEditingHabit({...editingHabit, reminder: updatedReminder});
                                  } else {
                                    setNewHabit({...newHabit, reminder: updatedReminder});
                                  }
                                }}
                                className="border-gray-200"
                              />
                            </div>
                            <div>
                              <Label>Frequency</Label>
                              <Select
                                value={editingHabit ? editingHabit.reminder?.frequency : newHabit.reminder.frequency}
                                onValueChange={(value) => {
                                  const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                  const updatedReminder = { 
                                    enabled: reminder && reminder.enabled !== undefined ? reminder.enabled : false,
                                    time: reminder && reminder.time ? reminder.time : '09:00',
                                    frequency: value as 'daily' | 'weekly' | 'custom',
                                    daysOfWeek: reminder && reminder.daysOfWeek !== undefined ? reminder.daysOfWeek : [1, 2, 3, 4, 5],
                                    customInterval: reminder && reminder.customInterval !== undefined ? reminder.customInterval : 1,
                                    customUnit: reminder && reminder.customUnit !== undefined ? reminder.customUnit : 'days'
                                  };
                                  if (editingHabit) {
                                    setEditingHabit({...editingHabit, reminder: updatedReminder});
                                  } else {
                                    setNewHabit({...newHabit, reminder: updatedReminder});
                                  }
                                }}
                              >
                                <SelectTrigger className="border-gray-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2">
                              <Bell className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">Reminder Preview:</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {(() => {
                                const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                if (!reminder) return '';
                                
                                const time = reminder.time;
                                const frequency = reminder.frequency;
                                
                                if (frequency === 'daily') {
                                  return `Daily at ${time}`;
                                } else if (frequency === 'weekly') {
                                  const days = reminder.daysOfWeek?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'Mon, Tue, Wed, Thu, Fri';
                                  return `Weekly on ${days} at ${time}`;
                                } else if (frequency === 'custom') {
                                  const interval = reminder.customInterval;
                                  const unit = reminder.customUnit;
                                  return `Every ${interval} ${unit} at ${time}`;
                                }
                                return '';
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={editingHabit ? () => updateHabit(editingHabit) : addHabit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {editingHabit ? 'Update' : 'Add'} Habit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingHabit(null);
                    }}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  {editingHabit && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        deleteHabit(editingHabit.id);
                        setEditingHabit(null);
                      }}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Generated Habits Section */}
          {aiGeneratedHabits.filter(h => h.habitType !== 'bad' && !h.id.includes('_positive')).length > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI-Generated Habits</h3>
                  <p className="text-gray-600">Habits created based on your role model selection</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {aiGeneratedHabits.filter(h => h.habitType !== 'bad' && !h.id.includes('_positive')).map((habit) => (
                  <div key={habit.id} className="relative group">
                    <HabitCard 
                      habit={habit} 
                      onToggle={() => toggleHabit(habit.id)}
                      onSchedule={() => handleScheduleHabit(habit)}
                      onGenerateGoal={() => generateGoalForHabit(habit)}
                      onDelete={() => deleteHabit(habit.id)}
                      onAddHabit={addHabitFromSuggestion}
                    />
                    <CompactStrengthMeter habit={habit} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paired Habits Section - Bad Habit + Positive Alternative */}
          {pairedHabits.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">🔄 Habit Replacement Pairs</h3>
                  <p className="text-gray-600">Bad habits with their positive alternatives - only positive habits are reminded</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {pairedHabits.map(({ badHabit, positiveHabit }) => (
                  <Card key={badHabit.id} className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-red-500 rounded-xl shadow-lg">
                            <AlertTriangle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-red-900 text-lg">Replace This</h4>
                            <p className="text-sm text-red-700">{badHabit.title}</p>
                            <p className="text-xs text-red-600">(No reminders)</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl">🔄</div>
                          <p className="text-xs text-gray-600 font-medium">Switch to</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-bold text-green-900 text-right text-lg">With This</h4>
                            <p className="text-sm text-green-700 text-right">{positiveHabit.title}</p>
                            <p className="text-xs text-green-600 text-right">(Reminded)</p>
                          </div>
                          <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Bad Habit Card */}
                        <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                          <HabitCard 
                            habit={badHabit} 
                            onToggle={() => toggleHabit(badHabit.id)}
                            onSchedule={() => handleScheduleHabit(badHabit)}
                            onAddHabit={addHabitFromSuggestion}
                          />
                          <CompactStrengthMeter habit={badHabit} />
                        </div>
                        {/* Positive Habit Card */}
                        <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                          <HabitCard 
                            habit={positiveHabit} 
                            onToggle={() => toggleHabit(positiveHabit.id)}
                            onSchedule={() => handleScheduleHabit(positiveHabit)}
                            onAddHabit={addHabitFromSuggestion}
                          />
                          <CompactStrengthMeter habit={positiveHabit} />
                        </div>
                      </div>
                      
                      {/* Reminder Info */}
                      {positiveHabit.reminder && positiveHabit.reminder.enabled && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Positive Habit Reminder</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            You'll be reminded to do "{positiveHabit.title}" at {positiveHabit.reminder.time} ({positiveHabit.reminder.frequency}) - 
                            this helps you replace the bad habit with the positive one!
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bad Habits Section */}
          {badHabits.filter(h => !pairedHabits.some(p => p.badHabit.id === h.id)).length > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-900">⚠️ Bad Habits to Break</h3>
                  <p className="text-red-700">Track and work on reducing these habits</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {badHabits.filter(h => !pairedHabits.some(p => p.badHabit.id === h.id)).map((habit) => (
                  <div key={habit.id} className="relative group">
                    <HabitCard 
                      habit={habit} 
                      onToggle={() => toggleHabit(habit.id)}
                      onSchedule={() => handleScheduleHabit(habit)}
                      onGenerateGoal={() => generateGoalForHabit(habit)}
                      onDelete={() => deleteHabit(habit.id)}
                      onAddHabit={addHabitFromSuggestion}
                    />
                    <CompactStrengthMeter habit={habit} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Habit Dialog */}
          <Dialog open={!!schedulingHabit} onOpenChange={(open) => !open && setSchedulingHabit(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <span>Schedule "{schedulingHabit?.title}"</span>
                </DialogTitle>
              </DialogHeader>
              
              {schedulingHabit && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Target Time</Label>
                      <Input
                        type="time"
                        value={schedulingHabit.targetTime || ''}
                        onChange={(e) => setSchedulingHabit({...schedulingHabit, targetTime: e.target.value})}
                        className="border-gray-200"
                      />
                    </div>
                    <div>
                      <Label>Weekly Target</Label>
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        value={schedulingHabit.weeklyTarget || 7}
                        onChange={(e) => setSchedulingHabit({...schedulingHabit, weeklyTarget: Number(e.target.value)})}
                        className="border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={schedulingHabit.reminder?.enabled || false}
                        onCheckedChange={(checked) => {
                          const reminder = schedulingHabit.reminder || {
                            enabled: false,
                            time: '09:00',
                            frequency: 'daily',
                            daysOfWeek: [1, 2, 3, 4, 5],
                            customInterval: 1,
                            customUnit: 'days'
                          };
                          setSchedulingHabit({...schedulingHabit, reminder: {...reminder, enabled: checked}});
                        }}
                      />
                      <Label>Enable Reminders</Label>
                    </div>
                    
                    {(schedulingHabit.reminder?.enabled) && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Reminder Time</Label>
                            <Input
                              type="time"
                              value={schedulingHabit.reminder?.time || '09:00'}
                              onChange={(e) => {
                                const reminder = schedulingHabit.reminder || {
                                  enabled: true,
                                  time: '09:00',
                                  frequency: 'daily',
                                  daysOfWeek: [1, 2, 3, 4, 5],
                                  customInterval: 1,
                                  customUnit: 'days'
                                };
                                setSchedulingHabit({...schedulingHabit, reminder: {...reminder, time: e.target.value}});
                              }}
                              className="border-gray-200"
                            />
                          </div>
                          <div>
                            <Label>Frequency</Label>
                            <Select
                              value={schedulingHabit.reminder?.frequency || 'daily'}
                              onValueChange={(value) => {
                                const reminder = schedulingHabit.reminder || {
                                  enabled: true,
                                  time: '09:00',
                                  frequency: 'daily',
                                  daysOfWeek: [1, 2, 3, 4, 5],
                                  customInterval: 1,
                                  customUnit: 'days'
                                };
                                setSchedulingHabit({...schedulingHabit, reminder: {...reminder, frequency: value as 'daily' | 'weekly' | 'custom'}});
                              }}
                            >
                              <SelectTrigger className="border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Weekly Days Selection */}
                        {schedulingHabit.reminder?.frequency === 'weekly' && (
                          <div>
                            <Label>Days of Week</Label>
                            <div className="grid grid-cols-7 gap-2 mt-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <Button
                                  key={day}
                                  type="button"
                                  variant={schedulingHabit.reminder?.daysOfWeek?.includes(index) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    const reminder = schedulingHabit.reminder || {
                                      enabled: true,
                                      time: '09:00',
                                      frequency: 'weekly',
                                      daysOfWeek: [1, 2, 3, 4, 5],
                                      customInterval: 1,
                                      customUnit: 'days'
                                    };
                                    const currentDays = reminder.daysOfWeek || [1, 2, 3, 4, 5];
                                    const newDays = currentDays.includes(index) 
                                      ? currentDays.filter(d => d !== index)
                                      : [...currentDays, index];
                                    setSchedulingHabit({...schedulingHabit, reminder: {...reminder, daysOfWeek: newDays}});
                                  }}
                                  className="h-8 w-8 p-0 text-xs"
                                >
                                  {day}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Custom Interval Selection */}
                        {schedulingHabit.reminder?.frequency === 'custom' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Interval</Label>
                              <Input
                                type="number"
                                min="1"
                                value={schedulingHabit.reminder?.customInterval || 1}
                                onChange={(e) => {
                                  const reminder = schedulingHabit.reminder || {
                                    enabled: true,
                                    time: '09:00',
                                    frequency: 'custom',
                                    daysOfWeek: [1, 2, 3, 4, 5],
                                    customInterval: 1,
                                    customUnit: 'days'
                                  };
                                  setSchedulingHabit({...schedulingHabit, reminder: {...reminder, customInterval: Number(e.target.value)}});
                                }}
                                className="border-gray-200"
                              />
                            </div>
                            <div>
                              <Label>Unit</Label>
                              <Select
                                value={schedulingHabit.reminder?.customUnit || 'days'}
                                onValueChange={(value) => {
                                  const reminder = schedulingHabit.reminder || {
                                    enabled: true,
                                    time: '09:00',
                                    frequency: 'custom',
                                    daysOfWeek: [1, 2, 3, 4, 5],
                                    customInterval: 1,
                                    customUnit: 'days'
                                  };
                                  setSchedulingHabit({...schedulingHabit, reminder: {...reminder, customUnit: value as 'days' | 'weeks' | 'months'}});
                                }}
                              >
                                <SelectTrigger className="border-gray-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="weeks">Weeks</SelectItem>
                                  <SelectItem value="months">Months</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">Schedule Preview:</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {(() => {
                              const reminder = schedulingHabit.reminder;
                              if (!reminder) return '';
                              
                              const time = reminder.time;
                              const frequency = reminder.frequency;
                              const targetTime = schedulingHabit.targetTime;
                              
                              let scheduleText = '';
                              if (targetTime) {
                                scheduleText += `Target time: ${targetTime}. `;
                              }
                              
                              if (frequency === 'daily') {
                                scheduleText += `Daily reminder at ${time}`;
                              } else if (frequency === 'weekly') {
                                const days = reminder.daysOfWeek?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'Mon, Tue, Wed, Thu, Fri';
                                scheduleText += `Weekly reminder on ${days} at ${time}`;
                              } else if (frequency === 'custom') {
                                const interval = reminder.customInterval;
                                const unit = reminder.customUnit;
                                scheduleText += `Reminder every ${interval} ${unit} at ${time}`;
                              }
                              return scheduleText;
                            })()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={() => updateHabitSchedule(schedulingHabit!)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Update Schedule
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSchedulingHabit(null)}
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Habits Content */}
          {/* Ongoing Habits Content */}
          {habitsView === 'ongoing' && (
            <div className="space-y-8">
              {/* Ongoing Good Habits */}
              {habits.filter(h => !h.isCompleted && h.habitType !== 'bad').length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Currently Active</h3>
                      <p className="text-gray-600">Habits you're actively working on ({habits.filter(h => !h.isCompleted && h.habitType !== 'bad').length})</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {habits.filter(h => !h.isCompleted && h.habitType !== 'bad').map((habit) => (
                      <div key={habit.id} className="relative group">
                        <HabitCard 
                          habit={habit} 
                          onToggle={() => toggleHabit(habit.id)}
                          onSchedule={() => handleScheduleHabit(habit)}
                          onGenerateGoal={() => generateGoalForHabit(habit)}
                          onDelete={() => deleteHabit(habit.id)}
                          onAddHabit={addHabitFromSuggestion}
                        />
                        <CompactStrengthMeter habit={habit} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ongoing Bad Habits */}
              {habits.filter(h => !h.isCompleted && h.habitType === 'bad').length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Bad Habits Being Tracked</h3>
                      <p className="text-gray-600">Habits you're working to reduce or eliminate ({habits.filter(h => !h.isCompleted && h.habitType === 'bad').length})</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {habits.filter(h => !h.isCompleted && h.habitType === 'bad').map((habit) => (
                      <div key={habit.id} className="relative group">
                        <HabitCard 
                          habit={habit} 
                          onToggle={() => toggleHabit(habit.id)}
                          onSchedule={() => handleScheduleHabit(habit)}
                          onGenerateGoal={() => generateGoalForHabit(habit)}
                          onDelete={() => deleteHabit(habit.id)}
                          onAddHabit={addHabitFromSuggestion}
                        />
                        <CompactStrengthMeter habit={habit} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No ongoing habits */}
              {habits.filter(h => !h.isCompleted).length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Ongoing Habits</h3>
                  <p className="text-gray-600 mb-6 text-lg">Start tracking your habits to see them here</p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Habit
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Completed Habits Content */}
          {habitsView === 'completed' && (
            <div className="space-y-8">
              {/* Completed Good Habits */}
              {habits.filter(h => h.isCompleted && h.habitType !== 'bad').length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Successfully Completed</h3>
                      <p className="text-gray-600">Habits you've successfully established ({habits.filter(h => h.isCompleted && h.habitType !== 'bad').length})</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {habits.filter(h => h.isCompleted && h.habitType !== 'bad').map((habit) => (
                      <div key={habit.id} className="relative group">
                        <HabitCard 
                          habit={habit} 
                          onToggle={() => toggleHabit(habit.id)}
                          onSchedule={() => handleScheduleHabit(habit)}
                          onGenerateGoal={() => generateGoalForHabit(habit)}
                          onDelete={() => deleteHabit(habit.id)}
                          onAddHabit={addHabitFromSuggestion}
                        />
                        <CompactStrengthMeter habit={habit} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No completed habits */}
              {habits.filter(h => h.isCompleted && h.habitType !== 'bad').length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Completed Habits Yet</h3>
                  <p className="text-gray-600 mb-6 text-lg">Keep working on your habits to see them here</p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Habit
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Show message if no habits */}
          {habits.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No habits yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Start by adding your first habit to track your progress</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          )}

          {/* Age-based Medical Reminders and Video Call Reminders - Only in Habits Tab */}
          {isUser45OrOlder(currentUser?.ageGroup) && (
            <div className="space-y-6 mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Health & Wellness Reminders</h3>
                  <p className="text-gray-600">Important health-related reminders for users 45 and above</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical Reminders */}
                <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-800">
                      <Stethoscope className="w-5 h-5" />
                      <span>Medical Reminders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Annual Physical Checkup</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          Schedule
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Blood Pressure Check</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                          Remind Me
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Cholesterol Screening</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                          Schedule
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Diabetes Screening</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                          Schedule
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Regular health checkups are crucial for maintaining good health as we age. 
                        Consider scheduling these appointments well in advance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Video Call Reminders */}
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-blue-800">
                      <Video className="w-5 h-5" />
                      <span>Video Call Reminders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Family Video Call</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                          Schedule
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Doctor Teleconsultation</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                          Book Now
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Wellness Group Session</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                          Join
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">Mental Health Check-in</span>
                        </div>
                        <Button size="sm" variant="outline" className="border-teal-300 text-teal-600 hover:bg-teal-50">
                          Schedule
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Tip:</strong> Regular video calls with family and healthcare providers help maintain 
                        social connections and ensure timely medical care.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Additional Health Tips */}
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Heart className="w-5 h-5" />
                    <span>Health & Wellness Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Physical Health</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Stay active with 30 minutes of exercise daily</li>
                        <li>• Maintain a balanced diet with plenty of fruits and vegetables</li>
                        <li>• Get 7-8 hours of quality sleep each night</li>
                        <li>• Stay hydrated by drinking 8 glasses of water daily</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Mental Wellness</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Practice mindfulness or meditation daily</li>
                        <li>• Stay connected with family and friends</li>
                        <li>• Engage in hobbies and activities you enjoy</li>
                        <li>• Seek professional help if needed</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="challenges">
          <Tabs defaultValue="challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
              <TabsTrigger value="challenges" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
                <Trophy className="w-4 h-4" />
                <span>Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="buddies" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
                <UserPlus className="w-4 h-4" />
                <span>Buddies</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="challenges">
              <HabitChallenges 
                habits={habits}
                currentUser={{
                  id: 'current-user',
                  name: 'You',
                  avatar: undefined
                }}
              />
            </TabsContent>
            
            <TabsContent value="buddies">
              <AccountabilityBuddies 
                habits={habits}
                currentUser={{
                  id: 'current-user',
                  name: 'You',
                  avatar: undefined
                }}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="social">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
              <TabsTrigger value="feed" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
                <Share2 className="w-4 h-4" />
                <span>Social Feed</span>
              </TabsTrigger>
              <TabsTrigger value="social-media" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
                <Facebook className="w-4 h-4" />
                <span>Social Media</span>
              </TabsTrigger>
              <TabsTrigger value="ai-coach" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
                <Brain className="w-4 h-4" />
                <span>AI Coach</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              <SocialSharing 
                habits={habits}
                currentUser={{
                  id: 'current-user',
                  name: 'You',
                  avatar: undefined
                }}
              />
            </TabsContent>
            
            <TabsContent value="social-media">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Social Media Integration</h2>
                    <p className="text-gray-600">Connect your social media accounts and share your progress</p>
                  </div>
                </div>

                {/* Social Media Connection Status */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Share2 className="w-5 h-5 text-blue-600" />
                      <span>Connected Accounts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Facebook className="w-6 h-6 text-blue-600" />
                          <span className="font-medium">Facebook</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">Share your habit progress with friends</div>
                        <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                          Connect
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-400">
                        <div className="flex items-center space-x-3 mb-3">
                          <Twitter className="w-6 h-6 text-blue-400" />
                          <span className="font-medium">Twitter</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">Tweet your achievements and milestones</div>
                        <Button variant="outline" size="sm" className="w-full border-blue-400 text-blue-400 hover:bg-blue-50">
                          Connect
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-pink-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <Instagram className="w-6 h-6 text-pink-500" />
                          <span className="font-medium">Instagram</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">Share visual progress and stories</div>
                        <Button variant="outline" size="sm" className="w-full border-pink-300 text-pink-500 hover:bg-pink-50">
                          Connect
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <Linkedin className="w-6 h-6 text-blue-700" />
                          <span className="font-medium">LinkedIn</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">Share professional development goals</div>
                        <Button variant="outline" size="sm" className="w-full border-blue-700 text-blue-700 hover:bg-blue-50">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media Analytics */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Social Media Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">24</div>
                        <div className="text-sm text-green-600">Total Shares</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-sm text-blue-600">Total Likes</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600">89</div>
                        <div className="text-sm text-purple-600">Total Comments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Share Templates */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>Quick Share Templates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {habits.filter(h => !h.isCompleted).slice(0, 4).map((habit) => (
                        <div key={habit.id} className="p-4 bg-white rounded-lg border border-purple-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-gray-900">{habit.title}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            {habit.streak} day streak • {habit.completionRate}% completion
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const shareText = `Just completed ${habit.title} for ${habit.streak} days in a row! 💪 #habits #consistency #progress`;
                                navigator.clipboard.writeText(shareText);
                                alert('Share text copied to clipboard!');
                              }}
                              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                              Copy Text
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just completed ${habit.title} for ${habit.streak} days in a row! 💪 #habits #consistency #progress`)}`;
                                window.open(shareUrl, '_blank');
                              }}
                              className="border-blue-400 text-blue-400 hover:bg-blue-50"
                            >
                              <Twitter className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="ai-coach">
              <AIMotivator 
                habits={habits}
                currentUser={{
                  id: 'current-user',
                  name: 'You',
                  avatar: undefined
                }}
                currentMood={currentMood}
              />
            </TabsContent>
            
            <TabsContent value="community">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Community</h2>
                    <p className="text-gray-600">Connect with like-minded people and join habit communities</p>
                  </div>
                </div>

                {/* Community Stats */}
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <span>Community Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600">1,247</div>
                        <div className="text-sm text-orange-600">Active Members</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600">89</div>
                        <div className="text-sm text-red-600">Active Challenges</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-600">15,432</div>
                        <div className="text-sm text-yellow-600">Habits Completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Join Communities */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserPlus className="w-5 h-5 text-green-600" />
                      <span>Join Communities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Fitness Enthusiasts</h4>
                            <p className="text-sm text-gray-600">2,341 members</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Join fellow fitness lovers and share workout routines</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Join Community
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Brain className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Mindfulness Masters</h4>
                            <p className="text-sm text-gray-600">1,892 members</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Meditation and mindfulness practice community</p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Join Community
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Productivity Pros</h4>
                            <p className="text-sm text-gray-600">3,156 members</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Maximize your productivity and achieve your goals</p>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          Join Community
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-pink-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Healthy Living</h4>
                            <p className="text-sm text-gray-600">4,567 members</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Complete wellness and healthy lifestyle community</p>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                          Join Community
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

