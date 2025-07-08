import { useState } from 'react';
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
  Edit, 
  Trash2, 
  Target, 
  Users,
  Eye,
  EyeOff,
  Star
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

interface Habit {
  id: number;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  userRole: string;
  microHabits: string[];
  isVisible: boolean;
  usageCount: number;
  successRate: number;
}

export const HabitManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: 'Morning Meditation',
      category: 'Mindfulness',
      difficulty: 'Easy',
      description: 'Start your day with 10 minutes of mindful meditation',
      userRole: 'All Users',
      microHabits: ['Find quiet space', 'Set timer for 10 minutes', 'Focus on breathing'],
      isVisible: true,
      usageCount: 2847,
      successRate: 78.5
    },
    {
      id: 2,
      name: 'Daily Exercise',
      category: 'Health & Fitness',
      difficulty: 'Medium',
      description: '30 minutes of physical activity daily',
      userRole: 'Athletes',
      microHabits: ['Choose workout type', 'Warm up for 5 minutes', 'Complete main exercise'],
      isVisible: true,
      usageCount: 1923,
      successRate: 65.2
    },
    {
      id: 3,
      name: 'Read for Learning',
      category: 'Education',
      difficulty: 'Easy',
      description: 'Read for 20 minutes daily to expand knowledge',
      userRole: 'Students',
      microHabits: ['Choose book/article', 'Find comfortable reading spot', 'Take notes'],
      isVisible: false,
      usageCount: 1456,
      successRate: 82.1
    }
  ]);

  const categories = ['All', 'Health & Fitness', 'Mindfulness', 'Education', 'Productivity'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const userRoles = ['All Users', 'Students', 'Athletes', 'Professionals'];

  const getFilteredHabits = () => {
    let filtered = habits;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(habit => 
        habit.name.toLowerCase().includes(searchLower) ||
        habit.description.toLowerCase().includes(searchLower) ||
        habit.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(habit => habit.category === selectedCategory);
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
    setEditingHabit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    toast({
      title: "Habit Deleted",
      description: "The habit has been successfully deleted.",
    });
  };

  const handleToggleVisibility = (id: number) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, isVisible: !habit.isVisible } : habit
      )
    );
    toast({
      title: "Visibility Updated",
      description: "Habit visibility has been updated.",
    });
  };

  const HabitForm = ({ habit, onSave, onClose }: any) => {
    const [formData, setFormData] = useState<Habit>(habit || {
      id: 0,
      name: '',
      category: '',
      difficulty: 'Easy',
      description: '',
      userRole: 'All Users',
      microHabits: [''],
      isVisible: true,
      usageCount: 0,
      successRate: 0
    });

    const addMicroHabit = () => {
      setFormData(prev => ({
        ...prev,
        microHabits: [...prev.microHabits, '']
      }));
    };

    const updateMicroHabit = (index: number, value: string) => {
      const updated = [...formData.microHabits];
      updated[index] = value;
      setFormData(prev => ({ ...prev, microHabits: updated }));
    };

    const removeMicroHabit = (index: number) => {
      setFormData(prev => ({
        ...prev,
        microHabits: prev.microHabits.filter((_, i) => i !== index)
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
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter habit name"
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

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the habit..."
            rows={3}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Micro-Habits</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMicroHabit}>
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </div>
          <div className="space-y-2">
            {formData.microHabits.map((microHabit: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={microHabit}
                  onChange={(e) => updateMicroHabit(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required
                />
                {formData.microHabits.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMicroHabit(index)}
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
              {editingHabit ? 'Update Habit' : 'Save Habit'}
            </Button>
        </div>
      </form>
    );
  };

  const handleSave = (formData: Habit) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prev => 
        prev.map(habit => 
          habit.id === editingHabit.id ? { ...habit, ...formData } : habit
        )
      );
      toast({
        title: "Habit Updated",
        description: "The habit has been successfully updated.",
      });
    } else {
      // Add new habit
      const newHabit: Habit = {
        ...formData,
        id: Math.max(...habits.map(h => h.id), 0) + 1,
        usageCount: 0,
        successRate: 0
      };
      setHabits(prev => [...prev, newHabit]);
      toast({
        title: "Habit Created",
        description: "New habit has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    setEditingHabit(null);
  };

  const filteredHabits = getFilteredHabits();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Habit & Goal Management</h1>
          <p className="text-gray-600">Create and manage habits for different user groups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900 border border-[#DAF7A6]"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4 mr-2" />
              Suggest New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </DialogTitle>
            </DialogHeader>
            <HabitForm 
              habit={editingHabit}
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
                <p className="text-sm text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold">{habits.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Habits</p>
                <p className="text-2xl font-bold">{habits.filter(h => h.isVisible).length}</p>
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
                  {habits.length > 0 
                    ? Math.round(habits.reduce((sum, h) => sum + h.successRate, 0) / habits.length * 10) / 10
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
                  {habits.reduce((sum, h) => sum + h.usageCount, 0).toLocaleString()}
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
                  placeholder="Search habits by name or description..."
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

          {/* Habits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHabits.map((habit) => (
              <Card key={habit.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{habit.category}</Badge>
                        <Badge className={getDifficultyColor(habit.difficulty)}>
                          {habit.difficulty}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(habit.id)}
                          className="p-1"
                        >
                          {habit.isVisible ? (
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
                  <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-gray-500">Target: {habit.userRole}</div>
                    <div className="flex justify-between text-sm">
                      <span>Used by {habit.usageCount.toLocaleString()} users</span>
                      <span className="text-gray-700">{habit.successRate}% success</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Micro-habits:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {habit.microHabits.slice(0, 2).map((micro, index) => (
                        <li key={index}>• {micro}</li>
                      ))}
                      {habit.microHabits.length > 2 && (
                        <li>• +{habit.microHabits.length - 2} more steps</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(habit)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(habit.id)}
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