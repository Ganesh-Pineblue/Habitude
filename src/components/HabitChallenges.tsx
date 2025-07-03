import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, 
  Users, 
  Target, 
  Calendar, 
  Share2, 
  MessageCircle, 
  Heart, 
  Star, 
  Zap, 
  Crown, 
  Award, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Clock, 
  UserPlus,
  Send,
  Bell,
  Sparkles,
  Flame,
  Brain,
  Activity
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: 7 | 21 | 30;
  type: 'personal' | 'public' | 'private';
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'fitness';
  startDate: string;
  endDate: string;
  participants: ChallengeParticipant[];
  maxParticipants?: number;
  reward?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdBy: string;
  isActive: boolean;
  habitIds: string[];
  dailyTarget: number;
  streakRequired: number;
}

interface ChallengeParticipant {
  id: string;
  name: string;
  avatar?: string;
  progress: number;
  streak: number;
  lastCheckIn: string;
  isActive: boolean;
  role: 'creator' | 'participant' | 'buddy';
  messages: ChallengeMessage[];
  achievements: string[];
}

interface ChallengeMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'motivation' | 'update' | 'celebration' | 'support';
}

interface AccountabilityBuddy {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  sharedHabits: string[];
  mutualChallenges: string[];
  supportLevel: 'high' | 'medium' | 'low';
  timezone: string;
  preferredContact: 'app' | 'email' | 'phone';
}

const defaultChallenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day Morning Meditation Challenge',
    description: 'Start each day with 10 minutes of mindfulness meditation',
    duration: 7,
    type: 'public',
    category: 'mindfulness',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [
      {
        id: 'user1',
        name: 'Sarah Chen',
        avatar: '/public/images/Einstein.webp',
        progress: 85,
        streak: 5,
        lastCheckIn: new Date().toISOString(),
        isActive: true,
        role: 'creator',
        messages: [],
        achievements: ['First Day', '3-Day Streak']
      },
      {
        id: 'user2',
        name: 'Mike Johnson',
        avatar: '/public/images/Gandhi.webp',
        progress: 71,
        streak: 4,
        lastCheckIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        role: 'participant',
        messages: [],
        achievements: ['First Day']
      }
    ],
    maxParticipants: 50,
    reward: 'Meditation Master Badge',
    difficulty: 'easy',
    tags: ['meditation', 'morning', 'mindfulness'],
    createdBy: 'user1',
    isActive: true,
    habitIds: ['1'],
    dailyTarget: 1,
    streakRequired: 5
  },
  {
    id: '2',
    title: '21-Day Fitness Transformation',
    description: 'Complete 30 minutes of exercise daily for 21 days',
    duration: 21,
    type: 'public',
    category: 'fitness',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [
      {
        id: 'user3',
        name: 'Alex Rodriguez',
        avatar: '/public/images/musk.jpg',
        progress: 62,
        streak: 13,
        lastCheckIn: new Date().toISOString(),
        isActive: true,
        role: 'creator',
        messages: [],
        achievements: ['First Week', '10-Day Streak']
      }
    ],
    maxParticipants: 100,
    reward: 'Fitness Warrior Trophy',
    difficulty: 'medium',
    tags: ['fitness', 'exercise', 'transformation'],
    createdBy: 'user3',
    isActive: true,
    habitIds: ['4'],
    dailyTarget: 1,
    streakRequired: 15
  },
  {
    id: '3',
    title: '30-Day Reading Challenge',
    description: 'Read for 20 minutes every day',
    duration: 30,
    type: 'private',
    category: 'productivity',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [
      {
        id: 'user4',
        name: 'Emma Wilson',
        avatar: '/public/images/oprah.webp',
        progress: 33,
        streak: 10,
        lastCheckIn: new Date().toISOString(),
        isActive: true,
        role: 'creator',
        messages: [],
        achievements: ['First Week']
      }
    ],
    maxParticipants: 10,
    reward: 'Bookworm Badge',
    difficulty: 'easy',
    tags: ['reading', 'learning', 'productivity'],
    createdBy: 'user4',
    isActive: true,
    habitIds: [],
    dailyTarget: 1,
    streakRequired: 20
  }
];

const defaultBuddies: AccountabilityBuddy[] = [
  {
    id: 'buddy1',
    name: 'Sarah Chen',
    avatar: '/public/images/Einstein.webp',
    status: 'online',
    lastActive: new Date().toISOString(),
    sharedHabits: ['Morning Meditation', 'Exercise'],
    mutualChallenges: ['7-Day Morning Meditation Challenge'],
    supportLevel: 'high',
    timezone: 'PST',
    preferredContact: 'app'
  },
  {
    id: 'buddy2',
    name: 'Mike Johnson',
    avatar: '/public/images/Gandhi.webp',
    status: 'away',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sharedHabits: ['Drink Water'],
    mutualChallenges: [],
    supportLevel: 'medium',
    timezone: 'EST',
    preferredContact: 'app'
  }
];

