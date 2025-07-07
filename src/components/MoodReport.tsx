import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target, 
  Flame,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Clock,
  Award,
  Brain,
  Heart,
  Smile
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
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

interface MoodReportProps {
  habits?: Habit[];
  defaultTab?: 'mood' | 'habits' | 'correlation' | 'insights';
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

// Generate mock historical data for habits
const generateHistoricalData = (habits: Habit[] = []) => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      totalHabits: habits.length || 4,
      completedHabits: Math.floor(Math.random() * ((habits.length || 4) + 1)),
      completionRate: 0,
      mood: Math.floor(Math.random() * 5),
      streaks: (habits.length || 4) * Math.floor(Math.random() * 10)
    };
    
    dayData.completionRate = (dayData.completedHabits / dayData.totalHabits) * 100;
    data.push(dayData);
  }
  
  return data;
};

// Generate weekly consistency data
const generateWeeklyData = (habits: Habit[] = []) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return weekDays.map(day => ({
    day,
    completionRate: Math.floor(Math.random() * 40) + 60,
    totalHabits: habits.length || 4,
    completedHabits: Math.floor(Math.random() * (habits.length || 4)) + 1,
    averageStreak: Math.floor(Math.random() * 10) + 5
  }));
};

// Generate category performance data
const generateCategoryData = (habits: Habit[] = []) => {
  const categories = ['health', 'productivity', 'mindfulness', 'social'];
  return categories.map(category => {
    const categoryHabits = habits.filter(h => h.category === category);
    const totalHabits = categoryHabits.length || Math.floor(Math.random() * 3) + 1;
    const completedHabits = categoryHabits.filter(h => h.completedToday).length || Math.floor(Math.random() * totalHabits);
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : Math.floor(Math.random() * 100),
      totalHabits,
      completedHabits,
      averageStreak: Math.floor(Math.random() * 10) + 5,
      color: {
        health: '#10b981',
        productivity: '#3b82f6',
        mindfulness: '#8b5cf6',
        social: '#f59e0b'
      }[category as keyof typeof category]
    };
  });
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

export const MoodReport: React.FC<MoodReportProps> = ({ habits = [], defaultTab = 'mood' }) => {
  const [moodData] = useState<MoodData[]>(generateMockMoodData());
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const historicalData = useMemo(() => generateHistoricalData(habits), [habits]);
  const weeklyData = useMemo(() => generateWeeklyData(habits), [habits]);
  const categoryData = useMemo(() => generateCategoryData(habits), [habits]);

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
                  <AnimatedNumber value={Math.round(habits.reduce((sum, h) => sum + (h.completionRate || 0), 0) / Math.max(habits.length, 1))} suffix="%" duration={1200} />
                </p>
                <p className="text-xs text-orange-600">overall rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
          <TabsTrigger value="mood" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Heart className="w-4 h-4" />
            <span>Mood</span>
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Target className="w-4 h-4" />
            <span>Habits</span>
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
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Habit Completion Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ChartContainer
                  config={{
                    completion: { color: "#10b981", label: "Completion Rate" },
                    mood: { color: "#8b5cf6", label: "Mood" }
                  }}
                  className="h-full"
                >
                  <LineChart data={historicalData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dayName" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "white" }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Consistency */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Weekly Consistency Pattern</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    completionRate: { color: "#10b981", label: "Completion Rate" },
                    averageStreak: { color: "#f59e0b", label: "Average Streak" }
                  }}
                  className="h-full"
                >
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="completionRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="averageStreak" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlation Tab */}
        <TabsContent value="correlation" className="space-y-6">
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
                    <BarChart data={categoryData} layout="horizontal">
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
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="completedHabits"
                        label={({ category, completionRate }) => `${category}: ${Math.round(completionRate)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
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
                  {weeklyData.reduce((best, day) => day.completionRate > best.completionRate ? day : best).day}
                </p>
                <p className="text-xs text-green-600">
                  {Math.round(Math.max(...weeklyData.map(d => d.completionRate)))}% completion rate
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
                  {weeklyData.reduce((worst, day) => day.completionRate < worst.completionRate ? day : worst).day}
                </p>
                <p className="text-xs text-orange-600">
                  {Math.round(Math.min(...weeklyData.map(d => d.completionRate)))}% completion rate
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
                  {Math.round(weeklyData.reduce((sum, day) => sum + day.completionRate, 0) / weeklyData.length)}%
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
                    Your mood tends to improve on days when you complete more habits. Try to maintain consistency, especially on {weeklyData.reduce((worst, day) => day.completionRate < worst.completionRate ? day : worst).day}s.
                  </p>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-1">Habit Consistency</h4>
                  <p className="text-sm text-blue-700">
                    Focus on {categoryData.reduce((best, cat) => cat.completionRate > best.completionRate ? cat : best).category} habits as they show the best completion rates.
                  </p>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-1">Weekly Pattern</h4>
                  <p className="text-sm text-purple-700">
                    Your best performance day is {weeklyData.reduce((best, day) => day.completionRate > best.completionRate ? day : best).day}. Use this momentum to plan important tasks.
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
