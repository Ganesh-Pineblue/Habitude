import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Flame, 
  Award, 
  Heart,
  Star,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from '@/components/ui/animated-number';

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
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                <AnimatedNumber value={totalStreak} duration={1500} delay={200} />
              </div>
              <div className="text-gray-600 text-sm">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={
              `rounded-3xl shadow-lg border-0 bg-gradient-to-br ` +
              (index === 0 ? 'from-blue-100 to-blue-50' :
               index === 1 ? 'from-orange-100 to-orange-50' :
               index === 2 ? 'from-purple-100 to-purple-50' :
               'from-green-100 to-green-50') +
              ' hover:scale-[1.02] hover:shadow-xl transition-all duration-200 min-h-[120px] flex flex-col justify-between'
            }
          >
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className={
                  `rounded-2xl p-2 shadow-md ` +
                  (index === 0 ? 'bg-blue-500/20' :
                   index === 1 ? 'bg-orange-500/20' :
                   index === 2 ? 'bg-purple-500/20' :
                   'bg-green-500/20')
                }>
                  <stat.icon className={
                    `w-6 h-6 ` +
                    (index === 0 ? 'text-blue-600' :
                     index === 1 ? 'text-orange-600' :
                     index === 2 ? 'text-purple-600' :
                     'text-green-600')
                  } />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-0.5">{stat.label}</div>
                  <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                    <AnimatedNumber 
                      value={stat.value} 
                      duration={1200} 
                      delay={index * 100} 
                      className="text-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-bold text-gray-700">
                  <AnimatedNumber 
                    value={Math.round(stat.percentage)} 
                    suffix="%" 
                    duration={800} 
                    delay={index * 100 + 300}
                    className="text-gray-700"
                  />
                </span>
              </div>
              <Progress value={stat.percentage} className="h-2 mt-2 rounded-full bg-white/60" />
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


