import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  Target,
  BrainCircuit,
  Activity,
  Mail,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarCheck,
  Smartphone as Mobile,
  Monitor,
  WifiOff,
  Settings2,
  MapPin
} from 'lucide-react';

interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  completedToday: boolean;
  targetTime?: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'fitness' | 'finance' | 'creative' | 'learning' | 'home' | 'personal';
  aiSuggestion?: string;
  weeklyTarget?: number;
  currentWeekCompleted?: number;
  bestStreak?: number;
  completionRate?: number;
  duration?: number; // in minutes
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  energyLevel?: 'low' | 'medium' | 'high';
  weatherDependent?: boolean;
  requiresEquipment?: boolean;
  socialHabit?: boolean;
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
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  isAllDay?: boolean;
  source: 'google' | 'outlook' | 'phone' | 'apple' | 'manual';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isHabit?: boolean;
  habitId?: string;
}

interface TimeBlock {
  start: Date;
  end: Date;
  duration: number; // in minutes
  type: 'free' | 'busy' | 'suggested' | 'optimal';
  suggestedHabits?: Habit[];
  energyLevel?: 'low' | 'medium' | 'high';
  weather?: string;
  location?: string;
  aiInsight?: string;
}

interface SchedulingConflict {
  id: string;
  type: 'time-conflict' | 'energy-mismatch' | 'location-unavailable' | 'weather-dependent' | 'equipment-needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  conflictingHabit: Habit;
  conflictingEvent?: CalendarEvent;
  suggestedAlternatives: {
    time: Date;
    reason: string;
    confidence: number;
  }[];
  resolved: boolean;
  createdAt: Date;
}

interface AICoordinatedCalendarProps {
  habits: Habit[];
  goals: Goal[];
  onScheduleHabit?: (habitId: string, time: Date) => void;
}

type ViewMode = 'day' | 'week' | 'month' | 'ai-suggestions' | 'time-blocks' | 'calendar-sync' | 'smart-schedule';

