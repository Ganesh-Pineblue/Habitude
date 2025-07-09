import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Star, Zap, Gift, Lock, Unlock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requirement: number;
  current: number;
  unlocked: boolean;
  reward?: string;
  category: 'streak' | 'consistency' | 'milestone' | 'special';
}

interface GamificationSystemProps {
  totalStreak: number;
  completedHabits: number;
  totalHabits: number;
}

export const GamificationSystem = ({ totalStreak, completedHabits, totalHabits }: GamificationSystemProps) => {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first habit',
      icon: Star,
      requirement: 1,
      current: completedHabits,
      unlocked: completedHabits >= 1,
      reward: 'Unlock AI Mood Insights',
      category: 'milestone'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Trophy,
      requirement: 7,
      current: totalStreak,
      unlocked: totalStreak >= 7,
      reward: 'Unlock Advanced Analytics',
      category: 'streak'
    },
    {
      id: '3',
      title: 'Habit Master',
      description: 'Reach a 30-day streak',
      icon: Crown,
      requirement: 30,
      current: totalStreak,
      unlocked: totalStreak >= 30,
      reward: 'Unlock Premium Themes',
      category: 'streak'
    },
    {
      id: '4',
      title: 'Consistency King',
      description: 'Complete all habits for today',
      icon: Zap,
      requirement: totalHabits,
      current: completedHabits,
      unlocked: completedHabits === totalHabits && totalHabits > 0,
      reward: 'Double XP for tomorrow',
      category: 'consistency'
    },
    {
      id: '5',
      title: 'Legendary',
      description: 'Achieve a 100-day streak',
      icon: Gift,
      requirement: 100,
      current: totalStreak,
      unlocked: totalStreak >= 100,
      reward: 'Unlock All Premium Features',
      category: 'streak'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Progress to Next Achievement */}
      {nextAchievement && (
        <Card className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 text-white border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <nextAchievement.icon className="w-6 h-6" />
              <span>Next Achievement: {nextAchievement.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100 mb-4">{nextAchievement.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{nextAchievement.current} / {nextAchievement.requirement}</span>
              </div>
              <Progress 
                value={(nextAchievement.current / nextAchievement.requirement) * 100} 
                className="h-3 bg-white/20"
              />
            </div>
            {nextAchievement.reward && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium">🎁 Reward: {nextAchievement.reward}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Achievement Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-emerald-100' 
                : 'bg-gray-50 border-gray-200 opacity-75'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <achievement.icon className="w-6 h-6" />
                </div>
                {achievement.unlocked ? (
                  <Unlock className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <h3 className={`font-bold text-lg mb-2 ${
                achievement.unlocked ? 'text-emerald-900' : 'text-gray-600'
              }`}>
                {achievement.title}
              </h3>
              
              <p className={`text-sm mb-3 ${
                achievement.unlocked ? 'text-emerald-700' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>

              <Badge 
                className={`${
                  achievement.unlocked 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {achievement.category}
              </Badge>

              {achievement.reward && achievement.unlocked && (
                <div className="mt-3 p-2 bg-emerald-100 rounded-lg">
                  <p className="text-xs text-emerald-800 font-medium">
                    🎁 {achievement.reward}
                  </p>
                </div>
              )}

              {!achievement.unlocked && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.current} / {achievement.requirement}</span>
                  </div>
                  <Progress 
                    value={(achievement.current / achievement.requirement) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Stats */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-amber-600">{unlockedAchievements.length}</p>
              <p className="text-sm text-amber-700">Achievements Unlocked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">{totalStreak}</p>
              <p className="text-sm text-orange-700">Best Streak</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {Math.round((completedHabits / totalHabits) * 100)}%
              </p>
              <p className="text-sm text-green-700">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
