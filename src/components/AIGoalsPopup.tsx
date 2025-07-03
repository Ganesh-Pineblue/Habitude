import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Edit3, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

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

interface AIGoalsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onEditGoal: (goalId: string) => void;
  onAddGoal: () => void;
  onDeleteGoal: (goalId: string) => void;
  onContinue: () => void;
}

const categoryColors = {
  health: 'bg-green-100 text-green-800 border-green-200',
  productivity: 'bg-blue-100 text-blue-800 border-blue-200',
  mindfulness: 'bg-purple-100 text-purple-800 border-purple-200',
  social: 'bg-pink-100 text-pink-800 border-pink-200',
  fitness: 'bg-orange-100 text-orange-800 border-orange-200'
};

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200'
};

export const AIGoalsPopup: React.FC<AIGoalsPopupProps> = ({
  isOpen,
  onClose,
  goals,
  onEditGoal,
  onAddGoal,
  onDeleteGoal,
  onContinue
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span>AI Generated Goals</span>
              <p className="text-sm font-normal text-gray-600 mt-1">
                Based on the habits you selected in the role model page
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Goals Created Successfully!</h3>
                <p className="text-sm text-green-700">
                  We've generated {goals.length} complementary goals based on your selected habits. 
                  These goals will help you build on your habit foundation and achieve bigger milestones.
                </p>
              </div>
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-400 bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
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
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
                        title="Edit Goal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-600">Target</span>
                        <span className="text-sm text-gray-600">
                          {goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* AI Source Info */}
                    {goal.personalityInspiration && (
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-700">
                            {goal.personalityInspiration}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={onAddGoal}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More Goals
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
            >
              Continue to App
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>

          {/* Tips */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">💡 Tips for Success</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Review and adjust goal targets to match your current capacity</li>
                  <li>• Set realistic deadlines that give you enough time to succeed</li>
                  <li>• Focus on 2-3 high-priority goals at a time</li>
                  <li>• Track your progress regularly in the Goals tab</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 