const aiMotivators = [
  {
    id: 'motivator1',
    name: 'Coach Alex',
    avatar: '/public/images/steve.webp',
    personality: 'energetic',
    specialty: 'fitness',
    messages: [
      "🔥 You're crushing it! Remember, consistency beats perfection every time.",
      "💪 Every workout is a step toward your best self. Keep pushing!",
      "🌟 Small progress is still progress. Celebrate every win!"
    ]
  },
  {
    id: 'motivator2',
    name: 'Mindful Maya',
    avatar: '/public/images/mother.webp',
    personality: 'calm',
    specialty: 'mindfulness',
    messages: [
      "🧘‍♀️ Take a deep breath. You're exactly where you need to be.",
      "✨ Every moment of mindfulness adds up to a more peaceful life.",
      "🌱 Growth happens in the quiet moments. Trust the process."
    ]
  },
  {
    id: 'motivator3',
    name: 'Productive Pete',
    avatar: '/public/images/gates.webp',
    personality: 'focused',
    specialty: 'productivity',
    messages: [
      "🎯 Focus on progress, not perfection. You're building momentum!",
      "⚡ Small actions compound into massive results. Keep going!",
      "🚀 Every completed task is a victory. Stack those wins!"
    ]
  }
];

interface HabitChallengesProps {
  habits: any[];
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const HabitChallenges: React.FC<HabitChallengesProps> = ({ habits, currentUser }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(defaultChallenges);
  const [buddies, setBuddies] = useState<AccountabilityBuddy[]>(defaultBuddies);
  const [activeTab, setActiveTab] = useState('challenges');
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showFindBuddies, setShowFindBuddies] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    duration: 7 as 7 | 21 | 30,
    type: 'public' as 'public' | 'private',
    category: 'health' as 'health' | 'productivity' | 'mindfulness' | 'social' | 'fitness',
    maxParticipants: 50,
    reward: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
    habitIds: [] as string[],
    dailyTarget: 1,
    streakRequired: 5
  });
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="w-4 h-4" />;
      case 'productivity': return <Target className="w-4 h-4" />;
      case 'mindfulness': return <Brain className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'fitness': return <Activity className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-red-500';
      case 'productivity': return 'bg-blue-500';
      case 'mindfulness': return 'bg-purple-500';
      case 'social': return 'bg-green-500';
      case 'fitness': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const createChallenge = () => {
    const challenge: Challenge = {
      id: Date.now().toString(),
      ...newChallenge,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + newChallenge.duration * 24 * 60 * 60 * 1000).toISOString(),
      participants: [{
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        progress: 0,
        streak: 0,
        lastCheckIn: new Date().toISOString(),
        isActive: true,
        role: 'creator',
        messages: [],
        achievements: []
      }],
      createdBy: currentUser.id,
      isActive: true
    };
    
    setChallenges([...challenges, challenge]);
    setNewChallenge({
      title: '',
      description: '',
      duration: 7,
      type: 'public',
      category: 'health',
      maxParticipants: 50,
      reward: '',
      difficulty: 'easy',
      tags: [],
      habitIds: [],
      dailyTarget: 1,
      streakRequired: 5
    });
    setShowCreateChallenge(false);
  };

  const joinChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId) {
        const newParticipant: ChallengeParticipant = {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          progress: 0,
          streak: 0,
          lastCheckIn: new Date().toISOString(),
          isActive: true,
          role: 'participant',
          messages: [],
          achievements: []
        };
        return {
          ...challenge,
          participants: [...challenge.participants, newParticipant]
        };
      }
      return challenge;
    }));
  };

  const sendMessage = (challengeId: string) => {
    if (!newMessage.trim()) return;
    
    const message: ChallengeMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'motivation'
    };

    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          participants: challenge.participants.map(participant => {
            if (participant.id === currentUser.id) {
              return {
                ...participant,
                messages: [...participant.messages, message]
              };
            }
            return participant;
          })
        };
      }
      return challenge;
    }));
    
    setNewMessage('');
  };

  const getRandomMotivator = () => {
    const motivator = aiMotivators[Math.floor(Math.random() * aiMotivators.length)];
    const message = motivator.messages[Math.floor(Math.random() * motivator.messages.length)];
    return { ...motivator, currentMessage: message };
  };

  const [currentMotivator] = useState(getRandomMotivator());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Habit Challenges & Social</h2>
          <p className="text-gray-600">Join challenges, find accountability buddies, and stay motivated together</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowCreateChallenge(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Challenge
          </Button>
          <Button 
            onClick={() => setShowFindBuddies(true)}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Buddies
          </Button>
        </div>
      </div>

      {/* AI Motivator */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={currentMotivator.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {currentMotivator.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{currentMotivator.name}</h3>
                <Badge className="bg-purple-100 text-purple-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Coach
                </Badge>
              </div>
              <p className="text-gray-700 mt-1">{currentMotivator.currentMessage}</p>
              <p className="text-sm text-gray-500 mt-1">Specializes in {currentMotivator.specialty}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-100">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200">
          <TabsTrigger value="challenges" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Trophy className="w-4 h-4" />
            <span>Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="my-challenges" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Target className="w-4 h-4" />
            <span>My Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="buddies" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Users className="w-4 h-4" />
            <span>Buddies</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2 rounded-xl font-medium text-gray-600 data-[state=active]:text-green-600 data-[state=active]:bg-white">
            <Crown className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        {/* Available Challenges */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.filter(c => c.type === 'public' && !c.participants.find(p => p.id === currentUser.id)).map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${getCategoryColor(challenge.category)}`}>
                        {getCategoryIcon(challenge.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{challenge.duration} days</div>
                      <div className="text-xs text-gray-400">
                        {challenge.participants.length}/{challenge.maxParticipants}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {challenge.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{challenge.participants.length} participants</span>
                    </div>
                    {challenge.reward && (
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{challenge.reward}</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => joinChallenge(challenge.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Challenges */}
        <TabsContent value="my-challenges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.filter(c => c.participants.find(p => p.id === currentUser.id)).map((challenge) => {
              const myProgress = challenge.participants.find(p => p.id === currentUser.id);
              const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const progressPercentage = (myProgress?.progress || 0) / challenge.duration * 100;
              
              return (
                <Card key={challenge.id} className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getCategoryColor(challenge.category)}`}>
                          {getCategoryIcon(challenge.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              {myProgress?.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{daysLeft} days left</div>
                        <div className="text-xs text-gray-400">
                          {myProgress?.streak || 0} day streak
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{myProgress?.progress || 0}/{challenge.duration} days</span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <div className="text-xs text-gray-500">
                        {progressPercentage.toFixed(1)}% complete
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{challenge.participants.length} participants</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedChallenge(challenge)}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>

                    {myProgress?.achievements.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">Achievements</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {myProgress.achievements.map((achievement, index) => (
                            <Badge key={index} className="bg-yellow-100 text-yellow-800 text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Accountability Buddies */}
        <TabsContent value="buddies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buddies.map((buddy) => (
              <Card key={buddy.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={buddy.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {buddy.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{buddy.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          buddy.status === 'online' ? 'bg-green-500' : 
                          buddy.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm text-gray-600 capitalize">{buddy.status}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Support Level</span>
                      <Badge className={
                        buddy.supportLevel === 'high' ? 'bg-green-100 text-green-800' :
                        buddy.supportLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {buddy.supportLevel}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div>Shared Habits: {buddy.sharedHabits.length}</div>
                      <div>Mutual Challenges: {buddy.mutualChallenges.length}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span>This Week's Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.flatMap(c => c.participants)
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 10)
                  .map((participant, index) => (
                    <div key={participant.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{participant.name}</div>
                          <div className="text-sm text-gray-600">{participant.streak} day streak</div>
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="text-lg font-bold text-gray-900">{participant.progress}%</div>
                        <div className="text-sm text-gray-600">progress</div>
                      </div>
                      {index < 3 && (
                        <div className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Challenge Title</Label>
                  <Input
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                    placeholder="e.g., 7-Day Morning Meditation Challenge"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Select
                    value={newChallenge.duration.toString()}
                    onValueChange={(value) => setNewChallenge({...newChallenge, duration: parseInt(value) as 7 | 21 | 30})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="21">21 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Describe what participants need to do..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newChallenge.category}
                    onValueChange={(value) => setNewChallenge({...newChallenge, category: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={newChallenge.difficulty}
                    onValueChange={(value) => setNewChallenge({...newChallenge, difficulty: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newChallenge.type}
                    onValueChange={(value) => setNewChallenge({...newChallenge, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Max Participants</Label>
                  <Input
                    type="number"
                    value={newChallenge.maxParticipants}
                    onChange={(e) => setNewChallenge({...newChallenge, maxParticipants: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Reward</Label>
                  <Input
                    value={newChallenge.reward}
                    onChange={(e) => setNewChallenge({...newChallenge, reward: e.target.value})}
                    placeholder="e.g., Fitness Warrior Badge"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={createChallenge} className="bg-green-600 hover:bg-green-700 text-white">
                  Create Challenge
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateChallenge(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Challenge Chat Modal */}
      {selectedChallenge && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedChallenge.title} - Chat</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedChallenge(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                {selectedChallenge.participants.flatMap(p => p.messages).map((message) => (
                  <div key={message.id} className="mb-3">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {message.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{message.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedChallenge.id)}
                />
                <Button 
                  onClick={() => sendMessage(selectedChallenge.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}; 