export const AICoordinatedCalendar = ({ 
  habits, 
  goals, 
  onScheduleHabit
}: AICoordinatedCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    workStartTime: '09:00',
    workEndTime: '17:00',
    preferredHabitDuration: 30,
    energyPeakHours: ['09:00', '14:00'],
    avoidScheduling: ['12:00', '18:00'],
    weatherConsideration: true,
    locationAwareness: true,
    socialHabitPreference: 'flexible',
    focusTimeBlocks: true,
    autoSchedule: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const [schedulingConflicts, setSchedulingConflicts] = useState<SchedulingConflict[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    enableConflictNotifications: true,
    enableAlternativeSuggestions: true,
    notificationSound: true,
    autoResolveConflicts: false,
    conflictSeverityThreshold: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  // Add missing state variables
  const [connectedCalendars, setConnectedCalendars] = useState<{
    google: boolean;
    outlook: boolean;
    apple: boolean;
  }>({
    google: false,
    outlook: false,
    apple: false
  });
  
  // Simulate calendar connection
  useEffect(() => {
    const simulateConnection = async () => {
      setSyncStatus('syncing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      setSyncStatus('success');
      
      // Simulate calendar events
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Meeting',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 11, 0),
          source: 'google',
          category: 'work'
        },
        {
          id: '2',
          title: 'Lunch with Sarah',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 30),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 13, 30),
          source: 'phone',
          category: 'social'
        },
        {
          id: '3',
          title: 'Client Call',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 15, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 16, 0),
          source: 'outlook',
          category: 'work'
        }
      ];
      setCalendarEvents(mockEvents);
    };
    
    simulateConnection();
  }, [currentDate]);

  // Generate AI suggestions
  useEffect(() => {
    const generateSuggestions = async () => {
      setIsAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = [
        {
          type: 'time-optimization',
          title: 'Optimal Habit Timing',
          description: 'Your productivity peaks at 9 AM. Schedule your most important habits then.',
          priority: 'high',
          impact: '+40% completion rate',
          icon: <Clock className="w-5 h-5" />
        },
        {
          type: 'energy-alignment',
          title: 'Energy-Based Scheduling',
          description: 'Group high-energy habits in the morning, low-energy in the evening.',
          priority: 'medium',
          impact: '+25% consistency',
          icon: <Activity className="w-5 h-5" />
        },
        {
          type: 'conflict-resolution',
          title: 'Schedule Conflict Detected',
          description: 'Your meditation habit conflicts with the team meeting. Consider moving it to 8 AM.',
          priority: 'high',
          impact: 'Avoid missed habits',
          icon: <AlertTriangle className="w-5 h-5" />
        },
        {
          type: 'weather-adaptation',
          title: 'Weather-Aware Scheduling',
          description: 'Rainy day forecast. Move outdoor fitness habits indoors or reschedule.',
          priority: 'medium',
          impact: 'Maintain consistency',
          icon: <AlertTriangle className="w-5 h-5" />
        }
      ];
      
      setAiSuggestions(suggestions);
      setIsAnalyzing(false);
    };
    
    generateSuggestions();
  }, [habits, calendarEvents]);

  // Move helper functions above detectSchedulingConflicts
  const getHabitEnergyLevel = (habit: Habit): 'low' | 'medium' | 'high' => {
    if (habit.category === 'fitness' || habit.category === 'productivity') return 'high';
    if (habit.category === 'mindfulness' || habit.category === 'social') return 'low';
    return 'medium';
  };

  const getTimeEnergyLevel = (time: Date): 'low' | 'medium' | 'high' => {
    const hour = time.getHours();
    if (hour >= 9 && hour <= 11) return 'high';
    if (hour >= 14 && hour <= 16) return 'medium';
    return 'low';
  };

  const getEnergyLevelValue = (level: 'low' | 'medium' | 'high'): number => {
    switch (level) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 2;
    }
  };

  const getCurrentWeather = (): string => {
    // Mock weather data - in real app, this would come from weather API
    return Math.random() > 0.7 ? 'rainy' : 'sunny';
  };

  const isLocationAvailable = (): boolean => {
    // Simulate location availability
    return Math.random() > 0.3;
  };

  // Helper functions for conflict detection
  const generateAlternativeTimes = (habit: Habit, event: CalendarEvent) => {
    const alternatives = [];
    
    // Suggest before the event
    const beforeEvent = new Date(event.start);
    beforeEvent.setMinutes(beforeEvent.getMinutes() - (habit.duration || 30));
    if (beforeEvent.getHours() >= 6) {
      alternatives.push({
        time: beforeEvent,
        reason: `Complete before ${event.title}`,
        confidence: 0.8
      });
    }
    
    // Suggest after the event
    const afterEvent = new Date(event.end);
    alternatives.push({
      time: afterEvent,
      reason: `Complete after ${event.title}`,
      confidence: 0.9
    });
    
    // Suggest next day
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(9, 0, 0, 0);
    alternatives.push({
      time: nextDay,
      reason: 'Reschedule for tomorrow',
      confidence: 0.7
    });
    
    return alternatives;
  };

  const generateEnergyBasedAlternatives = (habit: Habit) => {
    const alternatives = [];
    const habitEnergy = getHabitEnergyLevel(habit);
    
    if (habitEnergy === 'high') {
      // Suggest morning hours for high energy habits
      const morningTime = new Date(currentDate);
      morningTime.setHours(9, 0, 0, 0);
      alternatives.push({
        time: morningTime,
        reason: 'Morning hours are optimal for high-energy activities',
        confidence: 0.8
      });
    } else if (habitEnergy === 'low') {
      // Suggest evening hours for low energy habits
      const eveningTime = new Date(currentDate);
      eveningTime.setHours(19, 0, 0, 0);
      alternatives.push({
        time: eveningTime,
        reason: 'Evening hours are better for low-energy activities',
        confidence: 0.8
      });
    }
    
    return alternatives;
  };

  const generateWeatherAlternatives = () => {
    const alternatives = [];
    
    // Suggest indoor alternatives
    const indoorTime = new Date(currentDate);
    indoorTime.setHours(10, 0, 0, 0);
    alternatives.push({
      time: indoorTime,
      reason: 'Move to indoor location',
      confidence: 0.6
    });
    
    // Suggest next sunny day
    const nextSunnyDay = new Date(currentDate);
    nextSunnyDay.setDate(nextSunnyDay.getDate() + 2);
    nextSunnyDay.setHours(15, 0, 0, 0);
    alternatives.push({
      time: nextSunnyDay,
      reason: 'Wait for better weather',
      confidence: 0.7
    });
    
    return alternatives;
  };

  const generateLocationAlternatives = () => {
    const alternatives = [];
    
    // Suggest alternative locations
    const alternativeTime = new Date(currentDate);
    alternativeTime.setHours(14, 0, 0, 0);
    alternatives.push({
      time: alternativeTime,
      reason: 'Try alternative location',
      confidence: 0.5
    });
    
    // Suggest home-based alternative
    const homeTime = new Date(currentDate);
    homeTime.setHours(20, 0, 0, 0);
    alternatives.push({
      time: homeTime,
      reason: 'Complete at home instead',
      confidence: 0.8
    });
    
    return alternatives;
  };

  const resolveConflict = (conflictId: string) => {
    setSchedulingConflicts(prev => 
      prev.map(conflict => 
        conflict.id === conflictId 
          ? { ...conflict, resolved: true }
          : conflict
      )
    );
    
    toast({
      title: "Conflict Resolved",
      description: "The scheduling conflict has been marked as resolved.",
      duration: 3000
    });
  };

  const viewConflictDetails = (conflict: SchedulingConflict) => {
    // In a real app, this would open a detailed modal
    console.log('Viewing conflict details:', conflict);
  };

  const showConflictNotification = (conflict: SchedulingConflict) => {
    toast({
      title: conflict.title,
      description: (
        <div className="space-y-2">
          <p>{conflict.description}</p>
          {notificationSettings.enableAlternativeSuggestions && conflict.suggestedAlternatives.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Suggested alternatives:</p>
              <div className="space-y-1">
                {conflict.suggestedAlternatives.slice(0, 2).map((alt, idx) => (
                  <div key={idx} className="text-xs">
                    • {alt.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {alt.reason}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      variant: conflict.severity === 'critical' ? 'destructive' : 'default',
      duration: 8000,
      action: (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => resolveConflict(conflict.id)}
          >
            Resolve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => viewConflictDetails(conflict)}
          >
            Details
          </Button>
        </div>
      )
    });
  };

  // Conflict detection function
  const detectSchedulingConflicts = useMemo(() => {
    const conflicts: SchedulingConflict[] = [];
    
    habits.forEach(habit => {
      // Check for time conflicts with calendar events
      calendarEvents.forEach(event => {
        const habitStartTime = new Date(currentDate);
        habitStartTime.setHours(9, 0, 0, 0); // Default habit time
        const habitEndTime = new Date(habitStartTime);
        habitEndTime.setMinutes(habitStartTime.getMinutes() + (habit.duration || 30));
        
        if (habitStartTime < event.end && habitEndTime > event.start) {
          const conflict: SchedulingConflict = {
            id: `conflict-${habit.id}-${event.id}`,
            type: 'time-conflict',
            severity: 'high',
            title: `Time Conflict: ${habit.title} vs ${event.title}`,
            description: `Your ${habit.title} habit conflicts with your ${event.title} event.`,
            conflictingHabit: habit,
            conflictingEvent: event,
            suggestedAlternatives: generateAlternativeTimes(habit, event),
            resolved: false,
            createdAt: new Date()
          };
          
          conflicts.push(conflict);
          
          // Show notification if enabled
          if (notificationSettings.enableConflictNotifications) {
            showConflictNotification(conflict);
          }
        }
      });
      
      // Check for energy level mismatches
      const habitEnergy = getHabitEnergyLevel(habit);
      const timeEnergy = getTimeEnergyLevel(new Date());
      
      if (habitEnergy !== timeEnergy && Math.abs(getEnergyLevelValue(habitEnergy) - getEnergyLevelValue(timeEnergy)) > 1) {
        const conflict: SchedulingConflict = {
          id: `energy-${habit.id}`,
          type: 'energy-mismatch',
          severity: 'medium',
          title: `Energy Mismatch: ${habit.title}`,
          description: `Your ${habit.title} habit requires ${habitEnergy} energy, but current time is optimal for ${timeEnergy} energy activities.`,
          conflictingHabit: habit,
          suggestedAlternatives: generateEnergyBasedAlternatives(habit),
          resolved: false,
          createdAt: new Date()
        };
        
        conflicts.push(conflict);
      }
      
      // Check for weather-dependent conflicts
      if (habit.weatherDependent && getCurrentWeather() === 'rainy') {
        const conflict: SchedulingConflict = {
          id: `weather-${habit.id}`,
          type: 'weather-dependent',
          severity: 'medium',
          title: `Weather Conflict: ${habit.title}`,
          description: `Your ${habit.title} habit is weather-dependent, but current weather is not suitable.`,
          conflictingHabit: habit,
          suggestedAlternatives: generateWeatherAlternatives(),
          resolved: false,
          createdAt: new Date()
        };
        
        conflicts.push(conflict);
      }
      
      // Check for location conflicts
      if (habit.location && !isLocationAvailable()) {
        const conflict: SchedulingConflict = {
          id: `location-${habit.id}`,
          type: 'location-unavailable',
          severity: 'high',
          title: `Location Unavailable: ${habit.title}`,
          description: `Your ${habit.title} habit requires ${habit.location}, but it's currently unavailable.`,
          conflictingHabit: habit,
          suggestedAlternatives: generateLocationAlternatives(),
          resolved: false,
          createdAt: new Date()
        };
        
        conflicts.push(conflict);
      }
    });
    
    return conflicts;
  }, [habits, calendarEvents, currentDate, notificationSettings.enableConflictNotifications]);

  // Run conflict detection when data changes
  useEffect(() => {
    const newConflicts = detectSchedulingConflicts;
    setSchedulingConflicts(prev => {
      // Only add new conflicts that don't already exist
      const existingIds = new Set(prev.map(c => c.id));
      const conflictsToAdd = newConflicts.filter(conflict => !existingIds.has(conflict.id));
      return [...prev, ...conflictsToAdd];
    });
  }, [detectSchedulingConflicts]);

  const applyAlternative = (conflict: SchedulingConflict, alternative: { time: Date; reason: string; confidence: number }) => {
    // Apply the alternative scheduling
    if (onScheduleHabit) {
      onScheduleHabit(conflict.conflictingHabit.id, alternative.time);
    }
    // Mark conflict as resolved
    resolveConflict(conflict.id);
    // Show success notification
    toast({
      title: "Alternative Applied",
      description: `Your ${conflict.conflictingHabit.title} habit has been rescheduled for ${alternative.time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}.`,
      duration: 5000
    });
  };

  // Analyze time blocks
  const analyzeTimeBlocks = useMemo(() => {
    const blocks: TimeBlock[] = [];
    const dayStart = new Date(currentDate);
    dayStart.setHours(6, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(22, 0, 0, 0);
    
    let currentTime = new Date(dayStart);
    
    while (currentTime < dayEnd) {
      const blockEnd = new Date(currentTime);
      blockEnd.setMinutes(currentTime.getMinutes() + 30);
      
      // Check if this time block conflicts with calendar events
      const conflictingEvents = calendarEvents.filter(event => 
        event.start < blockEnd && event.end > currentTime
      );
      
      // Find suitable habits for this time block
      const suitableHabits = habits.filter(habit => {
        if (conflictingEvents.length > 0) return false;
        
        const hour = currentTime.getHours();
        const isWorkHours = hour >= 9 && hour <= 17;
        const isMorning = hour >= 6 && hour <= 10;
        const isEvening = hour >= 18 && hour <= 22;
        
        // Match habits to optimal times
        if (habit.category === 'productivity' && isWorkHours) return true;
        if (habit.category === 'fitness' && (isMorning || isEvening)) return true;
        if (habit.category === 'mindfulness' && (isMorning || isEvening)) return true;
        if (habit.category === 'social' && isEvening) return true;
        
        return true;
      });
      
      const block: TimeBlock = {
        start: new Date(currentTime),
        end: new Date(blockEnd),
        duration: 30,
        type: conflictingEvents.length > 0 ? 'busy' : suitableHabits.length > 0 ? 'optimal' : 'free',
        suggestedHabits: suitableHabits.slice(0, 2),
        energyLevel: currentTime.getHours() >= 9 && currentTime.getHours() <= 11 ? 'high' : 
                    currentTime.getHours() >= 14 && currentTime.getHours() <= 16 ? 'medium' : 'low',
        weather: 'sunny', // Mock weather data
        aiInsight: suitableHabits.length > 0 ? 
          `Perfect time for ${suitableHabits[0].category} habits` : 
          conflictingEvents.length > 0 ? 'Busy with calendar events' : 'Free time available'
      };
      
      blocks.push(block);
      currentTime = blockEnd;
    }
    
    return blocks;
  }, [currentDate, calendarEvents, habits]);

  const connectCalendar = async () => {
    setSyncStatus('syncing');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const generateSmartSchedule = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate AI scheduling
    const scheduledHabits = habits.map(habit => ({
      ...habit,
      suggestedTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 
        Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 4) * 15)
    }));
    
    setAiSuggestions(prev => [...prev, {
      type: 'smart-schedule',
      title: 'AI-Generated Schedule',
      description: 'Optimized schedule created based on your patterns and preferences.',
      priority: 'high',
      impact: '+60% efficiency',
      icon: <BrainCircuit className="w-5 h-5" />,
      scheduledHabits
    }]);
    
    setIsAnalyzing(false);
  };

  const renderDayView = () => (
    <div className="space-y-6">
      {/* Calendar Connection Status */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Calendar Sync</h3>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => connectCalendar()}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => connectCalendar()}
          >
            <Mail className="w-4 h-4" />
            Google Calendar
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => connectCalendar()}
          >
            <Monitor className="w-4 h-4" />
            Outlook Calendar
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => connectCalendar()}
          >
            <Mobile className="w-4 h-4" />
            Phone Calendar
          </Button>
        </div>
      </div>

      {/* Time Blocks Analysis */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Time Block Analysis</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={generateSmartSchedule}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <BrainCircuit className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Generate Smart Schedule'}
          </Button>
        </div>
        
        <div className="space-y-3">
          {analyzeTimeBlocks.slice(0, 16).map((block, index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg border transition-all duration-200 hover:scale-105
                ${block.type === 'busy' 
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                  : block.type === 'optimal' 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {block.start.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${block.type === 'busy' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : block.type === 'optimal' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400'
                    }
                  `}>
                    {block.type === 'busy' ? 'Busy' : block.type === 'optimal' ? 'Optimal' : 'Free'}
                  </div>
                  {block.energyLevel && (
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${block.energyLevel === 'high' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                        : block.energyLevel === 'medium' 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }
                    `}>
                      {block.energyLevel} energy
                    </div>
                  )}
                </div>
                
                {block.suggestedHabits && block.suggestedHabits.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Suggested:</span>
                    {block.suggestedHabits.map((habit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {habit.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {block.aiInsight && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  💡 {block.aiInsight}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conflict Management */}
      {schedulingConflicts.filter(c => !c.resolved).length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 dark:border-orange-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Scheduling Conflicts ({schedulingConflicts.filter(c => !c.resolved).length})
              </h3>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              Needs Attention
            </Badge>
          </div>
          
          <div className="space-y-4">
            {schedulingConflicts.filter(c => !c.resolved).map((conflict) => (
              <div
                key={conflict.id}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${conflict.severity === 'critical' 
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                    : conflict.severity === 'high' 
                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                    : conflict.severity === 'medium' 
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        {conflict.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${conflict.severity === 'critical' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                            : conflict.severity === 'high' 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                            : conflict.severity === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }
                        `}
                      >
                        {conflict.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {conflict.description}
                    </p>
                    
                    {conflict.suggestedAlternatives.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Suggested Alternatives:
                        </p>
                        <div className="space-y-2">
                          {conflict.suggestedAlternatives.map((alternative, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded border"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {alternative.time.toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {alternative.reason}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(alternative.confidence * 100)}% confidence
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => applyAlternative(conflict, alternative)}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveConflict(conflict.id)}
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => viewConflictDetails(conflict)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAISuggestions = () => (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">AI Scheduling Insights</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Our AI analyzes your calendar, habits, and patterns to provide intelligent scheduling recommendations.
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        {aiSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-xl border transition-all duration-200 hover:scale-105
              ${suggestion.priority === 'high' 
                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                p-2 rounded-lg
                ${suggestion.priority === 'high' 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-blue-100 dark:bg-blue-900/30'
                }
              `}>
                {suggestion.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {suggestion.title}
                  </h4>
                  <Badge 
                    variant={suggestion.priority === 'high' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {suggestion.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {suggestion.impact}
                  </span>
                  
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                  
                  <Button size="sm" variant="ghost">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Schedule Generator */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Smart Schedule Generator</h3>
          <Button
            onClick={generateSmartSchedule}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <BrainCircuit className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Generating...' : 'Generate Schedule'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Considerations:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Your energy patterns</li>
              <li>• Calendar conflicts</li>
              <li>• Weather conditions</li>
              <li>• Location availability</li>
              <li>• Social preferences</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Optimization Goals:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Maximize completion rates</li>
              <li>• Minimize scheduling conflicts</li>
              <li>• Balance energy levels</li>
              <li>• Maintain habit consistency</li>
              <li>• Adapt to changing conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarSync = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Calendar Integration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Google Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-red-600" />
                )}
                <Button size="sm" variant="outline">
                  {isConnected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-blue-700" />
                <span className="font-medium">Outlook Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Mobile className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Phone Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Sync Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Auto-sync every 15 minutes</span>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sync habit completions</span>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Block time for habits</span>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Smart notifications</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Events */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Today's Calendar Events</h3>
        
        <div className="space-y-3">
          {calendarEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {event.start.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })} - {event.end.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {event.source}
                </Badge>
                {event.location && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.location}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimeBlocks = () => (
    <div className="space-y-6">
      {/* Time Block Overview */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Time Block Analysis</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {analyzeTimeBlocks.filter(b => b.type === 'optimal').length} Optimal
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {analyzeTimeBlocks.filter(b => b.type === 'busy').length} Busy
            </Badge>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
              {analyzeTimeBlocks.filter(b => b.type === 'free').length} Free
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Block Chart */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Daily Time Distribution</h4>
            <div className="space-y-2">
              {analyzeTimeBlocks.map((block, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-gray-500 dark:text-gray-400">
                    {block.start.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        block.type === 'busy' 
                          ? 'bg-red-500' 
                          : block.type === 'optimal' 
                          ? 'bg-green-500' 
                          : 'bg-gray-400'
                      }`}
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="w-20 text-xs text-gray-500 dark:text-gray-400">
                    {block.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Energy Level Analysis */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Energy Level Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">High Energy (9 AM - 11 AM)</span>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Best for productivity
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Medium Energy (2 PM - 4 PM)</span>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  Good for learning
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Low Energy (6 PM - 8 PM)</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Best for mindfulness
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const getHabitsForDate = () => {
      return habits.filter(() => {
        // Mock filter logic
        return Math.random() > 0.5;
      });
    };

    const getGoalsForDate = () => {
      return goals.filter(() => {
        // Mock filter logic
        return Math.random() > 0.5;
      });
    };

    const isToday = (date: Date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    // Generate calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      calendarDays.push(date);
    }

    return (
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(currentDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          
          <Button
            variant="outline"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(currentDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              if (!date) {
                return (
                  <div key={index} className="min-h-[120px] border-r border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"></div>
                );
              }
              
              const dayHabits = getHabitsForDate();
              const dayGoals = getGoalsForDate();
              const isCurrentDay = isToday(date);
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-600
                    ${isCurrentDay 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                    transition-colors duration-200
                  `}
                >
                  {/* Day Number */}
                  <div className={`
                    text-sm font-medium mb-2
                    ${isCurrentDay 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    {date.getDate()}
                  </div>
                  
                  {/* Habits */}
                  <div className="space-y-1">
                    {dayHabits.slice(0, 2).map((habit, habitIndex) => (
                      <div
                        key={habitIndex}
                        className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 truncate"
                        title={habit.title}
                      >
                        ✅ {habit.title}
                      </div>
                    ))}
                    
                    {/* Goals */}
                    {dayGoals.slice(0, 1).map((goal, goalIndex) => (
                      <div
                        key={goalIndex}
                        className="text-xs p-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 truncate"
                        title={goal.title}
                      >
                        🎯 {goal.title}
                      </div>
                    ))}
                    
                    {/* Show more indicator */}
                    {(dayHabits.length > 2 || dayGoals.length > 1) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{dayHabits.length - 2 + dayGoals.length - 1} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Habits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/30 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Goals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
      </div>
    );
  };

  // Improved Settings Panel Component
  const renderSettingsPanel = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed and blurred background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowSettings(false)} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calendar Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setShowSettings(false)}
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-10">
          {/* Calendar Connections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Calendar Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Google Calendar</span>
                  </div>
                  <Switch 
                    checked={connectedCalendars.google}
                    onCheckedChange={(checked) => {
                      setConnectedCalendars(prev => ({ ...prev, google: checked }));
                      if (checked) connectCalendar();
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sync with your Google Calendar events
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-700" />
                    <span className="font-medium">Outlook Calendar</span>
                  </div>
                  <Switch 
                    checked={connectedCalendars.outlook}
                    onCheckedChange={(checked) => {
                      setConnectedCalendars(prev => ({ ...prev, outlook: checked }));
                      if (checked) connectCalendar();
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sync with your Outlook Calendar events
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mobile className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Phone Calendar</span>
                  </div>
                  <Switch 
                    checked={connectedCalendars.apple}
                    onCheckedChange={(checked) => {
                      setConnectedCalendars(prev => ({ ...prev, apple: checked }));
                      if (checked) connectCalendar();
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sync with your phone calendar events
                </p>
              </div>
            </div>
          </div>
          {/* Scheduling Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Scheduling Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Start Time</label>
                  <Input
                    type="time"
                    value={userPreferences.workStartTime}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, workStartTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work End Time</label>
                  <Input
                    type="time"
                    value={userPreferences.workEndTime}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, workEndTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Habit Duration (minutes)</label>
                  <Input
                    type="number"
                    value={userPreferences.preferredHabitDuration}
                    onChange={(e) => setUserPreferences(prev => ({ ...prev, preferredHabitDuration: parseInt(e.target.value) || 30 }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy Peak Hours</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="time"
                      value={userPreferences.energyPeakHours[0]}
                      onChange={(e) => setUserPreferences(prev => ({ 
                        ...prev, 
                        energyPeakHours: [e.target.value, prev.energyPeakHours[1]] 
                      }))}
                    />
                    <Input
                      type="time"
                      value={userPreferences.energyPeakHours[1]}
                      onChange={(e) => setUserPreferences(prev => ({ 
                        ...prev, 
                        energyPeakHours: [prev.energyPeakHours[0], e.target.value] 
                      }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Weather Consideration</span>
                  <Switch 
                    checked={userPreferences.weatherConsideration}
                    onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, weatherConsideration: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Location Awareness</span>
                  <Switch 
                    checked={userPreferences.locationAwareness}
                    onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, locationAwareness: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Auto Schedule</span>
                  <Switch 
                    checked={userPreferences.autoSchedule}
                    onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, autoSchedule: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Conflict Notifications</span>
                <Switch 
                  checked={notificationSettings.enableConflictNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, enableConflictNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Alternative Suggestions</span>
                <Switch 
                  checked={notificationSettings.enableAlternativeSuggestions}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, enableAlternativeSuggestions: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Notification Sound</span>
                <Switch 
                  checked={notificationSettings.notificationSound}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, notificationSound: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Auto Resolve Conflicts</span>
                <Switch 
                  checked={notificationSettings.autoResolveConflicts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, autoResolveConflicts: checked }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conflict Severity Threshold</label>
                <Select 
                  value={notificationSettings.conflictSeverityThreshold}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                    setNotificationSettings(prev => ({ ...prev, conflictSeverityThreshold: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-900 rounded-b-2xl sticky bottom-0">
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            setShowSettings(false);
            toast({
              title: "Settings Saved",
              description: "Your calendar settings have been updated successfully.",
              duration: 3000
            });
          }}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Coordinated Calendar
            </CardTitle>
            
            {/* View Mode Selector */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50">
              {(['day', 'week', 'month', 'ai-suggestions', 'time-blocks', 'calendar-sync', 'smart-schedule'] as ViewMode[]).map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant={viewMode === mode ? "default" : "ghost"}
                  onClick={() => setViewMode(mode)}
                  className={`
                    ${viewMode === mode 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    transition-all duration-200
                  `}
                >
                  {mode === 'day' && <CalendarDays className="w-4 h-4" />}
                  {mode === 'week' && <Calendar className="w-4 h-4" />}
                  {mode === 'month' && <CalendarCheck className="w-4 h-4" />}
                  {mode === 'ai-suggestions' && <BrainCircuit className="w-4 h-4" />}
                  {mode === 'time-blocks' && <Clock className="w-4 h-4" />}
                  {mode === 'calendar-sync' && <RefreshCw className="w-4 h-4" />}
                  {mode === 'smart-schedule' && <Target className="w-4 h-4" />}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(currentDate.getDate() - 1);
                  setCurrentDate(newDate);
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(currentDate.getDate() + 1);
                  setCurrentDate(newDate);
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Settings */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'ai-suggestions' && renderAISuggestions()}
        {viewMode === 'calendar-sync' && renderCalendarSync()}
        {viewMode === 'time-blocks' && renderTimeBlocks()}
        {viewMode === 'smart-schedule' && renderAISuggestions()}
        {viewMode === 'week' && renderCalendarView()}
        {viewMode === 'month' && renderCalendarView()}
        {showSettings && renderSettingsPanel()}
      </CardContent>
    </Card>
  );
}; 