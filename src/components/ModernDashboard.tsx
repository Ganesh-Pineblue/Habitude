import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  Flame, 
  Award, 
  Brain,
  Heart,
  Star,
  BarChart3,
  CheckCircle,
  TrendingUp,
  Plus,
  BarChart,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HabitCard } from './HabitCard';
// QuickStats, WeeklyProgress, and HabitStrengthMeter integrated directly
import { AICoordinatedCalendar } from './AICoordinatedCalendar';

interface ModernDashboardProps {
  habits: any[];
  goals?: any[];
  currentMood: number;
  totalStreak: number;
  personalityProfile?: any;
  onNavigateToCalendar?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToInsights?: () => void;
}

export const ModernDashboard = ({ habits, goals = [], currentMood, totalStreak, personalityProfile, onNavigateToCalendar, onNavigateToAnalytics, onNavigateToInsights }: ModernDashboardProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = Math.round((completedToday / totalHabits) * 100);

  const stats = [
    {
      label: 'Today\'s Progress',
      value: `${completedToday}/${totalHabits}`,
      percentage: completionRate,
      icon: Target,
      color: 'green'
    },
    {
      label: 'Current Streak',
      value: `${totalStreak}`,
      percentage: Math.min(totalStreak * 5, 100),
      icon: Flame,
      color: 'green'
    },
    {
      label: 'Mood Level',
      value: `${currentMood + 1}/5`,
      percentage: ((currentMood + 1) / 5) * 100,
      icon: Heart,
      color: 'green'
    },
    {
      label: 'Overall Score',
      value: `${Math.round((completionRate + ((currentMood + 1) * 20)) / 2)}%`,
      percentage: (completionRate + ((currentMood + 1) * 20)) / 2,
      icon: Award,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to Habitude 👋</h1>
              <p className="text-sm sm:text-lg text-gray-600">
                You're building amazing habits with AI. Keep going!
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">{totalStreak}</div>
              <div className="text-gray-600 text-sm">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                  <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">{stat.label}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center sm:hidden">
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">{Math.round(stat.percentage)}%</span>
                </div>
                <Progress value={stat.percentage} className="h-1.5 sm:h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <span className="text-gray-900 text-sm sm:text-base">Latest Achievement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-4 bg-green-50 rounded-full border border-green-200">
                <Star className="w-4 h-4 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-xl font-bold text-gray-900">
                  {totalStreak >= 7 ? 'Week Warrior!' : 'Getting Started!'}
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  {totalStreak >= 7 
                    ? 'You\'ve maintained a 7-day streak!' 
                    : 'Every journey begins with a single step.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl">🏆</div>
              <div className="text-xs sm:text-sm text-gray-600">Unlocked!</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onNavigateToAnalytics}>
          <CardContent className="p-4 sm:p-6 text-center">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-green-600" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">Analytics</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Track your progress</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onNavigateToInsights}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-green-600" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">AI Insights</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Get personalized tips</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => {
          console.log('Calendar clicked, current state:', showCalendar);
          setShowCalendar(!showCalendar);
          console.log('Calendar state after click:', !showCalendar);
        }}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-green-600" />
            <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-900">Calendar</h3>
            <p className="text-gray-600 text-xs sm:text-sm">View your schedule</p>
            {showCalendar && <div className="text-xs text-green-600 mt-1">✓ Active</div>}
          </CardContent>
        </Card>
      </div>

      {/* AI Coordinated Calendar - Show when calendar is clicked */}
      {showCalendar && (
        <div>
          <div className="text-sm text-gray-600 mb-2">Debug: Calendar should be visible (showCalendar: {showCalendar.toString()})</div>
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Test Calendar Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a test to see if the calendar state is working.</p>
              <p>Habits count: {habits.length}</p>
              <p>Goals count: {goals.length}</p>
              <Button onClick={() => setShowCalendar(false)}>Close Calendar</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
