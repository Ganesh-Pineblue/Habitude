import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Target, 
  Brain, 
  TrendingUp, 
  Activity, 
  Sparkles,
  Lightbulb,
  Plus
} from 'lucide-react';

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
  reminder?: {
    enabled: boolean;
    time: string;
    frequency: 'daily' | 'weekly' | 'custom';
    daysOfWeek?: number[];
    customInterval?: number;
    customUnit?: 'days' | 'weeks' | 'months';
  };
  aiGenerated?: boolean;
}

interface TimeBlock {
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'idle' | 'busy' | 'transition';
  energyLevel: 'low' | 'medium' | 'high';
  context: string;
  suggestedHabits: MicroHabit[];
}

interface MicroHabit {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'health' | 'productivity' | 'mindfulness' | 'social';
  energyRequired: 'low' | 'medium' | 'high';
  context: string[];
  successRate: number; // 0-100
  habitStacking: string[]; // habits this can be stacked with
  aiReasoning: string;
  priority: 'low' | 'medium' | 'high';
}

interface UserPattern {
  wakeTime: string;
  sleepTime: string;
  workHours: { start: string; end: string };
  energyPeaks: string[];
  energyLows: string[];
  commonIdleTimes: string[];
  habitCompletionPatterns: { [habitId: string]: { [time: string]: number } };
  moodPatterns: { [time: string]: number };
  productivityPatterns: { [time: string]: number };
}

interface AdaptiveHabitSuggestionEngineProps {
  habits: Habit[];
  currentMood: number;
  currentTime: Date;
  onAddHabit: (habit: Partial<Habit>) => void;
  onCompleteHabit: (habitId: string) => void;
  personalityProfile?: any;
}

