import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Target, 
  Users,
  Eye,
  EyeOff,
  Star,
  Calendar,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: number;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  userRole: string;
  timeFrame: string;
  milestones: string[];
  isVisible: boolean;
  usageCount: number;
  successRate: number;
  targetDate?: string;
}

export const GoalManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: 'Complete 30-Day Fitness Challenge',
      category: 'Health & Fitness',
      difficulty: 'Medium',
      description: 'Build a consistent fitness routine over 30 days with progressive challenges',
      userRole: 'Athletes',
      timeFrame: '30 days',
      milestones: ['Week 1: Establish routine', 'Week 2: Increase intensity', 'Week 3: Add variety', 'Week 4: Master consistency'],
      isVisible: true,
      usageCount: 1247,
      successRate: 72.3
    },
    {
      id: 2,
      name: 'Learn New Language Basics',
      category: 'Education',
      difficulty: 'Easy',
      description: 'Master basic conversational skills in a new language within 3 months',
      userRole: 'Students',
      timeFrame: '3 months',
      milestones: ['Month 1: Basic vocabulary', 'Month 2: Simple conversations', 'Month 3: Cultural understanding'],
      isVisible: true,
      usageCount: 892,
      successRate: 68.7
    },
    {
      id: 3,
      name: 'Career Skill Development',
      category: 'Professional',
      difficulty: 'Hard',
      description: 'Develop advanced professional skills to advance career within 6 months',
      userRole: 'Professionals',
      timeFrame: '6 months',
      milestones: ['Month 1-2: Skill assessment', 'Month 3-4: Intensive learning', 'Month 5-6: Application and practice'],
      isVisible: false,
      usageCount: 567,
      successRate: 85.2
    }
  ]);

  const categories = ['All', 'Health & Fitness', 'Education', 'Professional', 'Personal Development', 'Financial'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const userRoles = ['All Users', 'Students', 'Athletes', 'Professionals'];
  const timeFrames = ['1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year'];

  const getFilteredGoals = () => {
    let filtered = goals;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(goal => 
        goal.name.toLowerCase().includes(searchLower) ||
        goal.description.toLowerCase().includes(searchLower) ||
        goal.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(goal => goal.category === selectedCategory);
    }

    return filtered;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Easy': 'bg-[#DAF7A6] text-gray-700',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAddNew = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    toast({
      title: "Goal Deleted",
      description: "The goal has been successfully deleted.",
    });
  };

  const handleToggleVisibility = (id: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, isVisible: !goal.isVisible } : goal
      )
    );
    toast({
      title: "Visibility Updated",
      description: "Goal visibility has been updated.",
    });
  };

  const GoalForm = ({ goal, onSave, onClose }: any) => {
    const [formData, setFormData] = useState<Goal>(goal || {
      id: 0,
      name: '',
      category: '',
      difficulty: 'Easy',
      description: '',
      userRole: 'All Users',
      timeFrame: '1 month',
      milestones: [''],
      isVisible: true,
      usageCount: 0,
      successRate: 0
    });

    const addMilestone = () => {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, '']
      }));
    };

    const updateMilestone = (index: number, value: string) => {
      const updated = [...formData.milestones];
      updated[index] = value;
      setFormData(prev => ({ ...prev, milestones: updated }));
    };

    const removeMilestone = (index: number) => {
      setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.description.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Goal Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter goal name"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.slice(1).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(diff => (
                  <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="userRole">Target User Role</Label>
            <Select value={formData.userRole} onValueChange={(value) => setFormData(prev => ({ ...prev, userRole: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timeFrame">Time Frame</Label>
            <Select value={formData.timeFrame} onValueChange={(value) => setFormData(prev => ({ ...prev, timeFrame: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeFrames.map(timeFrame => (
                  <SelectItem key={timeFrame} value={timeFrame}>{timeFrame}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the goal..."
            rows={3}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Milestones</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
              <Plus className="w-4 h-4 mr-1" />
              Add Milestone
            </Button>
          </div>
          <div className="space-y-2">
            {formData.milestones.map((milestone: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={milestone}
                  onChange={(e) => updateMilestone(index, e.target.value)}
                  placeholder={`Milestone ${index + 1}`}
                  required
                />
                {formData.milestones.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="visibility">Visible to Users</Label>
          <Switch
            id="visibility"
            checked={formData.isVisible}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]">
            {editingGoal ? 'Update Goal' : 'Save Goal'}
          </Button>
        </div>
      </form>
    );
  };

  const handleSave = (formData: Goal) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(prev => 
        prev.map(goal => 
          goal.id === editingGoal.id ? { ...goal, ...formData } : goal
        )
      );
      toast({
        title: "Goal Updated",
        description: "The goal has been successfully updated.",
      });
    } else {
      // Add new goal
      const newGoal: Goal = {
        ...formData,
        id: Math.max(...goals.map(g => g.id), 0) + 1,
        usageCount: 0,
        successRate: 0
      };
      setGoals(prev => [...prev, newGoal]);
      toast({
        title: "Goal Created",
        description: "New goal has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  const filteredGoals = getFilteredGoals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Goal Management</h1>
          <p className="text-gray-600">Create and manage goals for different user groups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </DialogTitle>
            </DialogHeader>
            <GoalForm 
              goal={editingGoal}
              onSave={handleSave} 
              onClose={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{goals.filter(g => g.isVisible).length}</p>
              </div>
              <Eye className="w-8 h-8 text-gray-700" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {goals.length > 0 
                    ? Math.round(goals.reduce((sum, g) => sum + g.successRate, 0) / goals.length * 10) / 10
                    : 0}%
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">
                  {goals.reduce((sum, g) => sum + g.usageCount, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search goals by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{goal.category}</Badge>
                        <Badge className={getDifficultyColor(goal.difficulty)}>
                          {goal.difficulty}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(goal.id)}
                          className="p-1"
                        >
                          {goal.isVisible ? (
                            <Eye className="w-4 h-4 text-gray-700" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-500">Target: {goal.userRole}</div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{goal.timeFrame}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Used by {goal.usageCount.toLocaleString()} users</span>
                      <span className="text-gray-700">{goal.successRate}% success</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Milestones:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {goal.milestones.slice(0, 2).map((milestone, index) => (
                        <li key={index}>• {milestone}</li>
                      ))}
                      {goal.milestones.length > 2 && (
                        <li>• +{goal.milestones.length - 2} more milestones</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 