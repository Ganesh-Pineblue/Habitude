import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Lightbulb, Flame, Calendar, BarChart3, Bell, AlertTriangle, XCircle, Trash2, Zap, Target, TrendingUp, Sparkles, Brain, Plus, Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// HabitStrengthMeter integrated directly
import { AICoordinatedCalendar } from '../ai/AICoordinatedCalendar';

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

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onSchedule?: () => void;
  onGenerateGoal?: () => void;
  onDelete?: () => void;
  onAddHabit?: (habit: Habit) => void;
}

const categoryConfig = {
  health: {
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    textLight: 'text-emerald-600',
    textLighter: 'text-emerald-500',
    bgHover: 'hover:bg-emerald-100',
    icon: '🏃‍♂️'
  },
  productivity: {
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
    textLight: 'text-blue-600',
    textLighter: 'text-blue-500',
    bgHover: 'hover:bg-blue-100',
    icon: '⚡'
  },
  mindfulness: {
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-700',
    textLight: 'text-purple-600',
    textLighter: 'text-purple-500',
    bgHover: 'hover:bg-purple-100',
    icon: '🧘‍♀️'
  },
  social: {
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100',
    border: 'border-rose-200',
    text: 'text-rose-700',
    textLight: 'text-rose-600',
    textLighter: 'text-rose-500',
    bgHover: 'hover:bg-rose-100',
    icon: '👥'
  }
};

