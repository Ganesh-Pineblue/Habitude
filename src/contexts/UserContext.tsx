import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  generation?: string;
  gender?: string;
  customGender?: string;
  roleModel?: string;
  roleModelHabits?: string;
  streak?: number;
  personalityProfile?: any;
  onboardingComplete?: boolean;
  isNewUser?: boolean;
  hasSeenTour?: boolean;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}; 