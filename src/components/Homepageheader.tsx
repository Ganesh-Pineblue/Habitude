import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { MoodHeader } from './MoodHeader';
import NotificationsBar from './NotificationsBar';
import { UserProfileDropdown } from './UserProfileDropdown';
import { ChangePassword } from './ChangePassword';
import { useNavigate } from 'react-router-dom';

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
  onUserUpdate?: (updatedUser: User) => void;
}

export const Header = ({ user, onLogout, currentMood = 2, onMoodSelect, onUserUpdate }: HeaderProps) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const handleMoodSelect = (mood: string) => {
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
  };

  const handleChangePasswordClose = () => {
    setShowChangePassword(false);
  };

  const handlePasswordChange = (currentPassword: string, newPassword: string) => {
    // Here you would typically make an API call to change the password
    console.log('Changing password:', { currentPassword, newPassword });
    // For now, we'll just close the modal
    setShowChangePassword(false);
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
            {/* User Profile Dropdown */}
            <UserProfileDropdown
              user={user}
              onLogout={onLogout}
              onProfileClick={handleProfileClick}
              onChangePasswordClick={handleChangePasswordClick}
            />
            
            {/* Notifications Bar */}
            <div className="relative">
              <NotificationsBar />
            </div>
          </div>
        </div>

        {/* Mobile Mood Header */}
        <div className="md:hidden mt-3 flex justify-center">
          <MoodHeader currentMood={currentMood} onMoodSelect={handleMoodSelect} />
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword
          onClose={handleChangePasswordClose}
          onSave={handlePasswordChange}
        />
      )}
    </header>
  );
};
