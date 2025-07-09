import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MessageCircle, Brain, Bot } from 'lucide-react';
import { AICoach } from '../ai/AICoach';
import { AIInsights } from '../ai/AIInsights';

interface FloatingBotProps {
  personalityProfile?: any;
  habits?: any[];
  goals?: any[];
  currentMood?: number;
  userName?: string;
}

export const FloatingBot = ({ 
  personalityProfile, 
  habits = [], 
  goals = [], 
  currentMood = 2, 
  userName = '' 
}: FloatingBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'coach' | 'insights'>('coach');

  return (
    <>
      {/* Floating Bot Button - Large size */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 rounded-full bg-green-400 hover:bg-green-500 shadow-2xl border-4 border-green-300 p-0 overflow-hidden"
          style={{ animation: 'pulse 3s ease-in-out infinite' }}
        >
          <Bot className="w-10 h-10 text-white" />
        </Button>
      </div>

      {/* AI Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <Bot className="w-8 h-8 text-green-600" />
                  <span>AI Assistant</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-2 mt-4">
                <Button
                  variant={activeTab === 'coach' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('coach')}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>AI Coach</span>
                </Button>
                <Button
                  variant={activeTab === 'insights' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('insights')}
                  className="flex items-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Insights</span>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="max-h-[60vh] overflow-y-auto">
              {activeTab === 'coach' ? (
                <AICoach 
                  personalityProfile={personalityProfile}
                  habits={habits}
                  goals={goals}
                  currentMood={currentMood}
                  userName={userName}
                />
              ) : (
                <AIInsights 
                  habits={habits}
                  goals={goals}
                  currentMood={currentMood}
                  userName={userName}
                  personalityProfile={personalityProfile}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
