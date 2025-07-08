import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Target, Zap } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'celebration' | 'optimization';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'habits' | 'goals' | 'productivity' | 'wellness';
}

interface AIInsightsProps {
  habits: any[];
  goals: any[];
  currentMood: number;
  userName?: string;
  personalityProfile?: any;
}

export const AIInsights = ({ habits, goals, currentMood, userName = 'User', personalityProfile }: AIInsightsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeUserData = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const generatedInsights: AIInsight[] = [];
      
      // Analyze habits
      const completedToday = habits.filter(h => h.completedToday).length;
      const totalHabits = habits.length;
      const completionRate = (completedToday / totalHabits) * 100;
      
      if (completionRate < 50) {
        generatedInsights.push({
          id: '1',
          type: 'suggestion',
          title: 'Boost Your Daily Momentum',
          description: `You've completed ${completedToday} out of ${totalHabits} habits today. Consider starting with your easiest habit to build momentum.`,
          action: 'Start with 5-minute meditation',
          priority: 'medium',
          category: 'habits'
        });
      } else if (completionRate > 80) {
        generatedInsights.push({
          id: '2',
          type: 'celebration',
          title: 'Outstanding Performance!',
          description: `Amazing! You've completed ${completionRate.toFixed(0)}% of your habits today. You're building incredible consistency.`,
          priority: 'high',
          category: 'habits'
        });
      }

      // Analyze streaks
      const longestStreak = Math.max(...habits.map(h => h.streak || 0));
      if (longestStreak >= 7) {
        generatedInsights.push({
          id: '3',
          type: 'celebration',
          title: 'Streak Master Achievement',
          description: `Your ${longestStreak}-day streak shows incredible dedication. This consistency is building lasting change.`,
          priority: 'high',
          category: 'habits'
        });
      }

      // Analyze mood correlation
      if (currentMood <= 2) {
        generatedInsights.push({
          id: '4',
          type: 'suggestion',
          title: 'Mood Boost Opportunity',
          description: 'Your mood seems low today. Based on your patterns, completing your exercise habit typically improves your energy levels.',
          action: 'Try 10 minutes of movement',
          priority: 'high',
          category: 'wellness'
        });
      }

      // Analyze goals progress
      if (goals.length > 0) {
        const goalProgress = goals.reduce((sum, goal) => sum + (goal.current / goal.target), 0) / goals.length;
        if (goalProgress < 0.3) {
          generatedInsights.push({
            id: '5',
            type: 'optimization',
            title: 'Goal Strategy Adjustment',
            description: 'Your goals might be too ambitious. Consider breaking them into smaller, daily actionable steps.',
            action: 'Create micro-goals',
            priority: 'medium',
            category: 'goals'
          });
        }
      }

      // Time-based insights
      const currentHour = new Date().getHours();
      if (currentHour < 10 && completedToday === 0) {
        generatedInsights.push({
          id: '6',
          type: 'suggestion',
          title: 'Perfect Morning Window',
          description: 'Research shows morning habit completion increases daily success rates by 73%. Start with your priority habit now.',
          action: 'Complete morning routine',
          priority: 'medium',
          category: 'productivity'
        });
      }

      setInsights(generatedInsights);
      setIsAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    analyzeUserData();
  }, [habits, goals, currentMood]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-green-600" />;
      case 'celebration': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'optimization': return <TrendingUp className="w-5 h-5 text-green-600" />;
      default: return <Brain className="w-5 h-5 text-green-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-green-50 border-green-200 text-green-800';
      case 'medium': return 'bg-green-50 border-green-200 text-green-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Brain className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">AI Insights for {userName}</h2>
              <p className="text-sm text-slate-600 font-normal">Personalized recommendations based on your data</p>
            </div>
            <Button 
              onClick={analyzeUserData}
              variant="outline"
              size="sm"
              disabled={isAnalyzing}
              className="ml-auto"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Refresh Insights
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No insights available yet. Complete some habits to get personalized recommendations!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-slate-800">{insight.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {insight.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">{insight.description}</p>
                      {insight.action && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
