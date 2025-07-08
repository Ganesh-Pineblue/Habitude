import React, { useState, useEffect } from 'react';
import { HabitCard } from './HabitCard';
import { MoodTracker } from './MoodTracker';
import { AddHabitButton } from './AddHabitButton';
// QuickStats, WeeklyProgress, and HabitStrengthMeter integrated directly
import { HabitChallenges } from './HabitChallenges';
import { SocialSharing } from './SocialSharing';
import { AccountabilityBuddies } from './AccountabilityBuddies';
import { AIMotivator } from './AIMotivator';
import { AdaptiveHabitSuggestionEngine } from './AdaptiveHabitSuggestionEngine';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, BarChart3, Target, Zap, Plus, Edit3, Trash2, Bell, Clock, CalendarDays, Sparkles, AlertTriangle, CheckCircle2, Activity, Trophy, Users, Share2, UserPlus, Brain, Lightbulb, Facebook, Twitter, Instagram, Linkedin, TrendingUp, Heart, Flame } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface Habit {
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
  // Bad habit specific fields
  badHabitDetails?: {
    frequency: number; // times per day/week
    frequencyUnit: 'times_per_day' | 'times_per_week';
    timeOfDay: string[]; // array of times when the habit occurs
    triggers: string[]; // what triggers this habit
    severity: 'low' | 'medium' | 'high';
    impact: string; // description of negative impact
  };
  reminder?: {
    enabled: boolean;
    time: string;
    frequency: 'daily' | 'weekly' | 'custom';
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    customInterval: number; // for custom frequency
    customUnit: 'days' | 'weeks' | 'months';
  };
  aiGenerated?: boolean;
  pairedBadHabitId?: string;
  pairedBadHabitTitle?: string;
}

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

const roleModels = [
  { name: "Einstein", habits: ["Read daily", "Think deeply"] },
  { name: "Gandhi", habits: ["Meditate", "Practice kindness"] },
  { name: "Oprah", habits: ["Gratitude journal", "Help others"] },
];

const defaultHabits = [
  "Exercise",
  "Drink water",
  "Sleep early",
  "Read daily",
  "Meditate",
  "Practice kindness",
  "Gratitude journal",
  "Help others",
];

const steps = ["Welcome", "Role Model", "Habits", "Finish"];

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedRoleModel, setSelectedRoleModel] = useState<string | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  // Progress bar width
  const progress = ((step + 1) / steps.length) * 100;

  // Step handlers
  const handleRoleModelSelect = (roleModel) => {
    setSelectedRoleModel(roleModel.name);
    setSelectedHabits(Array.from(new Set([...selectedHabits, ...roleModel.habits])));
    setStep(step + 1);
  };

  const handleHabitToggle = (habit: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habit)
        ? prev.filter((h) => h !== habit)
        : [...prev, habit]
    );
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const finishOnboarding = () => {
    localStorage.setItem('userHabits', JSON.stringify(selectedHabits));
    localStorage.setItem('isFirstLogin', 'false');
    onComplete();
  };

  // Step content
  let content;
  if (step === 0) {
    content = (
      <div>
        <h2>Welcome to Mindful Habits! 🎉</h2>
        <p>Let's set up your journey for success.</p>
        <button onClick={handleNext}>Get Started</button>
      </div>
    );
  } else if (step === 1) {
    content = (
      <div>
        <h2>Choose a Role Model (optional)</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          {roleModels.map((rm) => (
            <button key={rm.name} onClick={() => handleRoleModelSelect(rm)}>
              {rm.name}
            </button>
          ))}
        </div>
        <p>Or <button onClick={handleNext}>Skip</button></p>
        {step > 0 && <button onClick={handleBack}>Back</button>}
      </div>
    );
  } else if (step === 2) {
    content = (
      <div>
        <h2>Select Your Habits</h2>
        <div>
          {defaultHabits.map((habit) => (
            <label key={habit} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={selectedHabits.includes(habit)}
                onChange={() => handleHabitToggle(habit)}
              />
              {habit}
            </label>
          ))}
        </div>
        <button onClick={handleNext} disabled={selectedHabits.length === 0}>
          Next
        </button>
        <button onClick={handleBack}>Back</button>
      </div>
    );
  } else if (step === 3) {
    content = (
      <div>
        <h2>All Set!</h2>
        <p>You're ready to start your mindful habits journey.</p>
        <button onClick={finishOnboarding}>Go to Dashboard</button>
        <button onClick={handleBack}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      {/* Progress Bar */}
      <div style={{ height: 8, background: "#eee", borderRadius: 4, marginBottom: 24 }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "#4f46e5",
          borderRadius: 4,
          transition: "width 0.3s"
        }} />
      </div>
      {content}
    </div>
  );
};

