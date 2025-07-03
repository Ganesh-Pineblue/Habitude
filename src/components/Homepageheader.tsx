import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { MoodHeader } from './MoodHeader';
import NotificationsBar from './NotificationsBar';

interface User {
  name: string;
  email: string;
  streak?: number;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentMood?: number;
  onMoodSelect?: (mood: string) => void;
}

export const Header = ({ user, onLogout, currentMood = 2, onMoodSelect }: HeaderProps) => {
  const handleMoodSelect = (mood: string) => {
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center border-2 border-green-500">
              <span className="text-sm sm:text-lg font-bold text-white">M</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Habitude</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Your AI-powered growth companion</p>
            </div>
          </div>

          {/* Center - Mood Header */}
          <div className="hidden md:flex">
            <MoodHeader currentMood={currentMood} onMoodSelect={handleMoodSelect} />
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>
            
            {/* Notifications Bar */}
            <div className="relative">
              <NotificationsBar />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-2 sm:px-4"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Mood Header */}
        <div className="md:hidden mt-3 flex justify-center">
          <MoodHeader currentMood={currentMood} onMoodSelect={handleMoodSelect} />
        </div>
      </div>
    </header>
  );
};
