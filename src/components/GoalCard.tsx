import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Calendar, TrendingUp, Edit3 } from 'lucide-react';

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

interface GoalCardProps {
  goal: Goal;
  onEdit: (goalId: string) => void;
}

const categoryColors = {
  health: 'bg-green-100 text-green-800 border-green-200',
  productivity: 'bg-green-100 text-green-800 border-green-200',
  mindfulness: 'bg-green-100 text-green-800 border-green-200',
  social: 'bg-green-100 text-green-800 border-green-200',
  fitness: 'bg-green-100 text-green-800 border-green-200'
};

const priorityColors = {
  high: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-green-100 text-green-800 border-green-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

export const GoalCard = ({ goal, onEdit }: GoalCardProps) => {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400 bg-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg text-gray-900">{goal.title}</CardTitle>
            </div>
            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
            
            <div className="flex items-center space-x-2 mb-3">
              <Badge className={categoryColors[goal.category]} variant="secondary">
                {goal.category}
              </Badge>
              <Badge className={priorityColors[goal.priority]} variant="secondary">
                {goal.priority} priority
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">
                {goal.current} / {goal.target} {goal.unit}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">{progress.toFixed(1)}% complete</span>
              {progress >= 100 && (
                <Badge className="bg-green-50 text-green-600 text-xs">
                  🎉 Completed!
                </Badge>
              )}
            </div>
          </div>
          
          {/* Timeline */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">
                {((goal.current / goal.target) / (1 - daysLeft / 365) * 100).toFixed(0)}% on track
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