export default OnboardingFlow;

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
  const [habits, setHabits] = useState<Habit[]>(initialHabits.length > 0 ? initialHabits : [
    {
      id: '1',
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness to start the day',
      streak: 12,
      completedToday: true,
      targetTime: '7:00 AM',
      category: 'mindfulness',
      habitType: 'good',
      aiSuggestion: 'Perfect timing! Your stress levels are lowest in the morning.',
      weeklyTarget: 7,
      currentWeekCompleted: 5,
      bestStreak: 15,
      completionRate: 92,
      reminder: {
        enabled: true,
        time: '07:00',
        frequency: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        customInterval: 1,
        customUnit: 'days'
      },
      aiGenerated: true
    },
    {
      id: '2',
      title: 'Drink Water',
      description: '8 glasses throughout the day for optimal hydration',
      streak: 5,
      completedToday: false,
      category: 'health',
      habitType: 'good',
      aiSuggestion: 'Try setting hourly reminders - you tend to forget after lunch.',
      weeklyTarget: 7,
      currentWeekCompleted: 4,
      bestStreak: 21,
      completionRate: 78,
      reminder: {
        enabled: true,
        time: '10:00',
        frequency: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5],
        customInterval: 1,
        customUnit: 'days'
      },
      aiGenerated: true
    },
    {
      id: '3',
      title: 'Evening Journal',
      description: 'Reflect on the day and plan tomorrow',
      streak: 8,
      completedToday: false,
      targetTime: '9:00 PM',
      category: 'mindfulness',
      habitType: 'good',
      aiSuggestion: 'Your mood improves 23% on days you journal!',
      weeklyTarget: 5,
      currentWeekCompleted: 3,
      bestStreak: 12,
      completionRate: 85,
      reminder: {
        enabled: true,
        time: '21:00',
        frequency: 'weekly',
        daysOfWeek: [1, 2, 3, 4, 5],
        customInterval: 1,
        customUnit: 'days'
      },
      aiGenerated: true
    },
    {
      id: '4',
      title: 'Exercise',
      description: '30 minutes of physical activity',
      streak: 3,
      completedToday: true,
      targetTime: '6:00 PM',
      category: 'health',
      habitType: 'good',
      aiSuggestion: 'Consistency is key! Your energy levels peak after workouts.',
      weeklyTarget: 5,
      currentWeekCompleted: 3,
      bestStreak: 14,
      completionRate: 80,
      reminder: {
        enabled: false,
        time: '18:00',
        frequency: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5],
        customInterval: 1,
        customUnit: 'days'
      },
      aiGenerated: true
    },
    {
      id: '5',
      title: 'Smoking',
      description: 'Cigarette smoking habit',
      streak: 0,
      completedToday: false,
      category: 'health',
      habitType: 'bad',
      weeklyTarget: 0,
      currentWeekCompleted: 0,
      bestStreak: 0,
      completionRate: 0,
      badHabitDetails: {
        frequency: 10,
        frequencyUnit: 'times_per_day',
        timeOfDay: ['8:00 AM', '12:00 PM', '6:00 PM', '9:00 PM'],
        triggers: ['Stress', 'After meals', 'Social situations'],
        severity: 'high',
        impact: 'Negative impact on lung health and overall well-being'
      },
      aiGenerated: false
    }
  ]);

  // Update habits when initialHabits prop changes
  useEffect(() => {
    if (initialHabits.length > 0) {
      setHabits(initialHabits);
    }
  }, [initialHabits]);

  // Notify parent component when habits change
  useEffect(() => {
    if (onHabitsUpdate) {
      onHabitsUpdate(habits);
    }
  }, [habits, onHabitsUpdate]);

  // Mock goals data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Lose 10 lbs',
      description: 'Achieve target weight through consistent exercise and healthy eating',
      target: 10,
      current: 6.5,
      unit: 'lbs',
      deadline: '2025-08-01',
      category: 'health',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Read 24 Books',
      description: 'Complete 2 books per month to expand knowledge',
      target: 24,
      current: 12,
      unit: 'books',
      deadline: '2025-12-31',
      category: 'productivity',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Meditate 100 Days',
      description: 'Build a consistent meditation practice',
      target: 100,
      current: 75,
      unit: 'days',
      deadline: '2025-09-15',
      category: 'mindfulness',
      priority: 'high'
    }
  ]);

  const [currentMood, setCurrentMood] = useState<number>(4);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [schedulingHabit, setSchedulingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    targetTime: '',
    category: 'health' as 'health' | 'productivity' | 'mindfulness' | 'social',
    habitType: 'good' as 'good' | 'bad',
    weeklyTarget: 7,
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

  const addHabit = () => {
    const habit: Habit = {
      id: Date.now().toString(),
      ...newHabit,
      streak: 0,
      completedToday: false,
      currentWeekCompleted: 0,
      bestStreak: 0,
      completionRate: 0,
      aiGenerated: true
    };
    
    if (newHabit.habitType === 'bad') {
      // Disable reminder for the bad habit after creation
      habit.reminder = {
        ...habit.reminder,
        enabled: false
      };
      // Create a new array including the new bad habit
      const newHabitsArray = [...habits, habit];
      // Generate the positive habit using the new array
      const positiveHabit: Habit = (() => {
        // Use the same logic as createPositiveHabitForBadHabit, but pass newHabitsArray
        const alternativesList = getPositiveHabitAlternatives(habit.title, habit.category);
        const normalize = (str: string) => str.trim().toLowerCase();
        const badHabitNormTitle = normalize(habit.title);
        const pairedPositiveHabits = newHabitsArray.filter(h =>
          h.habitType === 'good' &&
          h.id.includes('_positive') &&
          h.pairedBadHabitTitle &&
          normalize(h.pairedBadHabitTitle) === badHabitNormTitle
        );
        const usedTitles = pairedPositiveHabits.map(h => normalize(h.title));
        const availableAlternatives = alternativesList.filter(alt =>
          !usedTitles.includes(normalize(alt.title))
        );
        let selectedAlternative;
        if (availableAlternatives.length > 0) {
          selectedAlternative = availableAlternatives[0];
        } else {
          const allCount = pairedPositiveHabits.length;
          const baseIndex = allCount % alternativesList.length;
          const baseAlternative = alternativesList[baseIndex];
          const suffix = Math.floor(allCount / alternativesList.length) + 2;
          selectedAlternative = {
            ...baseAlternative,
            title: `${baseAlternative.title} ${suffix}`
          };
        }
        return {
          id: Date.now().toString() + '_positive',
          title: selectedAlternative.title,
          description: selectedAlternative.description,
          streak: 0,
          completedToday: false,
          category: selectedAlternative.category as 'health' | 'productivity' | 'mindfulness' | 'social',
          habitType: 'good' as const,
          weeklyTarget: 7,
          currentWeekCompleted: 0,
          bestStreak: 0,
          completionRate: 0,
          aiGenerated: false,
          reminder: habit.reminder ? {
            ...habit.reminder,
            enabled: true
          } : {
            enabled: true,
            time: '09:00',
            frequency: 'daily' as const,
            daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
            customInterval: 1,
            customUnit: 'days' as const
          },
          aiSuggestion: `This positive habit will help you replace "${habit.title}". Try to do this instead when you feel the urge for the bad habit.`,
          pairedBadHabitId: habit.id,
          pairedBadHabitTitle: habit.title
        };
      })();
      const updatedHabits = [...habits, habit, positiveHabit];
      setHabits(updatedHabits);
      setTimeout(() => {
        alert(`✅ Positive habit "${positiveHabit.title}" has been automatically created to help you replace "${habit.title}". Only the positive habit will be reminded to help you focus on the replacement!`);
      }, 100);
    } else {
      // Regular good habit
      const updatedHabits = [...habits, habit];
      setHabits(updatedHabits);
    }
    setNewHabit({
      title: '',
      description: '',
      targetTime: '',
      category: 'health',
      habitType: 'good',
      weeklyTarget: 7,
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
  };

  // Function to add a habit from suggestions
  const addHabitFromSuggestion = (newHabit: Habit) => {
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
    setEditingHabit(null);
  };

  const deleteHabit = (habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    
    if (habitToDelete?.habitType === 'bad') {
      // If deleting a bad habit, also delete its positive alternative
      const positiveHabitId = habitId + '_positive';
      setHabits(habits.filter(habit => habit.id !== habitId && habit.id !== positiveHabitId));
    } else if (habitToDelete?.id.includes('_positive')) {
      // If deleting a positive habit, also delete its corresponding bad habit
      const badHabitId = habitId.replace('_positive', '');
      setHabits(habits.filter(habit => habit.id !== habitId && habit.id !== badHabitId));
    } else {
      // Regular habit deletion
      setHabits(habits.filter(habit => habit.id !== habitId));
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completedToday: !habit.completedToday, 
            streak: habit.completedToday ? habit.streak - 1 : habit.streak + 1,
            currentWeekCompleted: habit.completedToday 
              ? (habit.currentWeekCompleted || 0) - 1 
              : (habit.currentWeekCompleted || 0) + 1
          }
        : habit
    ));
  };

  // Separate AI-generated and user-created habits
  const aiGeneratedHabits = habits.filter(h => h.aiGenerated);
  const userCreatedHabits = habits.filter(h => !h.aiGenerated);
  
  // Separate good and bad habits
  const goodHabits = habits.filter(h => h.habitType !== 'bad');
  const badHabits = habits.filter(h => h.habitType === 'bad');

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

  // Function to create a positive habit automatically when a bad habit is added
  const createPositiveHabitForBadHabit = (badHabit: Habit) => {
    const alternativesList = getPositiveHabitAlternatives(badHabit.title, badHabit.category);
    
    // Normalize function for titles
    const normalize = (str: string) => str.trim().toLowerCase();
    const badHabitNormTitle = normalize(badHabit.title);

    // Get all positive habits paired with this bad habit type/title (case-insensitive, trimmed)
    const pairedPositiveHabits = habits.filter(h =>
      h.habitType === 'good' &&
      h.id.includes('_positive') &&
      h.pairedBadHabitTitle &&
      normalize(h.pairedBadHabitTitle) === badHabitNormTitle
    );
    const usedTitles = pairedPositiveHabits.map(h => normalize(h.title));

    // Filter out alternatives that have already been used for this bad habit type/title
    const availableAlternatives = alternativesList.filter(alt =>
      !usedTitles.includes(normalize(alt.title))
    );

    let selectedAlternative;
    if (availableAlternatives.length > 0) {
      // Pick the first unused alternative
      selectedAlternative = availableAlternatives[0];
    } else {
      // All alternatives used, cycle with a numeric suffix
      const allCount = pairedPositiveHabits.length;
      const baseIndex = allCount % alternativesList.length;
      const baseAlternative = alternativesList[baseIndex];
      const suffix = Math.floor(allCount / alternativesList.length) + 2; // Start at 2
      selectedAlternative = {
        ...baseAlternative,
        title: `${baseAlternative.title} ${suffix}`
      };
    }

    const positiveHabit: Habit = {
      id: Date.now().toString() + '_positive',
      title: selectedAlternative.title,
      description: selectedAlternative.description,
      streak: 0,
      completedToday: false,
      category: selectedAlternative.category as 'health' | 'productivity' | 'mindfulness' | 'social',
      habitType: 'good',
      weeklyTarget: 7,
      currentWeekCompleted: 0,
      bestStreak: 0,
      completionRate: 0,
      aiGenerated: false,
      // Copy the reminder settings from the bad habit
      reminder: badHabit.reminder ? {
        ...badHabit.reminder,
        enabled: true // Always enable reminders for positive habits
      } : {
        enabled: true,
        time: '09:00',
        frequency: 'daily' as const,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        customInterval: 1,
        customUnit: 'days' as const
      },
      aiSuggestion: `This positive habit will help you replace "${badHabit.title}". Try to do this instead when you feel the urge for the bad habit.`,
      pairedBadHabitId: badHabit.id,
      pairedBadHabitTitle: badHabit.title
    };

    return positiveHabit;
  };

  // Function to find paired habits (bad habit + positive alternative)
  const findPairedHabits = () => {
    const pairedHabits: { badHabit: Habit; positiveHabit: Habit }[] = [];
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
  const CompactStrengthMeter = ({ habit }: { habit: Habit }) => {
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

    generateGoalForHabit(habit: Habit): Goal {
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
  const generateGoalForHabit = (habit: Habit) => {
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

  const handleScheduleHabit = (habit: Habit) => {
    setSchedulingHabit(habit);
  };

  const updateHabitSchedule = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit));
    setSchedulingHabit(null);
  };

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
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
          <TabsTrigger value="habits" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Target className="w-4 h-4" />
            <span>My Habits</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Sparkles className="w-4 h-4" />
            <span>Suggestions</span>
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
          {/* Add Habit Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900">My Habits</h2>
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
                      ? setEditingHabit({...editingHabit, category: e.target.value as Habit['category']})
                      : setNewHabit({...newHabit, category: e.target.value as Habit['category']})
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
                              ...badHabitDetails, 
                              frequency: Number(e.target.value) 
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
                              ...badHabitDetails, 
                              frequencyUnit: e.target.value as 'times_per_day' | 'times_per_week' 
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
                            ...badHabitDetails, 
                            timeOfDay: e.target.value.split(',').map(t => t.trim()) 
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
                            ...badHabitDetails, 
                            triggers: e.target.value.split(',').map(t => t.trim()) 
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
                            ...badHabitDetails, 
                            severity: e.target.value as 'low' | 'medium' | 'high' 
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
                            ...badHabitDetails, 
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
                            const updatedReminder = { ...reminder, enabled: checked };
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
                                onChange={(e) => {
                                  const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                  const updatedReminder = { ...reminder, time: e.target.value };
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
                                  const updatedReminder = { ...reminder, frequency: value as 'daily' | 'weekly' | 'custom' };
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
                            const updatedReminder = { ...reminder, enabled: checked };
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
                                onChange={(e) => {
                                  const reminder = editingHabit ? editingHabit.reminder : newHabit.reminder;
                                  const updatedReminder = { ...reminder, time: e.target.value };
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
                                  const updatedReminder = { ...reminder, frequency: value as 'daily' | 'weekly' | 'custom' };
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
                  <h3 className="text-2xl font-bold text-gray-900">🤖 AI-Generated Habits</h3>
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
                      onClick={() => updateHabitSchedule(schedulingHabit)}
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

          {/* User Created Good Habits */}
          {userCreatedHabits.filter(h => h.habitType !== 'bad' && !h.id.includes('_positive')).length > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">My Good Habits</h3>
                  <p className="text-gray-600">Habits you've created to improve yourself</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {userCreatedHabits.filter(h => h.habitType !== 'bad' && !h.id.includes('_positive')).map((habit) => (
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
        </TabsContent>
        
        <TabsContent value="suggestions">
          <AdaptiveHabitSuggestionEngine
            habits={habits}
            currentMood={currentMood}
            currentTime={new Date()}
            onAddHabit={addHabit}
            onCompleteHabit={toggleHabit}
            personalityProfile={null}
          />
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
                      {habits.filter(h => h.streak > 0).slice(0, 4).map((habit) => (
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