export const AdaptiveHabitSuggestionEngine: React.FC<AdaptiveHabitSuggestionEngineProps> = ({
  habits,
  currentMood,
  currentTime,
  onAddHabit,
  onCompleteHabit,
  personalityProfile
}) => {
  const [currentSuggestions, setCurrentSuggestions] = useState<MicroHabit[]>([]);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Micro-habit library
  const microHabitLibrary: MicroHabit[] = useMemo(() => [
    // Health Micro-habits
    {
      id: 'stretch_break',
      title: 'Quick Stretch Break',
      description: '2-minute full body stretch to improve circulation and reduce stiffness',
      duration: 2,
      category: 'health',
      energyRequired: 'low',
      context: ['after_sitting', 'morning', 'afternoon', 'evening'],
      successRate: 85,
      habitStacking: ['drink_water', 'deep_breathing'],
      aiReasoning: 'Improves blood flow and reduces muscle tension from prolonged sitting',
      priority: 'medium'
    },
    {
      id: 'hydration_reminder',
      title: 'Hydration Check',
      description: 'Drink a glass of water and assess your hydration level',
      duration: 1,
      category: 'health',
      energyRequired: 'low',
      context: ['morning', 'afternoon', 'evening', 'after_exercise'],
      successRate: 90,
      habitStacking: ['stretch_break', 'gratitude_practice'],
      aiReasoning: 'Maintains optimal cognitive function and energy levels',
      priority: 'high'
    },
    {
      id: 'eye_rest',
      title: '20-20-20 Eye Rule',
      description: 'Look at something 20 feet away for 20 seconds to reduce eye strain',
      duration: 1,
      category: 'health',
      energyRequired: 'low',
      context: ['after_screen_time', 'work_breaks', 'afternoon'],
      successRate: 88,
      habitStacking: ['stretch_break', 'deep_breathing'],
      aiReasoning: 'Reduces digital eye strain and improves focus',
      priority: 'medium'
    },

    // Productivity Micro-habits
    {
      id: 'task_planning',
      title: 'Next Action Planning',
      description: 'Identify the next 3 most important actions for your current project',
      duration: 3,
      category: 'productivity',
      energyRequired: 'medium',
      context: ['morning', 'work_start', 'after_break', 'evening'],
      successRate: 78,
      habitStacking: ['gratitude_practice', 'deep_breathing'],
      aiReasoning: 'Clarifies priorities and reduces decision fatigue',
      priority: 'high'
    },
    {
      id: 'desk_organization',
      title: 'Quick Desk Tidy',
      description: 'Spend 2 minutes organizing your workspace for better focus',
      duration: 2,
      category: 'productivity',
      energyRequired: 'low',
      context: ['morning', 'work_start', 'after_break'],
      successRate: 82,
      habitStacking: ['task_planning', 'deep_breathing'],
      aiReasoning: 'Clean environment reduces cognitive load and improves concentration',
      priority: 'medium'
    },
    {
      id: 'learning_snippet',
      title: 'Micro Learning',
      description: 'Read one paragraph or watch a 2-minute educational video',
      duration: 2,
      category: 'productivity',
      energyRequired: 'medium',
      context: ['morning', 'afternoon', 'evening', 'breaks'],
      successRate: 75,
      habitStacking: ['gratitude_practice', 'deep_breathing'],
      aiReasoning: 'Continuous learning builds knowledge incrementally',
      priority: 'medium'
    },

    // Mindfulness Micro-habits
    {
      id: 'deep_breathing',
      title: '3 Deep Breaths',
      description: 'Take 3 slow, deep breaths to center yourself and reduce stress',
      duration: 1,
      category: 'mindfulness',
      energyRequired: 'low',
      context: ['morning', 'afternoon', 'evening', 'stressful_moments', 'transitions'],
      successRate: 92,
      habitStacking: ['gratitude_practice', 'stretch_break'],
      aiReasoning: 'Activates parasympathetic nervous system for calm focus',
      priority: 'high'
    },
    {
      id: 'gratitude_practice',
      title: 'Gratitude Moment',
      description: 'Think of one thing you\'re grateful for right now',
      duration: 1,
      category: 'mindfulness',
      energyRequired: 'low',
      context: ['morning', 'evening', 'breaks', 'challenging_moments'],
      successRate: 89,
      habitStacking: ['deep_breathing', 'hydration_reminder'],
      aiReasoning: 'Shifts focus to positive aspects, improving mood and resilience',
      priority: 'high'
    },
    {
      id: 'present_moment',
      title: 'Present Moment Check',
      description: 'Notice 3 things you can see, hear, and feel right now',
      duration: 2,
      category: 'mindfulness',
      energyRequired: 'low',
      context: ['transitions', 'breaks', 'stressful_moments'],
      successRate: 86,
      habitStacking: ['deep_breathing', 'gratitude_practice'],
      aiReasoning: 'Grounds you in the present, reducing anxiety about past/future',
      priority: 'medium'
    },

    // Social Micro-habits
    {
      id: 'connection_reach',
      title: 'Quick Connection',
      description: 'Send a brief, positive message to someone you care about',
      duration: 2,
      category: 'social',
      energyRequired: 'low',
      context: ['morning', 'afternoon', 'evening', 'breaks'],
      successRate: 80,
      habitStacking: ['gratitude_practice', 'deep_breathing'],
      aiReasoning: 'Strengthens relationships and boosts social well-being',
      priority: 'medium'
    },
    {
      id: 'compliment_giving',
      title: 'Genuine Compliment',
      description: 'Give a sincere compliment to someone you interact with',
      duration: 1,
      category: 'social',
      energyRequired: 'low',
      context: ['work_interactions', 'social_situations', 'daily_encounters'],
      successRate: 85,
      habitStacking: ['gratitude_practice', 'connection_reach'],
      aiReasoning: 'Creates positive social interactions and improves relationships',
      priority: 'medium'
    }
  ], []);

  // Analyze current context and suggest micro-habits
  const analyzeAndSuggest = useMemo(() => {
    console.log('Analyzing suggestions...', { habits: habits.length, currentMood, currentTime: currentTime.toLocaleTimeString() });
    
    // Always return some suggestions - either personalized or demo
    let suggestions = microHabitLibrary.slice(0, 3);
    
    // If no habits, show demo suggestions
    if (!habits.length) {
      setIsDemoMode(true);
      console.log('Demo mode - showing default suggestions:', suggestions);
      return suggestions;
    }

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Determine current context
    let context = 'general';
    let energyLevel: 'low' | 'medium' | 'high' = 'medium';

    if (currentHour < 10) {
      context = 'morning';
      energyLevel = 'high';
    } else if (currentHour < 14) {
      context = 'afternoon';
      energyLevel = 'medium';
    } else if (currentHour < 18) {
      context = 'late_afternoon';
      energyLevel = 'low';
    } else {
      context = 'evening';
      energyLevel = 'low';
    }

    // Add stress context if mood is low
    const isStressful = currentMood <= 2;

    console.log('Context analysis:', { context, energyLevel, isStressful });

    // Filter relevant micro-habits - make it more inclusive
    const relevantHabits = microHabitLibrary.filter(habit => {
      // Always include habits that match the current context
      const contextMatch = habit.context.some(c => 
        c === context || 
        c === 'general' || 
        c === 'breaks' ||
        c === 'transitions' ||
        (c === 'stressful_moments' && isStressful) ||
        (c === 'challenging_moments' && isStressful)
      );

      // Energy matching - be more flexible
      const energyMatch = 
        habit.energyRequired === energyLevel || 
        habit.energyRequired === 'low' || // Low energy habits work in any context
        (energyLevel === 'high' && ['low', 'medium', 'high'].includes(habit.energyRequired)) ||
        (energyLevel === 'medium' && ['low', 'medium'].includes(habit.energyRequired));

      return contextMatch || energyMatch; // Use OR instead of AND to be more inclusive
    });

    console.log('Relevant habits found:', relevantHabits.length);

    // If no habits match, return some default suggestions
    if (relevantHabits.length === 0) {
      console.log('No relevant habits found, using defaults');
      return suggestions;
    }

    // Score and rank suggestions
    const scoredHabits = relevantHabits.map(habit => {
      let score = habit.successRate;

      // Boost score for habits that match current context
      if (habit.context.includes(context)) {
        score += 15;
      }

      // Boost score for mindfulness habits during low mood
      if (isStressful && habit.category === 'mindfulness') {
        score += 20;
      }

      // Boost score for low energy habits during low energy times
      if (energyLevel === 'low' && habit.energyRequired === 'low') {
        score += 10;
      }

      // Boost score for high energy habits during high energy times
      if (energyLevel === 'high' && habit.energyRequired === 'high') {
        score += 10;
      }

      // Personality profile bonuses
      if (personalityProfile?.favoritePersonality) {
        if (personalityProfile.favoritePersonality === 'Einstein' && habit.category === 'productivity') {
          score += 8;
        } else if (personalityProfile.favoritePersonality === 'Gandhi' && habit.category === 'mindfulness') {
          score += 8;
        } else if (personalityProfile.favoritePersonality === 'Oprah' && habit.category === 'social') {
          score += 8;
        }
      }

      return { ...habit, score };
    });

    suggestions = scoredHabits
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log('Final suggestions:', suggestions);
    return suggestions;
  }, [habits, currentTime, currentMood, microHabitLibrary, personalityProfile]);

  // Update suggestions
  useEffect(() => {
    const suggestions = analyzeAndSuggest;
    console.log('Adaptive Suggestions:', suggestions); // Debug log
    setCurrentSuggestions(suggestions);
  }, [analyzeAndSuggest]);

  // Ensure we always have suggestions
  useEffect(() => {
    if (currentSuggestions.length === 0 && microHabitLibrary.length > 0) {
      console.log('No suggestions found, showing default suggestions'); // Debug log
      setCurrentSuggestions(microHabitLibrary.slice(0, 3));
      setIsDemoMode(true);
    }
  }, [currentSuggestions.length, microHabitLibrary]);

  // Get the suggestions to display (with fallback)
  const suggestionsToShow = currentSuggestions.length > 0 ? currentSuggestions : microHabitLibrary.slice(0, 3);

  // Handle micro-habit completion
  const handleMicroHabitComplete = (habit: MicroHabit) => {
    const newHabit: Partial<Habit> = {
      title: habit.title,
      description: habit.description,
      category: habit.category,
      habitType: 'good',
      weeklyTarget: 7,
      aiGenerated: true,
      aiSuggestion: `Suggested during ${currentTime.toLocaleTimeString()}. ${habit.aiReasoning}`,
      reminder: {
        enabled: true,
        time: currentTime.toTimeString().slice(0, 5),
        frequency: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
        customInterval: 1,
        customUnit: 'days'
      }
    };

    onAddHabit(newHabit);
    setCurrentSuggestions(prev => prev.filter(h => h.id !== habit.id));
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="w-4 h-4" />;
      case 'productivity': return <Target className="w-4 h-4" />;
      case 'mindfulness': return <Brain className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Demo Mode Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Adaptive Habit Suggestions</h2>
          <p className="text-gray-600">AI-powered micro-habits based on your current context</p>
        </div>
        {isDemoMode && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Demo Mode
          </Badge>
        )}
      </div>

      {/* Current Time Analysis */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Current Time Analysis</span>
            <Badge variant="outline" className="ml-auto">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-lg font-semibold text-blue-600">
                {currentTime.getHours() < 10 ? 'Morning' : 
                 currentTime.getHours() < 14 ? 'Afternoon' : 
                 currentTime.getHours() < 18 ? 'Late Afternoon' : 'Evening'}
              </div>
              <div className="text-sm text-blue-600">Optimal for focused tasks</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-lg font-semibold text-blue-600">
                {currentMood}/5
              </div>
              <div className="text-sm text-blue-600">Current Mood</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-lg font-semibold text-blue-600">
                {habits.filter(h => h.completedToday).length}/{habits.length}
              </div>
              <div className="text-sm text-blue-600">Habits Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Micro-Habit Suggestions */}
      {(suggestionsToShow.length > 0 || microHabitLibrary.length > 0) && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span>Smart Micro-Habit Suggestions</span>
              <Badge className="ml-auto bg-green-600">
                {suggestionsToShow.length || 3} suggestions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestionsToShow.map((habit) => (
                <div key={habit.id} className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getCategoryIcon(habit.category)}
                        <h3 className="font-semibold text-gray-900">{habit.title}</h3>
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          {habit.duration}min
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {habit.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{habit.successRate}% success rate</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>Priority: {habit.priority}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-xs text-blue-700">
                          <strong>AI Reasoning:</strong> {habit.aiReasoning}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleMicroHabitComplete(habit)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Try Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddHabit({
                          title: habit.title,
                          description: habit.description,
                          category: habit.category,
                          habitType: 'good',
                          weeklyTarget: 7,
                          aiGenerated: true,
                          aiSuggestion: `Suggested during ${currentTime.toLocaleTimeString()}. ${habit.aiReasoning}`
                        })}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add to Habits
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback when no suggestions are available */}
      {suggestionsToShow.length === 0 && microHabitLibrary.length === 0 && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>Quick Micro-Habits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Try These Quick Actions</h3>
              <p className="text-gray-600 mb-4">Simple micro-habits you can do right now</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-2">Take 3 Deep Breaths</h4>
                  <p className="text-sm text-gray-600">Center yourself and reduce stress</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-2">Drink Water</h4>
                  <p className="text-sm text-gray-600">Stay hydrated for better focus</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Stretch</h4>
                  <p className="text-sm text-gray-600">Improve circulation and energy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Analysis */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <span>Pattern Analysis</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className="ml-auto"
            >
              {showDetailedAnalysis ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
        </CardHeader>
        {showDetailedAnalysis && (
          <CardContent>
            <div className="space-y-4">
              {habits.length > 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Habit Completion Patterns</h4>
                  <div className="space-y-2">
                    {habits.map(habit => (
                      <div key={habit.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{habit.title}</span>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={habit.completionRate || 0} 
                            className="w-20 h-2"
                          />
                          <span className="text-xs text-gray-500">
                            {habit.completionRate || 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Add some habits first to see detailed pattern analysis</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}; 