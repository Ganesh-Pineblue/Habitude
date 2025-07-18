import { useState, useEffect } from 'react';
import { GoalCard } from './GoalCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Target, Trophy, Calendar, TrendingUp, Bot } from 'lucide-react';

import { AnimatedNumber } from '@/components/ui/animated-number';

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

interface GoalDashboardProps {
  initialGoals?: Goal[];
  onGoalsUpdate?: (goals: Goal[]) => void;
  triggerAddForm?: boolean;
  triggerEditGoalId?: string | null;
  onAddFormTriggered?: () => void;
  onEditFormTriggered?: () => void;
}

export const GoalDashboard = ({ 
  initialGoals = [], 
  onGoalsUpdate,
  triggerAddForm = false,
  triggerEditGoalId = null,
  onAddFormTriggered,
  onEditFormTriggered
}: GoalDashboardProps) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals.length > 0 ? initialGoals : [
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
    }
  ]);

  // Update goals when initialGoals prop changes
  useEffect(() => {
    if (initialGoals.length > 0) {
      setGoals(initialGoals);
    }
  }, [initialGoals]);

  // Notify parent component when goals change
  useEffect(() => {
    if (onGoalsUpdate) {
      onGoalsUpdate(goals);
    }
  }, [goals, onGoalsUpdate]);

  // Handle external triggers for add/edit forms
  useEffect(() => {
    if (triggerAddForm) {
      setShowAddForm(true);
      if (onAddFormTriggered) {
        onAddFormTriggered();
      }
    }
  }, [triggerAddForm, onAddFormTriggered]);

  useEffect(() => {
    if (triggerEditGoalId) {
      const goal = goals.find(g => g.id === triggerEditGoalId);
      if (goal) {
        setEditingGoal(goal);
        if (onEditFormTriggered) {
          onEditFormTriggered();
        }
      }
    }
  }, [triggerEditGoalId, goals, onEditFormTriggered]);

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    category: 'health' as 'health' | 'productivity' | 'mindfulness' | 'social' | 'fitness',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const addGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal
    };
    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      target: 0,
      current: 0,
      unit: '',
      deadline: '',
      category: 'health',
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    setEditingGoal(null);
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleEditGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) setEditingGoal(goal);
  };

  const completedGoals = goals.filter(g => g.current >= g.target).length;
  const totalProgress = goals.reduce((sum, goal) => sum + Math.min(goal.current / goal.target, 1), 0) / goals.length * 100;
  const urgentGoals = goals.filter(g => {
    const daysLeft = Math.ceil((new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && g.current < g.target;
  }).length;

  const aiGeneratedGoals = goals.filter(g => g.aiGenerated);
  const userCreatedGoals = goals.filter(g => !g.aiGenerated);

  return (
    <div className="space-y-6">
      {/* Goal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Goals */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-blue-100 to-blue-50 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 min-h-[120px] flex flex-col justify-between">
          <CardContent className="p-6 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-2xl p-2 shadow-md bg-blue-500/20">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-0.5">Total Goals</div>
                <div className="text-2xl font-extrabold text-gray-900 flex items-end">
                  <AnimatedNumber value={goals.length} duration={1200} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Avg Progress */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-orange-100 to-orange-50 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 min-h-[120px] flex flex-col justify-between">
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
        {/* Urgent Goals */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-purple-100 to-purple-50 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 min-h-[120px] flex flex-col justify-between">
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
        {/* Completed Goals */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-green-100 to-green-50 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 min-h-[120px] flex flex-col justify-between">
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

      {/* Add Custom Goal Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Your Goals</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Goal
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingGoal) && (
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Goal title"
              value={editingGoal ? editingGoal.title : newGoal.title}
              onChange={(e) => editingGoal 
                ? setEditingGoal({...editingGoal, title: e.target.value})
                : setNewGoal({...newGoal, title: e.target.value})
              }
              className="border-gray-200"
            />
            <Input
              placeholder="Description"
              value={editingGoal ? editingGoal.description : newGoal.description}
              onChange={(e) => editingGoal 
                ? setEditingGoal({...editingGoal, description: e.target.value})
                : setNewGoal({...newGoal, description: e.target.value})
              }
              className="border-gray-200"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Target"
                value={editingGoal ? editingGoal.target : newGoal.target}
                onChange={(e) => editingGoal 
                  ? setEditingGoal({...editingGoal, target: Number(e.target.value)})
                  : setNewGoal({...newGoal, target: Number(e.target.value)})
                }
                className="border-gray-200"
              />
              <Input
                type="number"
                placeholder="Current progress"
                value={editingGoal ? editingGoal.current : newGoal.current}
                onChange={(e) => editingGoal 
                  ? setEditingGoal({...editingGoal, current: Number(e.target.value)})
                  : setNewGoal({...newGoal, current: Number(e.target.value)})
                }
                className="border-gray-200"
              />
              <Input
                placeholder="Unit (e.g., lbs, books)"
                value={editingGoal ? editingGoal.unit : newGoal.unit}
                onChange={(e) => editingGoal 
                  ? setEditingGoal({...editingGoal, unit: e.target.value})
                  : setNewGoal({...newGoal, unit: e.target.value})
                }
                className="border-gray-200"
              />
              <Input
                type="date"
                value={editingGoal ? editingGoal.deadline : newGoal.deadline}
                onChange={(e) => editingGoal 
                  ? setEditingGoal({...editingGoal, deadline: e.target.value})
                  : setNewGoal({...newGoal, deadline: e.target.value})
                }
                className="border-gray-200"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={editingGoal ? () => updateGoal(editingGoal) : addGoal}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editingGoal ? 'Update' : 'Add'} Goal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGoal(null);
                }}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              {editingGoal && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    deleteGoal(editingGoal.id);
                    setEditingGoal(null);
                  }}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Generated Goals Section */}
      {aiGeneratedGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI-Generated Goals</h2>
              <p className="text-sm text-gray-600">Goals created based on your selected habits</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {aiGeneratedGoals.map((goal) => (
              <div key={goal.id} className="relative">
                <GoalCard 
                  goal={goal} 
                  onEdit={handleEditGoal}
                />
                {goal.sourceHabit && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">
                      From: {goal.sourceHabit}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Created Goals */}
      {userCreatedGoals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userCreatedGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={handleEditGoal}
            />
          ))}
        </div>
      )}

      {/* Show message if no goals */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first goal to track your progress</p>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Custom Goal
          </Button>
        </div>
      )}
    </div>
  );
};
