import React, { useState } from 'react';
import { User, Mail, Calendar, Trophy, Edit, Save, X, ArrowLeft, Heart, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface ExtendedUser {
  name: string;
  email: string;
  generation?: string;
  gender?: string;
  customGender?: string;
  roleModel?: string;
  roleModelHabits?: string;
  streak?: number;
  joinDate?: string;
}

const roleModels = [
  { 
    value: 'steve-jobs', 
    label: 'Steve Jobs', 
    habits: 'Daily meditation, Minimalist workspace, Walking meetings, Focus on one project, Early morning routine, Reading biographies, Perfectionist mindset, Healthy eating, Regular exercise, Deep work sessions'
  },
  { 
    value: 'oprah-winfrey', 
    label: 'Oprah Winfrey', 
    habits: 'Daily gratitude practice, Morning journaling, Regular reading, Mindful eating, Exercise routine, Helping others, Positive affirmations, Quality sleep, Learning new things, Building relationships'
  },
  { 
    value: 'elon-musk', 
    label: 'Elon Musk', 
    habits: 'Reading extensively, Working long hours, Problem-solving focus, Taking calculated risks, Continuous learning, Physical exercise, Healthy diet, Goal setting, Innovation mindset, Time blocking'
  },
  { 
    value: 'michelle-obama', 
    label: 'Michelle Obama', 
    habits: 'Morning workouts, Family time priority, Healthy eating, Community service, Continuous education, Public speaking, Writing daily, Self-care routine, Mentoring others, Work-life balance'
  },
  { 
    value: 'warren-buffett', 
    label: 'Warren Buffett', 
    habits: 'Reading 5 hours daily, Long-term thinking, Simple living, Playing bridge, Annual letters, Value investing, Patience practice, Learning from mistakes, Staying curious, Giving back'
  },
  { 
    value: 'bill-gates', 
    label: 'Bill Gates', 
    habits: 'Reading 50 books/year, Think weeks, Learning continuously, Problem-solving, Giving to charity, Time management, Healthy lifestyle, Innovation focus, Global awareness, Technology adoption'
  },
  { 
    value: 'albert-einstein', 
    label: 'Albert Einstein', 
    habits: 'Deep thinking sessions, Questioning assumptions, Imagination exercises, Mathematical practice, Reading philosophy, Playing violin, Walking for inspiration, Simple living, Curiosity cultivation, Independent thinking'
  },
  { 
    value: 'mahatma-gandhi', 
    label: 'Mahatma Gandhi', 
    habits: 'Daily prayer and meditation, Fasting for discipline, Non-violent communication, Simple living, Walking daily, Reading religious texts, Spinning cotton, Truth and honesty, Service to others, Self-reflection'
  },
  { 
    value: 'nelson-mandela', 
    label: 'Nelson Mandela', 
    habits: 'Early morning exercise, Reading and education, Forgiveness practice, Unity building, Listening to others, Staying positive, Leading by example, Persistence in goals, Respect for all people, Hope and optimism'
  }
];

const genderOptions = [
  { value: 'mr', label: 'Mr.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'mx', label: 'Mx. (Gender-neutral)' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'custom', label: 'Custom' }
];

const generations = [
  { value: 'gen-alpha', label: 'Gen Alpha (2010-2024)' },
  { value: 'gen-z', label: 'Gen Z (1997-2012)' },
  { value: 'millennial', label: 'Millennial (1981-1996)' },
  { value: 'gen-x', label: 'Gen X (1965-1980)' },
  { value: 'boomer', label: 'Baby Boomer (1946-1964)' },
  { value: 'silent', label: 'Silent Generation (1928-1945)' }
];

export const ProfilePage = () => {
  const { currentUser, updateUser } = useUser();
  const [editedUser, setEditedUser] = useState<ExtendedUser>({
    ...currentUser,
    generation: currentUser.generation || '',
    gender: currentUser.gender || '',
    customGender: currentUser.customGender || '',
    roleModel: currentUser.roleModel || '',
    roleModelHabits: currentUser.roleModelHabits || ''
  });
  const [openRoleModel, setOpenRoleModel] = useState(false);
  const [openGeneration, setOpenGeneration] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const navigate = useNavigate();

  // Redirect if no user is logged in
  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleSave = () => {
    updateUser(editedUser);
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRoleModelSelect = (value: string) => {
    const selectedRoleModel = roleModels.find(rm => rm.value === value);
    setEditedUser({
      ...editedUser,
      roleModel: selectedRoleModel?.label || '',
      roleModelHabits: selectedRoleModel?.habits || ''
    });
    setOpenRoleModel(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" size="sm" onClick={handleBack} className="bg-white/80 backdrop-blur-sm hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
            Edit Profile
          </h1>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
                              <div className="text-center space-y-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 mx-auto border-4 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <AvatarImage src="" alt={currentUser.name} />
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-green-600 to-green-800">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{currentUser.name}</h3>
                  <p className="text-gray-600 text-sm">{currentUser.email}</p>
                  {currentUser.streak && (
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <Trophy className="w-4 h-4 mr-1" />
                      {currentUser.streak} day streak
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-6">
                  {/* Full Name - Full Row */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2 text-green-600" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Generation and Gender - One Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        Generation
                      </Label>
                      <Popover open={openGeneration} onOpenChange={setOpenGeneration}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openGeneration}
                            className="w-full justify-between border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                          >
                            {editedUser.generation
                              ? generations.find((generation) => generation.value === editedUser.generation)?.label
                              : "Select generation..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search generation..." />
                            <CommandList>
                              <CommandEmpty>No generation found.</CommandEmpty>
                              <CommandGroup>
                                {generations.map((generation) => (
                                  <CommandItem
                                    key={generation.value}
                                    value={generation.value}
                                    onSelect={() => {
                                      setEditedUser({ ...editedUser, generation: generation.value });
                                      setOpenGeneration(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        editedUser.generation === generation.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {generation.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-pink-600" />
                        Gender
                      </Label>
                      <Popover open={openGender} onOpenChange={setOpenGender}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openGender}
                            className="w-full justify-between border-gray-200 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200"
                          >
                            {editedUser.gender
                              ? genderOptions.find((option) => option.value === editedUser.gender)?.label || editedUser.gender
                              : "Select gender..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search gender..." />
                            <CommandList>
                              <CommandEmpty>No gender found.</CommandEmpty>
                              <CommandGroup>
                                {genderOptions.map((option) => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                      setEditedUser({ ...editedUser, gender: option.value, customGender: '' });
                                      setOpenGender(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        editedUser.gender === option.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Custom Gender Input */}
                  {editedUser.gender === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customGender" className="text-sm font-semibold text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2 text-purple-600" />
                        Custom Gender
                      </Label>
                      <Input
                        id="customGender"
                        value={editedUser.customGender}
                        onChange={(e) => setEditedUser({ ...editedUser, customGender: e.target.value })}
                        placeholder="Enter your preferred gender term..."
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-600" />
                      Role Model
                    </Label>
                    <Popover open={openRoleModel} onOpenChange={setOpenRoleModel}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openRoleModel}
                          className="w-full justify-between border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-200"
                        >
                          {editedUser.roleModel || "Select role model..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search role models..." />
                          <CommandList>
                            <CommandEmpty>No role model found.</CommandEmpty>
                            <CommandGroup>
                              {roleModels.map((roleModel) => (
                                <CommandItem
                                  key={roleModel.value}
                                  value={roleModel.value}
                                  onSelect={() => handleRoleModelSelect(roleModel.value)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      editedUser.roleModel === roleModel.label ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {roleModel.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleModelHabits" className="text-sm font-semibold text-gray-700 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-purple-600" />
                      Role Model Habits
                    </Label>
                    <Textarea
                      id="roleModelHabits"
                      value={editedUser.roleModelHabits}
                      onChange={(e) => setEditedUser({ ...editedUser, roleModelHabits: e.target.value })}
                      placeholder="The habits and qualities of your selected role model will appear here..."
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 min-h-[100px] transition-all duration-200"
                      readOnly={!!editedUser.roleModel}
                    />
                  </div>
                </div>

                {/* Save Button at Bottom */}
                <div className="pt-8 border-t border-gray-200">
                  <Button 
                    onClick={handleSave} 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Save className="w-5 h-5 mr-3" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 