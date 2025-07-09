import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Flame,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Award,
  Brain,
  Heart,
  Smile,
  Trophy,
  Calendar
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface MoodData {
  date: string;
  mood: number;
  emoji: string;
  reason: string;
  label: string;
  sharpChange: boolean;
}

interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  completedToday: boolean;
  targetTime?: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social';
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
  personalityInspiration?: string;
}

interface MoodReportProps {
  habits?: Habit[];
  goals?: Goal[];
  defaultTab?: 'mood' | 'habits' | 'goals' | 'correlation' | 'insights';
}

const generateMockMoodData = (): MoodData[] => {
  const reasons = [
    'Had a great workout',
    'Work was stressful',
    'Spent time with family',
    'Achieved a goal',
    'Feeling tired',
    'Good news received',
    'Weather was nice',
    'Had conflicts',
    'Relaxing day',
    'Productive day'
  ];

  const moodEmojis = [
    { emoji: '😢', label: 'Very Sad' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😊', label: 'Good' },
    { emoji: '😄', label: 'Great' },
  ];

  const data: MoodData[] = [];
  let prevMood = 0;
  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const mood = Math.floor(Math.random() * 5);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood,
      emoji: moodEmojis[mood].emoji,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      label: moodEmojis[mood].label,
      sharpChange: i > 0 ? Math.abs(mood - prevMood) > 2 : false,
    });
    prevMood = mood;
  }
  return data;
};

// Generate enhanced goal data with more detailed analytics
const generateEnhancedGoalData = (goals: Goal[] = []) => {
  const mockGoals: Goal[] = [
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
    },
    {
      id: '4',
      title: 'Run 500 Miles',
      description: 'Build endurance and cardiovascular health',
      target: 500,
      current: 320,
      unit: 'miles',
      deadline: '2025-11-30',
      category: 'fitness',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Learn Spanish',
      description: 'Achieve conversational fluency',
      target: 100,
      current: 45,
      unit: 'lessons',
      deadline: '2025-10-15',
      category: 'productivity',
      priority: 'low'
    }
  ];
  
  const goalsData = goals.length > 0 ? goals : mockGoals;
  
  // Generate weekly progress data for each goal
  const weeklyProgressData = goalsData.map(goal => {
    const weeks = [];
    const totalWeeks = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    for (let i = 0; i < Math.min(totalWeeks, 12); i++) {
      const weekProgress = Math.min(goal.current / goal.target, 1) * (i + 1) / totalWeeks;
      weeks.push({
        week: `Week ${i + 1}`,
        progress: Math.round(weekProgress * 100),
        target: Math.round(((i + 1) / totalWeeks) * 100),
        category: goal.category,
        goalTitle: goal.title
      });
    }
    return weeks;
  }).flat();

  // Generate monthly trend data
  const monthlyTrendData = goalsData.map(goal => ({
    month: new Date().toLocaleDateString('en-US', { month: 'short' }),
    goal: goal.title,
    progress: Math.round((goal.current / goal.target) * 100),
    category: goal.category,
    priority: goal.priority,
    daysLeft: Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }));

  // Generate goal completion timeline
  const timelineData = goalsData.map(goal => ({
    goal: goal.title,
    startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    endDate: new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    progress: Math.round((goal.current / goal.target) * 100),
    category: goal.category,
    status: goal.current >= goal.target ? 'completed' : goal.current / goal.target > 0.7 ? 'on-track' : 'needs-attention'
  }));

  return {
    weeklyProgress: weeklyProgressData,
    monthlyTrend: monthlyTrendData,
    timeline: timelineData,
    goals: goalsData
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xl">{data.emoji}</span>
          <span className="text-sm text-gray-600">{data.label}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Reason: {data.reason}</p>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={payload.sharpChange ? 12 : 8}
        fill={payload.sharpChange ? "#f87171" : "white"}
        stroke="#10b981"
        strokeWidth={2}
      />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="16">
        {payload.emoji}
      </text>
    </g>
  );
};

const pieColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export const MoodReport: React.FC<MoodReportProps> = ({ habits = [], goals = [], defaultTab = 'mood' }) => {
  const [moodData] = useState<MoodData[]>(generateMockMoodData());
  // const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalHabits = habits.length || 4;
    const completedToday = habits.filter(h => h.completedToday).length || Math.floor(Math.random() * totalHabits);
    const averageStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0) / totalHabits;
    const bestStreak = Math.max(...habits.map(h => h.bestStreak || h.streak), 10);
    const completionRate = (completedToday / totalHabits) * 100;
    
    return {
      totalHabits,
      completedToday,
      averageStreak: Math.round(averageStreak * 10) / 10,
      bestStreak,
      completionRate: Math.round(completionRate)
    };
  }, [habits]);

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    const averageMood = moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length;
    const bestDay = moodData.find(day => day.mood === Math.max(...moodData.map(d => d.mood)));
    const worstDay = moodData.find(day => day.mood === Math.min(...moodData.map(d => d.mood)));
    
    return {
      averageMood: averageMood.toFixed(1),
      bestDay,
      worstDay,
      totalDays: moodData.length
    };
  }, [moodData]);

  // Enhanced goal data with detailed analytics
  const enhancedGoalData = useMemo(() => generateEnhancedGoalData(goals), [goals]);
  const goalsData = enhancedGoalData.goals;

  // Goal analytics
  const totalGoals = goalsData.length;
  const completedGoals = goalsData.filter(g => g.current >= g.target).length;
  const totalProgress = goalsData.reduce((sum, goal) => sum + Math.min(goal.current / goal.target, 1), 0) / (goalsData.length || 1) * 100;
  const urgentGoals = goalsData.filter(g => {
    const daysLeft = Math.ceil((new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && g.current < g.target;
  }).length;
  const categoryGoalData = ['health', 'productivity', 'mindfulness', 'social', 'fitness'].map(category => {
    const catGoals = goalsData.filter(g => g.category === category);
    const completed = catGoals.filter(g => g.current >= g.target).length;
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      total: catGoals.length,
      completed,
      progress: catGoals.length > 0 ? Math.round(catGoals.reduce((sum, g) => sum + Math.min(g.current / g.target, 1), 0) / catGoals.length * 100) : 0,
      color: (() => {
        const colors = {
          health: '#10b981',
          productivity: '#3b82f6',
          mindfulness: '#8b5cf6',
          social: '#f59e0b',
          fitness: '#f43f5e'
        };
        return colors[category as keyof typeof colors] || '#6b7280';
      })()
    };
  });

  return (
    <div className="w-full space-y-6">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Wellness Report</h3>
        <p className="text-sm text-gray-600">Track your mood and habit patterns to understand your wellness journey</p>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Today's Habits</p>
                <p className="text-2xl font-bold text-green-800">
                  <AnimatedNumber value={overallStats.completedToday} duration={1200} />
                  /
                  <AnimatedNumber value={overallStats.totalHabits} duration={1200} delay={200} />
                </p>
                <p className="text-xs text-green-600">
                  <AnimatedNumber value={overallStats.completionRate} suffix="%" duration={1000} /> completion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Smile className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Average Mood</p>
                <p className="text-2xl font-bold text-blue-800">
                  <AnimatedNumber value={parseFloat(moodStats.averageMood)} duration={1200} decimals={1} />/4
                </p>
                <p className="text-xs text-blue-600">last 10 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Best Streak</p>
                <p className="text-2xl font-bold text-purple-800">
                  <AnimatedNumber value={overallStats.bestStreak} duration={1200} />
                </p>
                <p className="text-xs text-purple-600">days achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700">Consistency</p>
                <p className="text-2xl font-bold text-orange-800">
                  <AnimatedNumber value={Math.round(habits.reduce((sum, h) => sum + (h.completionRate ?? 0), 0) / Math.max(habits.length, 1))} suffix="%" duration={1200} />
                </p>
                <p className="text-xs text-orange-600">overall rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
          <TabsTrigger value="mood" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Heart className="w-4 h-4" />
            <span>Mood</span>
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Target className="w-4 h-4" />
            <span>Habits</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-white">
            <Trophy className="w-4 h-4" />
            <span>Goals</span>
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <TrendingUp className="w-4 h-4" />
            <span>Correlation</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Brain className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Mood Tab */}
        <TabsContent value="mood" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Your Mood Journey</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData} margin={{ top: 20, right: 30, left: 50, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      domain={[0, 4]}
                      ticks={[0, 1, 2, 3, 4]}
                      tickFormatter={(value) => {
                        const labels = ['Very Sad', 'Sad', 'Neutral', 'Good', 'Great'];
                        return labels[value] || '';
                      }}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={<CustomDot />}
                      activeDot={{ r: 12, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2">Mood Summary</h4>
                <div className="flex items-center justify-between text-xs text-green-700">
                  <span>Average Mood: {moodStats.averageMood}/4</span>
                  <span>Best Day: {moodStats.bestDay?.date}</span>
                  <span>Total Days Tracked: {moodStats.totalDays}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-6">
          {/* Habit Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-green-100 to-green-50 min-h-[120px] flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-2xl p-2 shadow-md bg-green-500/20">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-0.5">Total Habits</div>
                    <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                      <AnimatedNumber value={habits.length} duration={1200} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-100 to-blue-50 min-h-[120px] flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-2xl p-2 shadow-md bg-blue-500/20">
                    <Flame className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-0.5">Best Streak</div>
                    <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                      <AnimatedNumber value={Math.max(...habits.map(h => h.streak || 0))} duration={1200} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-purple-100 to-purple-50 min-h-[120px] flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-2xl p-2 shadow-md bg-purple-500/20">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-0.5">Today's Progress</div>
                    <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                      <AnimatedNumber value={habits.filter(h => h.completedToday).length} duration={1200} />
                      /
                      <AnimatedNumber value={habits.length} duration={1200} delay={200} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-orange-100 to-orange-50 min-h-[120px] flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-2xl p-2 shadow-md bg-orange-500/20">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-0.5">Avg Completion</div>
                    <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                      <AnimatedNumber value={Math.round(habits.reduce((sum, h) => sum + (h.completionRate ?? 0), 0) / habits.length)} suffix="%" duration={1200} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Habit Performance Matrix */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800">
                <Target className="w-5 h-5" />
                <span>Habit Performance Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map((habit) => {
                  const progress = habit.completionRate ?? 0;
                  const streak = habit.streak || 0;
                  const categoryColor = {
                    health: 'bg-green-100 border-green-300',
                    productivity: 'bg-blue-100 border-blue-300',
                    mindfulness: 'bg-purple-100 border-purple-300',
                    social: 'bg-orange-100 border-orange-300'
                  }[habit.category];
                  
                  return (
                    <Card key={habit.id} className={`border-2 ${categoryColor} shadow-md hover:shadow-lg transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800 text-sm">{habit.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            habit.completedToday ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                          }`}>
                            {habit.completedToday ? 'Done' : 'Pending'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Completion</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                progress >= 80 ? 'bg-green-500' :
                                progress >= 60 ? 'bg-yellow-500' :
                                progress >= 40 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Streak: {streak} days</span>
                            <span className="capitalize">{habit.category}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Performance Analysis */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-cyan-800">
                <Activity className="w-5 h-5" />
                <span>Time Performance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    morning: { color: "#10b981", label: "Morning" },
                    afternoon: { color: "#3b82f6", label: "Afternoon" },
                    evening: { color: "#8b5cf6", label: "Evening" },
                    night: { color: "#f59e0b", label: "Night" }
                  }}
                  className="h-full"
                >
                  <BarChart data={habits.map(h => ({
                    habit: h.title,
                    morning: 0, // Removed h.timePerformance?.morning
                    afternoon: 0, // Removed h.timePerformance?.afternoon
                    evening: 0, // Removed h.timePerformance?.evening
                    night: 0 // Removed h.timePerformance?.night
                  }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="habit" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="morning" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="afternoon" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="evening" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="night" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Habit Insights & Recommendations */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-violet-800">
                <Brain className="w-5 h-5" />
                <span>Habit Insights & Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Performers */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-3">🏆 Top Performing Habits</h4>
                  <div className="space-y-3">
                    {habits
                      .sort((a, b) => (b.completionRate ?? 0) - (a.completionRate ?? 0))
                      .slice(0, 3)
                      .map((habit, index) => (
                        <div key={habit.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{habit.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{habit.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{habit.completionRate}%</p>
                            <p className="text-xs text-gray-500">{habit.streak} day streak</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📈 Areas for Improvement</h4>
                  <div className="space-y-3">
                    {habits
                      .sort((a, b) => (a.completionRate ?? 0) - (b.completionRate ?? 0))
                      .slice(0, 3)
                      .map((habit, index) => (
                        <div key={habit.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-red-500">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{habit.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{habit.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600">{habit.completionRate}%</p>
                            <p className="text-xs text-gray-500">{habit.streak} day streak</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Smart Recommendations */}
              <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">💡 Smart Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-1">Best Time to Build Habits</h5>
                    <p className="text-sm text-green-700">
                      Your morning habits show the highest success rate. Consider adding more habits to your morning routine.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-1">Category Focus</h5>
                    <p className="text-sm text-blue-700">
                      {habits.reduce((best, habit) => 
                        (habit.completionRate ?? 0) > (best.completionRate ?? 0) ? habit : best
                      ).category} habits are your strongest category. Use this momentum!
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-purple-800 mb-1">Streak Strategy</h5>
                    <p className="text-sm text-purple-700">
                      Focus on maintaining your {Math.max(...habits.map(h => h.streak || 0))} day streak. 
                      Consistency is key to habit formation.
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <h5 className="font-medium text-orange-800 mb-1">Weekly Planning</h5>
                    <p className="text-sm text-orange-700">
                      Plan your most challenging habits for your best performing days to increase success rate.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span>Goal Progress & Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-100 to-blue-50 min-h-[120px] flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-2xl p-2 shadow-md bg-blue-500/20">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-0.5">Total Goals</div>
                        <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                          <AnimatedNumber value={totalGoals} duration={1200} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-orange-100 to-orange-50 min-h-[120px] flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-2xl p-2 shadow-md bg-orange-500/20">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-0.5">Avg Progress</div>
                        <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                          <AnimatedNumber value={Number(totalProgress.toFixed(0))} suffix="%" duration={1200} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-purple-100 to-purple-50 min-h-[120px] flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-2xl p-2 shadow-md bg-purple-500/20">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-0.5">Urgent</div>
                        <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                          <AnimatedNumber value={urgentGoals} duration={1200} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-green-100 to-green-50 min-h-[120px] flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-2xl p-2 shadow-md bg-green-500/20">
                        <Trophy className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-0.5">Completed</div>
                        <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                          <AnimatedNumber value={completedGoals} duration={1200} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Goal Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Goal Progress Timeline */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-indigo-800">
                      <Activity className="w-5 h-5" />
                      <span>Goal Progress Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ChartContainer
                        config={{
                          progress: { color: "#10b981", label: "Progress" },
                          target: { color: "#3b82f6", label: "Target" }
                        }}
                        className="h-full"
                      >
                        <LineChart data={enhancedGoalData.weeklyProgress.slice(-8)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="week" stroke="#888888" fontSize={12} />
                          <YAxis stroke="#888888" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="progress"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "white" }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Goal Category Distribution */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-emerald-800">
                      <PieChart className="w-5 h-5" />
                      <span>Goal Categories</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ChartContainer
                        config={categoryGoalData.reduce((acc: any, cat) => {
                          acc[cat.category] = { color: cat.color, label: cat.category };
                          return acc;
                        }, {})}
                        className="h-full"
                      >
                        <PieChart>
                          <Pie
                            data={categoryGoalData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="total"
                            label={({ category, total }) => `${category}: ${total}`}
                          >
                            {categoryGoalData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Goal Priority Matrix */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-amber-800">
                    <Target className="w-5 h-5" />
                    <span>Goal Priority Matrix</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goalsData.map((goal) => {
                      const progress = Math.round((goal.current / goal.target) * 100);
                      const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const priorityColor = {
                        high: 'bg-red-100 border-red-300',
                        medium: 'bg-yellow-100 border-yellow-300',
                        low: 'bg-green-100 border-green-300'
                      }[goal.priority];
                      
                      return (
                        <Card key={goal.id} className={`border-2 ${priorityColor} shadow-md hover:shadow-lg transition-shadow`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800 text-sm">{goal.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                goal.priority === 'high' ? 'bg-red-500 text-white' :
                                goal.priority === 'medium' ? 'bg-yellow-500 text-white' :
                                'bg-green-500 text-white'
                              }`}>
                                {goal.priority}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    progress >= 80 ? 'bg-green-500' :
                                    progress >= 60 ? 'bg-yellow-500' :
                                    progress >= 40 ? 'bg-orange-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{goal.current}/{goal.target} {goal.unit}</span>
                                <span>{daysLeft} days left</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlation Tab */}
        <TabsContent value="correlation" className="space-y-6">
          {/* Mood & Habit Correlation */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Mood & Habit Correlation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      health: { color: "#10b981", label: "Health" },
                      productivity: { color: "#3b82f6", label: "Productivity" },
                      mindfulness: { color: "#8b5cf6", label: "Mindfulness" },
                      social: { color: "#f59e0b", label: "Social" }
                    }}
                    className="h-full"
                  >
                    <BarChart data={habits.map(h => ({
                      category: h.category,
                      completionRate: h.completionRate ?? 0
                    }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#888888" fontSize={12} />
                      <YAxis dataKey="category" type="category" stroke="#888888" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completionRate" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>

                <div className="h-80">
                  <ChartContainer
                    config={{
                      health: { color: "#10b981", label: "Health" },
                      productivity: { color: "#3b82f6", label: "Productivity" },
                      mindfulness: { color: "#8b5cf6", label: "Mindfulness" },
                      social: { color: "#f59e0b", label: "Social" }
                    }}
                    className="h-full"
                  >
                    <PieChart>
                      <Pie
                        data={habits.map(h => ({
                          category: h.category,
                          completedHabits: h.completedToday ? 100 : 0
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="completedHabits"
                        label={({ category, completedHabits }) => `${category}: ${Math.round(completedHabits)}%`}
                      >
                        {habits.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habit & Goal Correlation */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-800">
                <Target className="w-5 h-5" />
                <span>Habit & Goal Correlation Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Correlation Matrix */}
                <div className="h-80">
                  <ChartContainer
                    config={{
                      habitCompletion: { color: "#10b981", label: "Habit Completion" },
                      goalProgress: { color: "#3b82f6", label: "Goal Progress" }
                    }}
                    className="h-full"
                  >
                    <BarChart data={habits.map(h => ({
                      category: h.category,
                      habitCompletion: h.completedToday ? 100 : 0
                    }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#888888" fontSize={12} />
                      <YAxis dataKey="category" type="category" stroke="#888888" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="habitCompletion" fill="#10b981" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="goalProgress" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Correlation Insights */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3">Correlation Insights</h4>
                    <div className="space-y-3">
                      {habits.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: pieColors[index % pieColors.length] }}
                            />
                            <span className="font-medium text-gray-700">{item.category}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm font-semibold text-green-600">{item.completedToday ? '100%' : '0%'}</div>
                              <div className="text-xs text-gray-500">Habits</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-semibold text-blue-600">{item.habitCompletion}%</div>
                              <div className="text-xs text-gray-500">Goals</div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.correlation === 'high' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {item.correlation === 'high' ? 'Strong' : 'Weak'} Correlation
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Card */}
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Key Findings</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Completed habits in {habits.filter(item => item.completedToday).length} categories</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>Focus on improving consistency in areas with weak correlation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span>Use habit completion as a predictor for goal achievement</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Best Performance</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {habits.length > 0 ? (habits.reduce((best, day) => (day.completionRate ?? 0) > (best.completionRate ?? 0) ? day : best).category) : 'N/A'}
                </p>
                <p className="text-xs text-green-600">
                  {habits.length > 0 ? Math.round(Math.max(...habits.map(d => d.completionRate ?? 0))) : 'N/A'}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Needs Attention</span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {habits.length > 0 ? (habits.reduce((worst, day) => (day.completionRate ?? 0) < (worst.completionRate ?? 0) ? day : worst).category) : 'N/A'}
                </p>
                <p className="text-xs text-orange-600">
                  {habits.length > 0 ? Math.round(Math.min(...habits.map(d => d.completionRate ?? 0))) : 'N/A'}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Mood Impact</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {moodStats.averageMood}/4
                </p>
                <p className="text-xs text-blue-600">average mood score</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Consistency Score</span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {habits.length > 0 ? Math.round(habits.reduce((sum, day) => sum + (day.completionRate ?? 0), 0) / habits.length) : 'N/A'}%
                </p>
                <p className="text-xs text-purple-600">weekly average</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Best Mood Day</span>
                </div>
                <p className="text-lg font-bold text-red-900">
                  {moodStats.bestDay?.date}
                </p>
                <p className="text-xs text-red-600">
                  {moodStats.bestDay?.label} mood
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Achievement</span>
                </div>
                <p className="text-lg font-bold text-yellow-900">
                  {overallStats.bestStreak} days
                </p>
                <p className="text-xs text-yellow-600">best habit streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Wellness Recommendations */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-green-600" />
                <span>Wellness Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-1">Mood Improvement</h4>
                  <p className="text-sm text-green-700">
                    Your mood tends to improve on days when you complete more habits. Try to maintain consistency, especially in {habits.length > 0 ? (habits.reduce((worst, day) => (day.completionRate ?? 0) < (worst.completionRate ?? 0) ? day : worst).category) : 'N/A'} habits.
                  </p>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-1">Habit Consistency</h4>
                  <p className="text-sm text-blue-700">
                    Focus on {habits.reduce((best, cat) => cat.completionRate > best.completionRate ? cat : best).category} habits as they show the best completion rates.
                  </p>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-1">Weekly Pattern</h4>
                  <p className="text-sm text-purple-700">
                    Your best performance day is {habits.reduce((best, day) => day.completionRate > best.completionRate ? day : best).category}. Use this momentum to plan important tasks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
