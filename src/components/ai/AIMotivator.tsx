import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Brain, MessageCircle, Heart, Target, 
  Clock, Award, Sparkles,
  Send, RefreshCw, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface MotivationalMessage {
  id: string;
  type: 'encouragement' | 'celebration' | 'reminder' | 'challenge' | 'insight';
  content: string;
  timestamp: string;
  liked: boolean;
  disliked: boolean;
  habitContext?: string;
  streakContext?: number;
}

interface AIMotivatorProps {
  habits: any[];
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  currentMood?: number;
}

const defaultMessages: MotivationalMessage[] = [
  {
    id: '1',
    type: 'celebration',
    content: '🎉 Amazing work! You\'ve completed 5 habits today. Your consistency is building a foundation for lasting change. Remember, every small step counts towards your bigger goals!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    liked: true,
    disliked: false,
    habitContext: 'Daily Progress',
    streakContext: 5
  },
  {
    id: '2',
    type: 'encouragement',
    content: '💪 I noticed you\'ve been consistent with your morning meditation. Research shows that people who meditate regularly experience 23% less stress. You\'re building resilience one day at a time!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    liked: false,
    disliked: false,
    habitContext: 'Morning Meditation',
    streakContext: 12
  },
  {
    id: '3',
    type: 'insight',
    content: '🧠 Did you know? Your brain forms new neural pathways after just 21 days of consistent behavior. You\'re literally rewiring your brain for success! Keep going!',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    liked: false,
    disliked: false
  }
];

const motivationalPersonalities = [
  {
    id: 'coach',
    name: 'Coach Alex',
    avatar: '/images/steve.webp',
    specialty: 'Fitness & Motivation',
    style: 'energetic',
    color: 'blue'
  },
  {
    id: 'mindfulness',
    name: 'Zen Master Sarah',
    avatar: '/images/Einstein.webp',
    specialty: 'Mindfulness & Wellness',
    style: 'calm',
    color: 'purple'
  },
  {
    id: 'productivity',
    name: 'Productivity Pro Mike',
    avatar: '/images/gates.webp',
    specialty: 'Productivity & Goals',
    style: 'focused',
    color: 'green'
  }
];