// Function to generate AI suggestions based on the current habit
const generateHabitSuggestions = (habit: Habit) => {
  const suggestions: Array<{
    title: string;
    description: string;
    category: string;
    reason: string;
  }> = [];

  const habitTitle = habit.title.toLowerCase();
  const habitCategory = habit.category;
  const habitStreak = habit.streak;
  const completionRate = habit.completionRate || 0;

  // Health category suggestions
  if (habitCategory === 'health' || habitTitle.includes('exercise') || habitTitle.includes('workout') || habitTitle.includes('meditation')) {
    if (habitTitle.includes('meditation') || habitTitle.includes('mindfulness')) {
      suggestions.push({
        title: 'Deep Breathing Exercise',
        description: 'Practice 5-10 minutes of deep breathing to enhance your meditation practice',
        category: 'health',
        reason: 'Complements your meditation habit for better stress management'
      });
      suggestions.push({
        title: 'Yoga Stretching',
        description: 'Add gentle yoga stretches to improve flexibility and mindfulness',
        category: 'health',
        reason: 'Builds on your meditation foundation for holistic wellness'
      });
    } else if (habitTitle.includes('exercise') || habitTitle.includes('workout')) {
      suggestions.push({
        title: 'Post-Workout Stretching',
        description: '5-10 minutes of stretching after your workout to prevent injury',
        category: 'health',
        reason: 'Enhances your exercise routine and improves recovery'
      });
      suggestions.push({
        title: 'Hydration Tracking',
        description: 'Drink 8 glasses of water daily to support your fitness goals',
        category: 'health',
        reason: 'Essential for optimal performance during your workouts'
      });
    } else {
      suggestions.push({
        title: 'Morning Walk',
        description: 'Start your day with a 15-minute walk to boost energy',
        category: 'health',
        reason: 'Great complement to your health routine'
      });
    }
  }

  // Productivity category suggestions
  if (habitCategory === 'productivity' || habitTitle.includes('read') || habitTitle.includes('study') || habitTitle.includes('work')) {
    suggestions.push({
      title: 'Pomodoro Technique',
      description: 'Work in 25-minute focused sessions with 5-minute breaks',
      category: 'productivity',
      reason: 'Improves focus and productivity for your work/study habits'
    });
    suggestions.push({
      title: 'Daily Planning',
      description: 'Spend 10 minutes each morning planning your day',
      category: 'productivity',
      reason: 'Helps organize and prioritize your daily tasks'
    });
  }

  // Mindfulness category suggestions
  if (habitCategory === 'mindfulness' || habitTitle.includes('journal') || habitTitle.includes('gratitude')) {
    suggestions.push({
      title: 'Gratitude Practice',
      description: 'Write down 3 things you\'re grateful for each day',
      category: 'mindfulness',
      reason: 'Enhances your mindfulness and positive thinking'
    });
    suggestions.push({
      title: 'Digital Detox Hour',
      description: 'Spend one hour without screens before bed',
      category: 'mindfulness',
      reason: 'Improves sleep quality and mental clarity'
    });
  }

  // Social category suggestions
  if (habitCategory === 'social' || habitTitle.includes('call') || habitTitle.includes('meet')) {
    suggestions.push({
      title: 'Weekly Check-in',
      description: 'Call or message one friend or family member each week',
      category: 'social',
      reason: 'Strengthens your social connections and relationships'
    });
    suggestions.push({
      title: 'Random Act of Kindness',
      description: 'Do one kind thing for someone else each day',
      category: 'social',
      reason: 'Builds positive social interactions and community'
    });
  }

  // Streak-based suggestions
  if (habitStreak >= 7) {
    suggestions.push({
      title: 'Habit Stacking',
      description: 'Add a new habit right after your current successful habit',
      category: habitCategory,
      reason: 'Your strong streak shows you\'re ready to build on this success'
    });
  }

  // Completion rate based suggestions
  if (completionRate < 70) {
    suggestions.push({
      title: 'Habit Reminder Setup',
      description: 'Set up daily reminders to improve consistency',
      category: habitCategory,
      reason: 'Helpful for improving your current completion rate'
    });
  }

  // Default suggestions if none generated
  if (suggestions.length === 0) {
    suggestions.push({
      title: 'Complementary Habit',
      description: 'Add a habit that supports your current goals',
      category: habitCategory,
      reason: 'Builds on your existing habit foundation'
    });
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
};

export const HabitCard = ({ habit, onToggle, onSchedule, onGenerateGoal, onDelete, onAddHabit }: HabitCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const weeklyProgress = habit.weeklyTarget ? (habit.currentWeekCompleted || 0) / habit.weeklyTarget * 100 : 0;
  const isStreakRecord = habit.streak === (habit.bestStreak || 0) && habit.streak > 0;
  const isBadHabit = habit.habitType === 'bad';
  const config = categoryConfig[habit.category];

  const handleToggle = () => {
    const wasCompleted = habit.completedToday;
    onToggle();
    
    // Show celebration if habit was just completed (not uncompleted)
    if (!wasCompleted) {
      // Check if this completion reached the target duration
      const newStreak = habit.streak + 1;
      const reachedTarget = habit.targetDuration && newStreak >= habit.targetDuration;
      
      if (reachedTarget) {
        setShowCelebration(true);
        // Auto-hide after 6 seconds for completion celebration
        setTimeout(() => setShowCelebration(false), 6000);
      } else {
        // Show brief celebration for daily completion
        setShowCelebration(true);
        // Auto-hide after 4 seconds for daily completion
        setTimeout(() => setShowCelebration(false), 4000);
      }
    }
  };

  return (
    <>
      <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] habit-card ${
        isBadHabit 
          ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-lg' 
          : habit.completedToday 
            ? `${config.bg} ${config.border} shadow-lg` 
            : 'bg-white border-gray-200 shadow-md hover:border-gray-300'
      } ${habit.aiGenerated ? 'ring-2 ring-blue-100' : ''}`} data-habit-card>
        
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header with icon and title */}
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg`}>
                  <span className="text-2xl">{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-lg font-bold truncate ${isBadHabit ? 'text-red-900' : 'text-gray-900'}`}>
                    {habit.title}
                  </CardTitle>
                  <p className={`text-sm truncate ${isBadHabit ? 'text-red-600' : 'text-gray-500'}`}>
                    {habit.description}
                  </p>
                </div>
              </div>
              
              {/* Toggle button in top right corner */}
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggle}
                  className={`w-8 h-8 flex items-center justify-center p-0 rounded-xl transition-all duration-300 ${
                    isBadHabit
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-100 border border-red-200'
                      : habit.completedToday 
                        ? `${config.text} ${config.bgHover} border ${config.border}` 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {isBadHabit ? (
                    <XCircle className="w-5 h-5" />
                  ) : habit.completedToday ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  {isBadHabit && habit.badHabitDetails && (
                    <Badge className={`${
                      habit.badHabitDetails.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                      habit.badHabitDetails.severity === 'medium' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`} variant="secondary">
                      {habit.badHabitDetails.severity} severity
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {onSchedule && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSchedule}
                      className="h-10 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-xs font-medium"
                      title="Schedule Habit"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      SCHEDULE
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => { 
                      e.stopPropagation(); 
                      console.log('Suggestion button clicked for:', habit.title);
                      console.log('aiSuggestion:', habit.aiSuggestion);
                      setShowSuggestion(true); 
                    }}
                    className="w-10 h-10 flex items-center justify-center p-0 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    title={`Show AI Suggestion${habit.aiSuggestion ? ': ' + habit.aiSuggestion.substring(0, 30) + '...' : ' (No suggestion available)'}`}
                  >
                    <Lightbulb className="w-6 h-6" />
                  </Button>
                  {onGenerateGoal && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onGenerateGoal}
                      className="w-10 h-10 flex items-center justify-center p-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-200"
                      title="Generate Goal"
                    >
                      <Target className="w-6 h-6" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCalendar(true)}
                    className="w-10 h-10 flex items-center justify-center p-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    title="AI Coordinated Calendar"
                  >
                    <Calendar className="w-6 h-6" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDelete}
                      className="w-10 h-10 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-6 h-6" />
                  </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">

            {/* Bad Habit Specific Info */}
            {isBadHabit && habit.badHabitDetails && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-800">Bad Habit Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-red-700">
                  <div className="bg-white/50 p-2 rounded-lg">
                    <span className="font-medium">Frequency:</span>
                    <div>{habit.badHabitDetails.frequency} {habit.badHabitDetails.frequencyUnit.replace('_', ' ')}</div>
                  </div>
                  {habit.badHabitDetails.timeOfDay && habit.badHabitDetails.timeOfDay.length > 0 && (
                    <div className="bg-white/50 p-2 rounded-lg">
                      <span className="font-medium">Times:</span>
                      <div>{habit.badHabitDetails.timeOfDay.join(', ')}</div>
                    </div>
                  )}
                  {habit.badHabitDetails.triggers && habit.badHabitDetails.triggers.length > 0 && (
                    <div className="bg-white/50 p-2 rounded-lg col-span-2">
                      <span className="font-medium">Triggers:</span>
                      <div>{habit.badHabitDetails.triggers.join(', ')}</div>
                    </div>
                  )}
                  {habit.badHabitDetails.impact && (
                    <div className="bg-white/50 p-2 rounded-lg col-span-2">
                      <span className="font-medium">Impact:</span>
                      <div>{habit.badHabitDetails.impact}</div>
                    </div>
                  )}
                </div>
              </div>
            )}



            {/* Progress - Only show for good habits */}
            {!isBadHabit && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Weekly Progress</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    {habit.currentWeekCompleted || 0} / {habit.weeklyTarget || 7}
                  </span>
                </div>
                <Progress 
                  value={habit.weeklyTarget ? ((habit.currentWeekCompleted || 0) / habit.weeklyTarget) * 100 : 0} 
                  className="h-3 bg-green-100" 
                />
              </div>
            )}
            
            {/* Streak Information */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              isBadHabit ? 'bg-gradient-to-r from-red-100 to-rose-100' : `${config.bg}`
            }`}>
              <div className="flex items-center space-x-2">
                <Flame className={`w-6 h-6 ${isBadHabit ? 'text-red-600' : config.textLight}`} />
                <div>
                  <div className={`text-lg font-bold ${isBadHabit ? 'text-red-700' : config.text}`}>
                    {habit.streak}
                  </div>
                  <div className={`text-xs ${isBadHabit ? 'text-red-600' : config.textLight}`}>
                    day streak
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${isBadHabit ? 'text-red-600' : config.textLight}`}>
                  Best: {habit.bestStreak || habit.streak} days
                </div>
                <div className={`text-xs ${isBadHabit ? 'text-red-500' : config.textLighter}`}>
                  {habit.completionRate || 0}% completion
                </div>
              </div>
            </div>



            {/* No Target Duration Set */}
            {!isBadHabit && !habit.targetDuration && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Target Duration Not Set</span>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Set a target duration to track when this habit will be considered established
                </p>
              </div>
            )}

            {/* Schedule Information */}
            {(habit.targetTime || (habit.reminder && habit.reminder.enabled)) && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Schedule Information</span>
                </div>
                
                <div className="space-y-3">
                  {/* Target Time */}
                  {habit.targetTime && (
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Target Time:</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">
                        {habit.targetTime}
                      </span>
                    </div>
                  )}
                  
                  {/* Reminder Information */}
                  {habit.reminder && habit.reminder.enabled && (
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Reminder:</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-800">
                          {habit.reminder.time}
                        </span>
                        <div className="text-xs text-blue-600">
                          {(() => {
                            const frequency = habit.reminder.frequency;
                            if (frequency === 'daily') {
                              return 'Daily';
                            } else if (frequency === 'weekly') {
                              const days = habit.reminder.daysOfWeek?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'Mon, Tue, Wed, Thu, Fri';
                              return `Weekly on ${days}`;
                            } else if (frequency === 'custom') {
                              const interval = habit.reminder.customInterval;
                              const unit = habit.reminder.customUnit;
                              return `Every ${interval} ${unit}`;
                            }
                            return '';
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}




          </div>
        </CardContent>
      </Card>

      {/* Progress Details Popup */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Progress Details - {habit.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">

            {/* Detailed Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Streak Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="font-medium">{habit.streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Streak:</span>
                    <span className="font-medium">{habit.bestStreak || habit.streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium">{habit.completionRate || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Weekly Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Week:</span>
                    <span className="font-medium">{habit.currentWeekCompleted || 0} / {habit.weeklyTarget || 7}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{Math.round(weeklyProgress)}%</span>
                  </div>
                  <Progress value={weeklyProgress} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suggestion Details Dialog */}
      <Dialog open={showSuggestion} onOpenChange={setShowSuggestion}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>AI Suggestions for "{habit.title}"</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Current Habit Context */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Current Habit Context</span>
              </div>
              <p className="text-blue-700 text-sm">
                <strong>{habit.title}</strong>: {habit.description}
                {habit.streak > 0 && ` • ${habit.streak} day streak`}
                {habit.completionRate && ` • ${habit.completionRate}% completion rate`}
              </p>
            </div>

            {/* AI Generated Suggestions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>AI Suggestions</span>
              </h3>
              
              {(() => {
                // Generate AI suggestions based on the current habit
                const suggestions = generateHabitSuggestions(habit);
                return suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <span className="font-semibold text-yellow-800 truncate">{suggestion.title}</span>
                        </div>
                        <p className="text-yellow-700 text-sm mb-3 break-words">{suggestion.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-yellow-600 flex-wrap">
                          <span className="px-2 py-1 bg-yellow-100 rounded-full">{suggestion.category}</span>
                          <span>•</span>
                          <span className="break-words">{suggestion.reason}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          // Add the suggested habit
                          const newHabit = {
                            id: Date.now().toString(),
                            title: suggestion.title,
                            description: suggestion.description,
                            streak: 0,
                            completedToday: false,
                            category: suggestion.category as 'health' | 'productivity' | 'mindfulness' | 'social',
                            habitType: 'good' as const,
                            weeklyTarget: 7,
                            currentWeekCompleted: 0,
                            bestStreak: 0,
                            completionRate: 0,
                            aiGenerated: true,
                            aiSuggestion: `Suggested based on your "${habit.title}" habit. ${suggestion.reason}`
                          };
                          
                          // Call the parent's onAddHabit function if available
                          if (onAddHabit) {
                            onAddHabit(newHabit);
                            alert(`✅ Habit "${suggestion.title}" has been added to your dashboard!`);
                          } else {
                            console.log('Adding suggested habit:', newHabit);
                            alert(`✅ Habit "${suggestion.title}" has been added to your dashboard!`);
                          }
                          
                          setShowSuggestion(false);
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Habit
                      </Button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Existing AI Insight (if any) */}
            {habit.aiSuggestion && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">Current AI Insight</span>
                </div>
                <p className="text-purple-700 break-words">{habit.aiSuggestion}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <Button onClick={() => setShowSuggestion(false)} variant="outline">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Coordinated Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>AI Coordinated Calendar - {habit.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] overflow-y-auto">
            <AICoordinatedCalendar
              habits={[habit]}
              goals={[]}
              onScheduleHabit={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Celebration Popup */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="max-w-md border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="text-center p-6">
            {/* Confetti-like decoration */}
            <div className="absolute top-4 left-4 animate-bounce">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute top-4 left-12 animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Trophy className="w-6 h-6 text-orange-500" />
            </div>
            <div className="absolute bottom-4 left-4 animate-bounce" style={{ animationDelay: '0.4s' }}>
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            <div className="absolute bottom-4 right-4 animate-bounce" style={{ animationDelay: '0.6s' }}>
              <Star className="w-6 h-6 text-pink-500" />
            </div>

            {/* Main celebration content */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              {habit.targetDuration && habit.streak >= habit.targetDuration ? (
                // Habit completed (reached target duration)
                <>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    🎉 Habit Established! 🎉
                  </h2>
                  
                  <p className="text-green-700 mb-4">
                    Congratulations! You've successfully established <strong>"{habit.title}"</strong>!
                  </p>

                  {/* Completion information */}
                  <div className="bg-white/60 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-bold text-green-700">
                        {habit.streak} Days Completed!
                      </span>
                    </div>
                    
                    <div className="text-sm text-green-600 font-medium">
                      🏆 You've reached your target of {habit.targetDuration} days!
                    </div>
                    
                    <div className="text-sm text-green-600 mt-2">
                      This habit is now part of your established routine. Keep it up!
                    </div>
                  </div>
                </>
              ) : (
                // Daily completion
                <>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    🎉 Habit Completed! 🎉
                  </h2>
                  
                  <p className="text-green-700 mb-4">
                    Great job completing <strong>"{habit.title}"</strong>!
                  </p>

                  {/* Streak information */}
                  <div className="bg-white/60 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-lg font-bold text-orange-700">
                        {habit.streak} Day{habit.streak !== 1 ? 's' : ''} Streak!
                      </span>
                    </div>
                    
                    {habit.targetDuration ? (
                      <div className="text-sm text-green-600 font-medium">
                        {habit.targetDuration - habit.streak} days left to establish this habit
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-600 font-medium">
                        Set a target duration to track habit establishment
                      </div>
                    )}
                    
                    {habit.streak >= 7 && (
                      <div className="text-sm text-green-600 font-medium">
                        🔥 You're on fire! Keep the momentum going!
                      </div>
                    )}
                    
                    {habit.streak >= 30 && (
                      <div className="text-sm text-purple-600 font-medium">
                        💎 Diamond level consistency! You're unstoppable!
                      </div>
                    )}
                    
                    {isStreakRecord && (
                      <div className="text-sm text-blue-600 font-medium">
                        🏆 New personal record! Amazing work!
                      </div>
                    )}
                  </div>

                  {/* Encouraging message based on streak */}
                  <div className="text-sm text-green-600">
                    {habit.streak === 1 && "Every journey begins with a single step. You've taken yours!"}
                    {habit.streak === 2 && "Two days in a row! You're building momentum!"}
                    {habit.streak === 3 && "Three days! They say it takes 3 days to start a habit. You're doing it!"}
                    {habit.streak === 7 && "A full week! You're officially building a habit!"}
                    {habit.streak === 14 && "Two weeks strong! You're becoming consistent!"}
                    {habit.streak === 21 && "Three weeks! You're approaching habit mastery!"}
                    {habit.streak === 30 && "A full month! You're a habit champion!"}
                    {habit.streak > 30 && "Incredible consistency! You're an inspiration!"}
                    {habit.streak > 1 && habit.streak < 7 && "Keep going! Every day counts!"}
                  </div>
                </>
              )}
            </div>

            <Button 
              onClick={() => setShowCelebration(false)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
            >
              {habit.targetDuration && habit.streak >= habit.targetDuration ? 'Continue Excellence! 💪' : 'Keep Going! 💪'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
