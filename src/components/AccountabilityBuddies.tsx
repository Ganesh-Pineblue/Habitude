import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, MessageCircle, Heart, Star, UserPlus, Search,
  Clock, Calendar, Target, Zap, Crown, Award, CheckCircle2,
  AlertCircle, TrendingUp, Activity, Brain, Heart as HeartIcon
} from 'lucide-react';

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
  compatibility: number;
  bio: string;
  achievements: string[];
  currentStreak: number;
  totalHabits: number;
}

interface BuddyRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface AccountabilityBuddiesProps {
  habits: any[];
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const defaultBuddies: AccountabilityBuddy[] = [
  {
    id: 'buddy1',
    name: 'Sarah Chen',
    avatar: '/public/images/Einstein.webp',
    status: 'online',
    lastActive: new Date().toISOString(),
    sharedHabits: ['Morning Meditation', 'Exercise', 'Reading'],
    mutualChallenges: ['7-Day Morning Meditation Challenge'],
    supportLevel: 'high',
    timezone: 'PST',
    preferredContact: 'app',
    compatibility: 95,
    bio: 'Passionate about mindfulness and helping others build healthy habits. Let\'s support each other!',
    achievements: ['30-day meditation streak', 'Fitness challenge winner', 'Early bird badge'],
    currentStreak: 15,
    totalHabits: 8
  },
  {
    id: 'buddy2',
    name: 'Alex Johnson',
    avatar: '/public/images/steve.webp',
    status: 'away',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sharedHabits: ['Exercise', 'Drink Water'],
    mutualChallenges: ['21-Day Fitness Challenge'],
    supportLevel: 'medium',
    timezone: 'EST',
    preferredContact: 'app',
    compatibility: 78,
    bio: 'Fitness enthusiast and habit builder. Always looking for workout buddies!',
    achievements: ['100-day exercise streak', 'Water drinking champion'],
    currentStreak: 8,
    totalHabits: 5
  }
];

const defaultRequests: BuddyRequest[] = [
  {
    id: 'req1',
    fromUserId: 'user3',
    fromUserName: 'Maria Garcia',
    fromUserAvatar: '/public/images/mother.webp',
    message: 'Hi! I noticed we both have meditation habits. Would love to be accountability buddies!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

export const AccountabilityBuddies: React.FC<AccountabilityBuddiesProps> = ({ habits, currentUser }) => {
  const [buddies, setBuddies] = useState<AccountabilityBuddy[]>(defaultBuddies);
  const [requests, setRequests] = useState<BuddyRequest[]>(defaultRequests);
  const [showFindBuddies, setShowFindBuddies] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const acceptRequest = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
    // In a real app, you'd add the user to buddies list
  };

  const declineRequest = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'declined' } : req
    ));
  };

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buddy.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           buddy.sharedHabits.some(habit => 
                             habits.find(h => h.title === habit)?.category === selectedCategory
                           );
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Accountability Buddies</h2>
          <p className="text-gray-600">Connect with like-minded people and support each other's habit journey</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowFindBuddies(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Buddies
          </Button>
          <Button 
            variant="outline"
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Group Chat
          </Button>
        </div>
      </div>

      {/* Buddy Requests */}
      {requests.filter(r => r.status === 'pending').length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Buddy Requests</span>
              <Badge className="bg-blue-100 text-blue-800">
                {requests.filter(r => r.status === 'pending').length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <div key={request.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-blue-200">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={request.fromUserAvatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {request.fromUserName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{request.fromUserName}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(request.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{request.message}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => acceptRequest(request.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept
                  </Button>
                  <Button 
                    onClick={() => declineRequest(request.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search buddies by name or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-gray-200 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="health">Health</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="social">Social</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Current Buddies */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">My Accountability Buddies</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBuddies.map((buddy) => (
            <Card key={buddy.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={buddy.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                          {buddy.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(buddy.status)}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{buddy.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getSupportLevelColor(buddy.supportLevel)}>
                          {buddy.supportLevel} support
                        </Badge>
                        <Badge className={`${getCompatibilityColor(buddy.compatibility)} bg-gray-100`}>
                          {buddy.compatibility}% match
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{buddy.timezone}</div>
                    <div className="text-xs text-gray-400">
                      {buddy.status === 'online' ? 'Active now' : 
                       buddy.status === 'away' ? 'Away' : 'Offline'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{buddy.bio}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Shared Habits</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {buddy.sharedHabits.map((habit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {habit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Recent Achievements</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {buddy.achievements.slice(0, 3).map((achievement, index) => (
                        <Badge key={index} className="bg-yellow-100 text-yellow-800 text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{buddy.currentStreak}</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{buddy.totalHabits}</div>
                    <div className="text-xs text-gray-600">Active Habits</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{buddy.mutualChallenges.length}</div>
                    <div className="text-xs text-gray-600">Challenges</div>
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
                    <HeartIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Find Buddies Modal */}
      {showFindBuddies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Find Accountability Buddies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => ({
                  id: `suggested-${i}`,
                  name: `Suggested Buddy ${i + 1}`,
                  avatar: `/public/images/${['Einstein', 'steve', 'mother', 'gates', 'mandela', 'oprah'][i]}.webp`,
                  compatibility: Math.floor(Math.random() * 30) + 70,
                  sharedHabits: habits.slice(0, Math.floor(Math.random() * 3) + 1).map(h => h.title),
                  bio: 'Looking for accountability partners to build better habits together!'
                })).map((suggested) => (
                  <Card key={suggested.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={suggested.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {suggested.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900">{suggested.name}</h4>
                          <Badge className={`${getCompatibilityColor(suggested.compatibility)} bg-gray-100`}>
                            {suggested.compatibility}% match
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{suggested.bio}</p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">Shared Habits:</div>
                        <div className="flex flex-wrap gap-1">
                          {suggested.sharedHabits.map((habit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {habit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Send Request
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFindBuddies(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 