export const AIMotivator: React.FC<AIMotivatorProps> = ({ habits, currentMood = 3 }) => {
  const [messages, setMessages] = useState<MotivationalMessage[]>(defaultMessages);
  const [selectedPersonality, setSelectedPersonality] = useState(motivationalPersonalities[0]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'encouragement': return <Heart className="w-4 h-4 text-red-500" />;
      case 'celebration': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'reminder': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'challenge': return <Target className="w-4 h-4 text-green-500" />;
      case 'insight': return <Brain className="w-4 h-4 text-purple-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'encouragement': return 'bg-red-100 text-red-800';
      case 'celebration': return 'bg-yellow-100 text-yellow-800';
      case 'reminder': return 'bg-blue-100 text-blue-800';
      case 'challenge': return 'bg-green-100 text-green-800';
      case 'insight': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPersonalityColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleLike = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, liked: !msg.liked, disliked: false }
        : msg
    ));
  };

  const toggleDislike = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, disliked: !msg.disliked, liked: false }
        : msg
    ));
  };

  const generateMotivation = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const completedHabits = habits.filter(h => h.completedToday).length;
      const totalHabits = habits.length;
      
      let newMessage: MotivationalMessage;
      
      if (completedHabits === totalHabits && totalHabits > 0) {
        newMessage = {
          id: Date.now().toString(),
          type: 'celebration',
          content: `🎉 Perfect day! You've completed all ${totalHabits} habits! This kind of consistency is what separates dreamers from achievers. You're building momentum that will carry you forward!`,
          timestamp: new Date().toISOString(),
          liked: false,
          disliked: false,
          habitContext: 'Daily Completion',
          streakContext: completedHabits
        };
      } else if (completedHabits > totalHabits / 2) {
        newMessage = {
          id: Date.now().toString(),
          type: 'encouragement',
          content: `💪 Great progress! You've completed ${completedHabits}/${totalHabits} habits today. Remember, consistency beats perfection. Every step forward counts!`,
          timestamp: new Date().toISOString(),
          liked: false,
          disliked: false,
          habitContext: 'Daily Progress',
          streakContext: completedHabits
        };
      } else {
        newMessage = {
          id: Date.now().toString(),
          type: 'reminder',
          content: `🌟 It's never too late to turn today around! You still have time to complete some habits. Small actions compound into massive results over time.`,
          timestamp: new Date().toISOString(),
          liked: false,
          disliked: false,
          habitContext: 'Daily Reminder',
          streakContext: completedHabits
        };
      }
      
      setMessages([newMessage, ...messages]);
      setIsGenerating(false);
    }, 2000);
  };

  const sendMessage = () => {
    if (!userInput.trim()) return;
    
    const userMessage: MotivationalMessage = {
      id: Date.now().toString(),
      type: 'reminder',
      content: userInput,
      timestamp: new Date().toISOString(),
      liked: false,
      disliked: false
    };
    
    setMessages([userMessage, ...messages]);
    setUserInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: MotivationalMessage = {
        id: (Date.now() + 1).toString(),
        type: 'encouragement',
        content: `Thanks for sharing! I'm here to support you on your habit journey. Remember, every challenge is an opportunity to grow stronger.`,
        timestamp: new Date().toISOString(),
        liked: false,
        disliked: false
      };
      
      setMessages([aiResponse, ...messages, userMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">AI Motivator</h2>
          <p className="text-gray-600">Your personalized AI coach for motivation and support</p>
        </div>
        <Button 
          onClick={generateMotivation}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get Motivation
            </>
          )}
        </Button>
      </div>

      {/* AI Coach Selection */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Choose Your AI Coach</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {motivationalPersonalities.map((personality) => (
              <div 
                key={personality.id}
                onClick={() => setSelectedPersonality(personality)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPersonality.id === personality.id
                    ? 'border-purple-300 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-purple-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={personality.avatar} />
                    <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white`}>
                      {personality.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{personality.name}</h4>
                    <p className="text-sm text-gray-600">{personality.specialty}</p>
                    <Badge className="mt-1 bg-purple-100 text-purple-800 text-xs">
                      {personality.style}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Coach */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={selectedPersonality.avatar} />
              <AvatarFallback className={`${getPersonalityColor(selectedPersonality.color)} text-white text-lg`}>
                {selectedPersonality.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold text-gray-900">{selectedPersonality.name}</h3>
                <Badge className="bg-purple-100 text-purple-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Coach
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">{selectedPersonality.specialty}</p>
              <p className="text-sm text-gray-500 mt-2">
                Specializes in {selectedPersonality.style} motivation and habit building
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Mood</div>
              <div className="text-2xl">
                {['😢', '😕', '😐', '🙂', '😊'][currentMood]}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Messages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
        
        {messages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedPersonality.avatar} />
                  <AvatarFallback className={`${getPersonalityColor(selectedPersonality.color)} text-white`}>
                    {selectedPersonality.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{selectedPersonality.name}</span>
                      <Badge className={getMessageTypeColor(message.type)}>
                        {getMessageTypeIcon(message.type)}
                        <span className="ml-1 capitalize">{message.type}</span>
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{message.content}</p>
                  
                  {message.habitContext && (
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500">{message.habitContext}</div>
                      {message.streakContext && (
                        <div className="text-sm font-medium text-gray-700">
                          {message.streakContext} day streak
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 pt-2">
                    <button 
                      onClick={() => toggleLike(message.id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        message.liked ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful</span>
                    </button>
                    <button 
                      onClick={() => toggleDislike(message.id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        message.disliked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Not helpful</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask your AI coach for advice or motivation..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!userInput.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 