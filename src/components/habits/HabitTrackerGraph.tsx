import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Brain
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';

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

interface HabitTrackerGraphProps {
  habits: Habit[];
}

// Generate mock historical data for the last 30 days
const generateHistoricalData = (habits: Habit[]) => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      totalHabits: habits.length,
      completedHabits: Math.floor(Math.random() * (habits.length + 1)),
      completionRate: 0,
      mood: Math.floor(Math.random() * 5),
      streaks: habits.reduce((sum, habit) => sum + (habit.streak || 0), 0)
    };
    
    dayData.completionRate = (dayData.completedHabits / dayData.totalHabits) * 100;
    data.push(dayData);
  }
  
  return data;
};

// Generate weekly consistency data
const generateWeeklyData = (habits: Habit[]) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return weekDays.map(day => ({
    day,
    completionRate: Math.floor(Math.random() * 40) + 60,
    totalHabits: habits.length,
    completedHabits: Math.floor(Math.random() * habits.length) + 1,
    averageStreak: Math.floor(Math.random() * 10) + 5
  }));
};

// Generate category performance data
const generateCategoryData = (habits: Habit[]) => {
  const categories = ['health', 'productivity', 'mindfulness', 'social'];
  return categories.map(category => {
    const categoryHabits = habits.filter(h => h.category === category);
    const totalHabits = categoryHabits.length;
    const completedHabits = categoryHabits.filter(h => h.completedToday).length;
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
      totalHabits,
      completedHabits,
      averageStreak: categoryHabits.reduce((sum, h) => sum + (h.streak || 0), 0) / totalHabits || 0,
      color: (() => {
        const colors = {
          health: '#10b981',
          productivity: '#3b82f6',
          mindfulness: '#8b5cf6',
          social: '#f59e0b'
        };
        return colors[category as keyof typeof colors] || '#6b7280';
      })()
    };
  });
};

export const HabitTrackerGraph: React.FC<HabitTrackerGraphProps> = ({ habits }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const historicalData = useMemo(() => generateHistoricalData(habits), [habits]);
  const weeklyData = useMemo(() => generateWeeklyData(habits), [habits]);
  const categoryData = useMemo(() => generateCategoryData(habits), [habits]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedToday).length;
    const averageStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0) / totalHabits;
    const bestStreak = Math.max(...habits.map(h => h.bestStreak || h.streak));
    const completionRate = (completedToday / totalHabits) * 100;
    
    return {
      totalHabits,
      completedToday,
      averageStreak: Math.round(averageStreak * 10) / 10,
      bestStreak,
      completionRate: Math.round(completionRate)
    };
  }, [habits]);

  // Debug logging
  console.log('HabitTrackerGraph rendered with:', {
    habitsCount: habits.length,
    historicalDataLength: historicalData.length,
    weeklyDataLength: weeklyData.length,
    categoryDataLength: categoryData.length,
    overallStats
  });

  return (
    <div className="space-y-6">
      {/* Test Section - Remove this after confirming charts work */}
      <Card className="border-2 border-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Debug Info</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Habits count: {habits.length}</p>
            <p>Historical data points: {historicalData.length}</p>
            <p>Weekly data points: {weeklyData.length}</p>
            <p>Category data points: {categoryData.length}</p>
            <p>Overall stats: {JSON.stringify(overallStats)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Today's Progress</p>
                <p className="text-2xl font-bold text-green-800">
                  {overallStats.completedToday}/{overallStats.totalHabits}
                </p>
                <p className="text-xs text-green-600">{overallStats.completionRate}% completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700">Average Streak</p>
                <p className="text-2xl font-bold text-orange-800">{overallStats.averageStreak}</p>
                <p className="text-xs text-orange-600">days per habit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Best Streak</p>
                <p className="text-2xl font-bold text-purple-800">{overallStats.bestStreak}</p>
                <p className="text-xs text-purple-600">days achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Consistency</p>
                <p className="text-2xl font-bold text-blue-800">
                  {Math.round(habits.reduce((sum, h) => sum + (h.completionRate || 0), 0) / habits.length)}%
                </p>
                <p className="text-xs text-blue-600">overall rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
          <TabsTrigger value="trends" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <TrendingUp className="w-4 h-4" />
            <span>Trends</span>
          </TabsTrigger>
          <TabsTrigger value="consistency" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <BarChart3 className="w-4 h-4" />
            <span>Consistency</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Brain className="w-4 h-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Calendar className="w-4 h-4" />
            <span>Heatmap</span>
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Habit Completion Trends</h3>
            <Select value={selectedTimeframe} onValueChange={(value: '7d' | '30d' | '90d') => setSelectedTimeframe(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="h-[400px]">
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
        </TabsContent>

        {/* Consistency Tab */}
        <TabsContent value="consistency" className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Consistency Pattern</h3>
          
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="h-[400px]">
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
                    <Bar dataKey="completionRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="averageStreak" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Best Day</span>
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
                  <span className="text-sm font-medium text-blue-800">Consistency Score</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {Math.round(weeklyData.reduce((sum, day) => sum + day.completionRate, 0) / weeklyData.length)}%
                </p>
                <p className="text-xs text-blue-600">weekly average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="h-[300px]">
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
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="h-[300px]">
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
              </CardContent>
            </Card>
          </div>

          {/* Category Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryData.map((category) => (
              <Card key={category.category} className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900">{category.category}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-medium">{Math.round(category.completionRate)}%</span>
                    </div>
                    <Progress value={category.completionRate} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Habits</span>
                      <span className="font-medium">{category.completedHabits}/{category.totalHabits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Streak</span>
                      <span className="font-medium">{Math.round(category.averageStreak)}d</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Habit Completion Heatmap</h3>
            <div className="text-sm text-gray-600">Last 12 weeks</div>
          </div>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 84 }, (_, i) => {
                  const dayIndex = i % 7;
                  const weekIndex = Math.floor(i / 7);
                  const intensity = Math.random(); // Mock intensity data
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square rounded-sm border border-gray-100
                        ${intensity > 0.8 ? 'bg-green-600' : 
                          intensity > 0.6 ? 'bg-green-500' :
                          intensity > 0.4 ? 'bg-green-400' :
                          intensity > 0.2 ? 'bg-green-300' :
                          'bg-green-100'
                        }
                        hover:scale-110 transition-transform cursor-pointer
                      `}
                      title={`Week ${weekIndex + 1}, ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex]} - ${Math.round(intensity * 100)}% completion`}
                    />
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-600">
                <span>Less</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>

          {/* Heatmap Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Most Consistent</span>
                </div>
                <p className="text-lg font-bold text-green-900">Wednesday</p>
                <p className="text-xs text-green-600">85% average completion</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Needs Focus</span>
                </div>
                <p className="text-lg font-bold text-orange-900">Weekend</p>
                <p className="text-xs text-orange-600">45% average completion</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Improvement</span>
                </div>
                <p className="text-lg font-bold text-blue-900">+12%</p>
                <p className="text-xs text-blue-600">vs last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
