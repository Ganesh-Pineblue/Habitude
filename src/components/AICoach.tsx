import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Send, Sparkles, Target, Brain, Heart, Lightbulb, BookOpen } from 'lucide-react';

interface AICoachProps {
  personalityProfile?: any;
  habits?: any[];
  goals?: any[];
  currentMood?: number;
  userName?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

export const AICoach = ({ 
  personalityProfile, 
  habits = [], 
  goals = [], 
  currentMood = 2, 
  userName = 'there' 
}: AICoachProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${userName}! 👋 I'm your AI coach and knowledge companion. I can help with personal development, answer questions on any topic, provide detailed explanations, and give personalized advice based on your habits, goals, and mood. Ask me anything - from science and history to productivity tips and life advice!`,
      sender: 'coach',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateComprehensiveResponse(inputValue, {
          personalityProfile,
          habits,
          goals,
          currentMood,
          userName
        }),
        sender: 'coach',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1500);

    setInputValue('');
  };

  const generateComprehensiveResponse = (userInput: string, context: any) => {
    const input = userInput.toLowerCase();
    const { habits, goals, currentMood, userName, personalityProfile } = context;
    
    // Get user insights
    const completedHabits = habits.filter((h: any) => h.completedToday).length;
    const totalHabits = habits.length;
    const habitProgress = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map((h: any) => h.streak || 0)) : 0;
    const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
    const currentMoodLabel = moodLabels[currentMood] || 'Neutral';

    // Science & Technology Topics
    if (input.includes('science') || input.includes('physics') || input.includes('chemistry') || input.includes('biology')) {
      return `🔬 **Science & Discovery**\n\nScience is the systematic study of the natural world through observation and experimentation. It encompasses:\n\n• **Physics**: Studies matter, energy, and their interactions\n• **Chemistry**: Focuses on substances and their transformations\n• **Biology**: Examines living organisms and life processes\n\n${personalityProfile?.favoritePersonality === 'Einstein' ? 'Like Einstein, your inspiration shows in your curiosity!' : 'Science connects to your daily habits too!'} ${habitProgress >= 50 ? 'Your disciplined approach to habits mirrors the scientific method!' : 'Consider adding a learning habit to explore science daily!'}\n\nWhat specific scientific topic interests you most? 🧪`;
    }

    if (input.includes('artificial intelligence') || input.includes('ai') || input.includes('machine learning')) {
      return `🤖 **Artificial Intelligence & Machine Learning**\n\nAI is the simulation of human intelligence by computers. Key areas include:\n\n• **Machine Learning**: Algorithms that improve through experience\n• **Deep Learning**: Neural networks mimicking brain function\n• **Natural Language Processing**: Understanding human language\n• **Computer Vision**: Interpreting visual information\n\nApplications: Healthcare diagnosis, autonomous vehicles, personal assistants, and productivity tools like this chat!\n\n${currentMood >= 3 ? 'Your positive mood is perfect for learning about cutting-edge technology!' : 'Learning about AI might boost your mood - it\'s fascinating!'} ${totalHabits > 0 ? 'You could add a \'learn something new daily\' habit!' : ''}\n\nWant to know about specific AI applications? 🚀`;
    }

    // History & Culture
    if (input.includes('history') || input.includes('ancient') || input.includes('civilization') || input.includes('culture')) {
      return `📚 **History & Human Civilization**\n\nHistory teaches us about human progress, mistakes, and achievements:\n\n• **Ancient Civilizations**: Egypt, Greece, Rome, China - foundations of modern society\n• **Medieval Period**: Development of trade, universities, and cultural exchange\n• **Renaissance**: Rebirth of art, science, and human potential\n• **Modern Era**: Industrial revolution, democratic movements, technological advancement\n\n${personalityProfile?.favoritePersonality ? `Your inspiration from ${personalityProfile.favoritePersonality} connects you to historical greatness!` : 'Every great person in history built daily habits of excellence.'} ${longestStreak >= 7 ? 'Your consistency mirrors historical achievers!' : ''}\n\nWhich historical period or figure fascinates you? 🏛️`;
    }

    // Psychology & Mental Health
    if (input.includes('psychology') || input.includes('mental health') || input.includes('emotions') || input.includes('brain')) {
      return `🧠 **Psychology & Mental Wellness**\n\nPsychology studies the mind and behavior. Key insights:\n\n• **Neuroplasticity**: Your brain rewires itself through habits (like your ${longestStreak}-day streak!)\n• **Cognitive Biases**: Mental shortcuts that can mislead us\n• **Emotional Regulation**: Managing feelings for better outcomes\n• **Positive Psychology**: Focus on what makes life worth living\n\n**Your Current State**: Mood is ${currentMoodLabel}, ${habitProgress}% habit completion today.\n\nMental health tips based on research:\n• Regular exercise (${habits.some((h: any) => h.category === 'health') ? 'You have this!' : 'Consider adding this'})\n• Mindfulness practice\n• Social connections\n• Purpose-driven activities\n\nWhat aspect of psychology interests you most? 🌱`;
    }

    // Health & Nutrition
    if (input.includes('health') || input.includes('nutrition') || input.includes('diet') || input.includes('exercise') || input.includes('fitness')) {
      return `💪 **Health & Nutrition Science**\n\nOptimal health involves multiple factors:\n\n**Nutrition Basics**:\n• Macronutrients: Proteins (muscle building), Carbs (energy), Fats (hormone production)\n• Micronutrients: Vitamins and minerals for cellular function\n• Hydration: 2-3 liters water daily for optimal function\n\n**Exercise Science**:\n• Cardiovascular: Strengthens heart, improves endurance\n• Strength training: Builds muscle, bone density\n• Flexibility: Maintains joint health, prevents injury\n\n**Your Health Journey**: ${habits.filter((h: any) => h.category === 'health').length > 0 ? 'You\'re already building healthy habits! 🎉' : 'Perfect time to start health-focused habits!'} ${currentMood >= 3 ? 'Your good mood supports healthy choices!' : 'Exercise can naturally boost your mood!'}\n\nWhat health topic would you like to explore deeper? 🏃‍♂️`;
    }

    // Productivity & Time Management
    if (input.includes('productivity') || input.includes('time management') || input.includes('efficiency') || input.includes('focus')) {
      return `⚡ **Productivity & Time Mastery**\n\nProductivity isn't about doing more - it's about doing what matters:\n\n**Core Principles**:\n• **Pareto Principle**: 80% of results come from 20% of efforts\n• **Deep Work**: Focused attention on cognitively demanding tasks\n• **Energy Management**: Work with your natural rhythms\n• **Systems > Goals**: Build processes that create outcomes\n\n**Techniques**:\n• Pomodoro Technique (25min focused work + 5min break)\n• Time blocking\n• Priority matrices\n• Habit stacking\n\n**Your Productivity Insights**: ${habitProgress}% habit completion shows ${habitProgress >= 70 ? 'excellent self-discipline!' : 'room for systematic improvement!'} ${currentMood >= 3 ? 'Your positive energy is perfect for productive work!' : 'Start with easy tasks to build momentum!'}\n\nWhich productivity method interests you? 🎯`;
    }

    // Philosophy & Life Wisdom
    if (input.includes('philosophy') || input.includes('meaning') || input.includes('purpose') || input.includes('wisdom') || input.includes('life advice')) {
      return `🌟 **Philosophy & Life Wisdom**\n\nPhilosophy helps us understand existence, values, and how to live well:\n\n**Major Schools**:\n• **Stoicism**: Focus on what you can control (like your habits!)\n• **Existentialism**: Create your own meaning and purpose\n• **Buddhism**: Suffering comes from attachment; find peace within\n• **Humanism**: Human dignity and worth are paramount\n\n**Practical Wisdom**:\n• Aristotle's Golden Mean: Balance in all things\n• Socratic Method: Question everything to find truth\n• Mindfulness: Present-moment awareness\n• Growth Mindset: Challenges are opportunities\n\n**Personal Application**: ${personalityProfile?.favoritePersonality ? `Your inspiration from ${personalityProfile.favoritePersonality} reflects deep values.` : 'Your journey of self-improvement shows philosophical thinking!'} ${longestStreak >= 3 ? 'Your consistency demonstrates Stoic principles!' : ''}\n\nWhat philosophical question keeps you curious? 🤔`;
    }

    // Technology & Innovation
    if (input.includes('technology') || input.includes('innovation') || input.includes('future') || input.includes('invention')) {
      return `🚀 **Technology & Innovation**\n\nTechnology shapes our world and possibilities:\n\n**Emerging Technologies**:\n• **Quantum Computing**: Solving complex problems exponentially faster\n• **Biotechnology**: Gene editing, personalized medicine\n• **Renewable Energy**: Solar, wind, fusion power\n• **Space Technology**: Mars exploration, satellite internet\n\n**Innovation Principles**:\n• Iterative improvement\n• User-centered design\n• Cross-disciplinary thinking\n• Fail fast, learn faster\n\n**Digital Wellness**: ${currentMood >= 3 ? 'Your positive mood helps you engage meaningfully with technology!' : 'Technology should enhance, not replace, human connection.'} ${habits.some((h: any) => h.title.includes('screen') || h.title.includes('digital')) ? 'Great to see digital wellness in your habits!' : 'Consider adding mindful technology use as a habit!'}\n\nWhich technological advancement excites you most? 💡`;
    }

    // Business & Economics
    if (input.includes('business') || input.includes('economics') || input.includes('entrepreneurship') || input.includes('money') || input.includes('finance')) {
      return `💼 **Business & Economics**\n\nUnderstanding how value is created and exchanged:\n\n**Economic Fundamentals**:\n• Supply & Demand: Price mechanisms in markets\n• Compound Interest: Einstein called it "8th wonder of the world"\n• Risk & Return: Higher potential returns require higher risk\n• Diversification: Don't put all eggs in one basket\n\n**Business Principles**:\n• Customer value creation\n• Sustainable competitive advantage\n• Cash flow management\n• Continuous innovation\n\n**Entrepreneurial Mindset**: ${personalityProfile?.favoritePersonality === 'Steve Jobs' || personalityProfile?.favoritePersonality === 'Elon Musk' ? 'Your inspiration from visionary entrepreneurs is perfect!' : 'Entrepreneurs think differently about problems and solutions.'} ${habitProgress >= 50 ? 'Your habit discipline translates perfectly to business success!' : 'Building habits is like building a business - consistency wins!'}\n\nWhat business concept would you like to explore? 📈`;
    }

    // Arts & Creativity
    if (input.includes('art') || input.includes('creativity') || input.includes('music') || input.includes('writing') || input.includes('design')) {
      return `🎨 **Arts & Creative Expression**\n\nCreativity is humanity's superpower:\n\n**Artistic Domains**:\n• **Visual Arts**: Painting, sculpture, photography, digital art\n• **Performing Arts**: Music, dance, theater, film\n• **Literary Arts**: Poetry, fiction, non-fiction, journalism\n• **Design**: Architecture, graphic design, UX/UI, fashion\n\n**Creative Process**:\n• Inspiration: Gathering ideas from diverse sources\n• Incubation: Letting ideas develop subconsciously\n• Illumination: The "aha!" moment\n• Implementation: Bringing ideas to life\n\n**Creativity & You**: ${currentMood >= 3 ? 'Your positive mood is perfect for creative expression!' : 'Creative activities can boost mood and provide meaningful outlets!'} ${habits.some((h: any) => h.category === 'creativity' || h.title.includes('art') || h.title.includes('music')) ? 'Love seeing creative habits in your routine!' : 'Consider adding a daily creative practice!'}\n\nWhat form of creative expression calls to you? 🌈`;
    }

    // Personal Development & Growth
    if (input.includes('personal development') || input.includes('self improvement') || input.includes('growth') || input.includes('potential')) {
      return `🌱 **Personal Development & Growth**\n\nContinuous improvement is the path to fulfillment:\n\n**Growth Frameworks**:\n• **Maslow's Hierarchy**: From basic needs to self-actualization\n• **Flow State**: Optimal challenge-skill balance\n• **Deliberate Practice**: Focused improvement in specific areas\n• **Growth Mindset**: Abilities develop through dedication\n\n**Key Areas**:\n• Emotional Intelligence: Understanding and managing emotions\n• Communication Skills: Expressing ideas clearly and empathetically\n• Critical Thinking: Analyzing information objectively\n• Resilience: Bouncing back from setbacks stronger\n\n**Your Development**: Currently at ${habitProgress}% habit completion with ${currentMoodLabel} mood. ${longestStreak >= 7 ? 'Your consistency shows commitment to growth!' : 'Every day is a new opportunity to develop!'} ${personalityProfile ? 'Your personality profile guides your unique development path.' : ''}\n\nWhat aspect of yourself would you like to develop further? 💫`;
    }

    // Communication & Relationships
    if (input.includes('communication') || input.includes('relationship') || input.includes('social') || input.includes('people')) {
      return `🤝 **Communication & Relationships**\n\nHuman connections are fundamental to wellbeing:\n\n**Communication Principles**:\n• **Active Listening**: Truly hear and understand others\n• **Empathy**: See situations from others' perspectives\n• **Clarity**: Express thoughts clearly and concisely\n• **Non-verbal Communication**: Body language speaks volumes\n\n**Relationship Types**:\n• Professional: Collaboration, networking, mentorship\n• Personal: Family, friends, romantic partnerships\n• Community: Neighbors, groups, social causes\n\n**Building Connections**: ${currentMood >= 3 ? 'Your positive mood makes you naturally more approachable!' : 'Genuine connections can significantly boost mood and life satisfaction.'} ${habits.some((h: any) => h.title.includes('call') || h.title.includes('connect') || h.title.includes('social')) ? 'Great to see relationship habits in your routine!' : 'Consider adding a daily connection habit!'}\n\nWhat relationship area would you like to strengthen? 💝`;
    }

    // Default comprehensive response
    const responses = [
      `📖 **Comprehensive Response**\n\nThat's a fascinating topic! I'd love to provide you with detailed information. As your AI companion, I can explain concepts across:\n\n🔬 Science & Technology\n📚 History & Culture  \n🧠 Psychology & Mental Health\n💪 Health & Nutrition\n⚡ Productivity & Success\n🌟 Philosophy & Wisdom\n🎨 Arts & Creativity\n💼 Business & Economics\n\n**Personalized Context**: With your ${currentMoodLabel} mood and ${habitProgress}% habit completion today, ${currentMood >= 3 ? 'you\'re in a great state for learning!' : 'exploring new topics might boost your energy!'}\n\n${personalityProfile?.favoritePersonality ? `Drawing inspiration from ${personalityProfile.favoritePersonality}, ` : ''}Could you be more specific about what aspect interests you most? I'll provide comprehensive insights! 🌟`,

      `🎓 **Knowledge Explorer**\n\nI'm here to dive deep into any topic that sparks your curiosity! My knowledge spans:\n\n• Scientific discoveries and innovations\n• Historical events and cultural insights\n• Psychological principles and human behavior\n• Health, wellness, and performance optimization\n• Business strategies and economic principles\n• Creative processes and artistic expression\n• Philosophical wisdom and life guidance\n\n**Your Learning Journey**: ${longestStreak >= 3 ? `Your ${longestStreak}-day streak shows you value consistency - great for learning!` : 'Learning something new daily could be your next powerful habit!'} ${currentMood >= 3 ? 'Your positive energy is perfect for intellectual exploration!' : 'Engaging with fascinating topics often improves mood naturally!'}\n\nWhat would you like to explore in depth today? 🔍`,

      `💡 **Universal Guide**\n\nI'm designed to be your comprehensive knowledge companion! Whether you're curious about:\n\n🌌 How the universe works\n🏛️ Lessons from history\n🧬 Mysteries of life and consciousness\n🚀 Future technologies and possibilities\n📈 Success principles and strategies\n🎭 Human nature and relationships\n🌍 Global cultures and perspectives\n\n**Tailored to You**: Based on your current ${habitProgress}% progress and ${currentMoodLabel} mood, ${habitProgress >= 50 ? 'your disciplined approach will help you master new concepts!' : 'learning can be the catalyst for building better systems!'}\n\nShare any topic, question, or area of interest - I'll provide thorough, engaging explanations! 🌟`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const suggestedQuestions = [
    "Explain quantum physics simply",
    "History of ancient civilizations", 
    "How does the brain work?",
    "Best productivity techniques",
    "Philosophy of happiness",
    "Future of technology",
    "Psychology of motivation",
    "Science of habit formation"
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Knowledge Companion</h2>
              <p className="text-sm text-gray-600 font-normal">Your personal encyclopedia & life coach</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* User Progress Summary */}
          {(habits.length > 0 || goals.length > 0) && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Your Personal Context</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                {habits.length > 0 && (
                  <div>📊 Daily Progress: {habits.filter(h => h.completedToday).length}/{habits.length} habits completed</div>
                )}
                {goals.length > 0 && (
                  <div>🎯 Active Goals: {goals.length} goals in progress</div>
                )}
                <div>😊 Current Mood: {['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'][currentMood] || 'Neutral'}</div>
                {habits.length > 0 && (
                  <div>🔥 Longest Streak: {Math.max(...habits.map(h => h.streak || 0))} days</div>
                )}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800'
                }`}>
                  {message.sender === 'coach' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          <BookOpen className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-slate-600">AI Companion</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-blue-600" />
              Explore These Topics:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs h-8 text-left justify-start hover:bg-blue-50 hover:border-blue-200"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything - from science to philosophy, productivity to creativity..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
