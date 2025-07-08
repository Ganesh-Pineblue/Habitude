import React, { useState } from 'react';
import { HabitDashboard } from '@/components/HabitDashboard';
import { GoalDashboard } from '@/components/GoalDashboard';
import { AICoach } from '@/components/AICoach';
import { LoginForm } from '@/components/LoginForm';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Header } from '@/components/Homepageheader';
import { ModernDashboard } from '@/components/ModernDashboard';
import { FloatingBot } from '@/components/FloatingBot';
import { MoodReport } from '@/components/MoodReport';
import { AIGoalsPopup } from '@/components/AIGoalsPopup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodSelector from '@/components/MoodSelector';
import MoodSelectorPopup from '@/components/MoodSelectorPopup';
import LogoutMoodCapture from '@/components/LogoutMoodCapture';
import GuidedTour from '@/components/GuidedTour';
import { Bot } from 'lucide-react';
import { moodStorage } from '@/lib/moodStorage';
import { useUser } from '@/contexts/UserContext';

interface User {
  name: string;
  email: string;
  streak?: number;
  personalityProfile?: any;
  onboardingComplete?: boolean;
  isNewUser?: boolean;
  hasSeenTour?: boolean;
}

interface IndexProps {
  userMood: string | null;
}

const moodToNumber = (mood: string | null): number => {
  if (!mood) return 2; // Default to neutral (middle value)
  const moodMap: { [key: string]: number } = {
    'Happy': 4,
    'Excited': 4,
    'Calm': 3,
    'Neutral': 2,
    'Tired': 1,
    'Sad': 0,
    'Angry': 0
  };
  return moodMap[mood] ?? 2;
};

const Index: React.FC<IndexProps> = ({ userMood }) => {
  const { currentUser, setCurrentUser } = useUser();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [habitsTabValue, setHabitsTabValue] = useState('habits');
  const [reportsTabValue, setReportsTabValue] = useState<'mood' | 'habits' | 'correlation' | 'insights'>('mood');
  const [currentMood, setCurrentMood] = useState<number>(moodToNumber(userMood));
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [showLogoutMoodCapture, setShowLogoutMoodCapture] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [showAIGoalsPopup, setShowAIGoalsPopup] = useState(false);
  const [aiGeneratedGoals, setAiGeneratedGoals] = useState<any[]>([]);
  const [userHabits, setUserHabits] = useState<any[]>([]);
  const [userGoals, setUserGoals] = useState<any[]>([]);
  const [triggerGoalAddForm, setTriggerGoalAddForm] = useState(false);
  const [triggerGoalEditId, setTriggerGoalEditId] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Mock habit data for gamification (fallback)
  const mockHabits = [
    { 
      id: '1', 
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness to start the day',
      completedToday: true, 
      streak: 12, 
      category: 'mindfulness' as const,
      weeklyTarget: 7,
      currentWeekCompleted: 5,
      bestStreak: 15,
      completionRate: 92
    },
    { 
      id: '2', 
      title: 'Drink Water',
      description: '8 glasses throughout the day for optimal hydration',
      completedToday: false, 
      streak: 5, 
      category: 'health' as const,
      weeklyTarget: 7,
      currentWeekCompleted: 4,
      bestStreak: 21,
      completionRate: 78
    },
    { 
      id: '3', 
      title: 'Evening Journal',
      description: 'Reflect on the day and plan tomorrow',
      completedToday: true, 
      streak: 8, 
      category: 'mindfulness' as const,
      weeklyTarget: 5,
      currentWeekCompleted: 3,
      bestStreak: 12,
      completionRate: 85
    },
    { 
      id: '4', 
      title: 'Exercise',
      description: '30 minutes of physical activity',
      completedToday: true, 
      streak: 3, 
      category: 'health' as const,
      weeklyTarget: 5,
      currentWeekCompleted: 3,
      bestStreak: 14,
      completionRate: 80
    }
  ];

  // Mock goals data
  const mockGoals = [
    { id: '1', title: 'Lose 10 lbs', target: 10, current: 6.5 },
    { id: '2', title: 'Read 24 Books', target: 24, current: 12 },
    { id: '3', title: 'Meditate 100 Days', target: 100, current: 75 }
  ];

  const handleLogin = (user: User, isSignUp: boolean) => {
    if (isSignUp) {
      // New user - go directly to onboarding (removed Welcome Back screen)
      setCurrentUser({ 
        ...user, 
        streak: 0, 
        onboardingComplete: false, 
        isNewUser: true 
      });
    } else {
      // Existing user - go directly to dashboard
      setCurrentUser({ 
        ...user, 
        onboardingComplete: true, 
        personalityProfile: {
          personalInfo: { firstName: user.name, generation: 'millennial' },
          personalitySelection: { selectedPersonality: 'Steve Jobs', selectedHabits: ['Daily meditation', 'Exercise'] }
        },
        isNewUser: false 
      });
      // Show mood popup for existing users after login
      setShowMoodPopup(true);
    }
  };

  const handleMoodSelect = (mood: string) => {
    const moodNumber = moodToNumber(mood);
    setCurrentMood(moodNumber);
    setShowMoodPopup(false);
    
    // Save mood entry to storage
    const [moodLabel, reason] = mood.split(' - ');
    moodStorage.saveMoodEntry(moodLabel, reason || 'No reason provided', 'login');
  };

  const handleMoodPopupClose = () => {
    setShowMoodPopup(false);
  };

  const handleLogoutMoodSelect = (mood: string) => {
    const moodNumber = moodToNumber(mood);
    setCurrentMood(moodNumber);
    setShowLogoutMoodCapture(false);
    
    // Save mood entry to storage
    const [moodLabel, reason] = mood.split(' - ');
    moodStorage.saveMoodEntry(moodLabel, reason || 'No reason provided', 'logout');
    
    // Perform actual logout
    performLogout();
  };

  const handleLogoutMoodSkip = () => {
    setShowLogoutMoodCapture(false);
    // Perform actual logout without mood capture
    performLogout();
  };

  const performLogout = () => {
    setCurrentUser(null);
    setUserHabits([]);
    setUserGoals([]);
    setCurrentMood(2); // Reset to neutral
  };

  const goToRegistration = () => {
    // Clear user data and set a flag to show registration form
    setCurrentUser(null);
    setUserHabits([]);
    setUserGoals([]);
    setCurrentMood(2); // Reset to neutral
    setShowRegistrationForm(true);
  };

  const handleLogout = () => {
    // Show logout mood capture instead of immediately logging out
    setShowLogoutMoodCapture(true);
  };

  const handleOnboardingComplete = (personalityProfile: any) => {
    if (currentUser) {
      // Set the generated habits and goals from onboarding
      if (personalityProfile.generatedHabits) {
        setUserHabits(personalityProfile.generatedHabits);
      }
      if (personalityProfile.generatedGoals) {
        setUserGoals(personalityProfile.generatedGoals);
        setAiGeneratedGoals(personalityProfile.generatedGoals);
        
        // Show AI goals popup if goals were generated
        if (personalityProfile.generatedGoals.length > 0) {
          setShowAIGoalsPopup(true);
        } else {
          // If no goals were generated, proceed directly to guided tour
          if (currentUser.isNewUser) {
            setTimeout(() => {
              setShowGuidedTour(true);
            }, 1000);
          }
        }
      }
      setCurrentUser({
        ...currentUser,
        personalityProfile,
        onboardingComplete: true
      });
      setCurrentTab('habits'); // Redirect to Habits tab after onboarding
    }
  };

  const handleNavigateToAnalytics = () => {
    setCurrentTab('mood-reports');
  };

  const handleNavigateToInsights = () => {
    setCurrentTab('mood-reports');
    setReportsTabValue('insights' as const);
  };

  // Handler for goal generation from habits
  const handleGoalGenerated = (generatedGoal: any) => {
    setUserGoals(prevGoals => [...prevGoals, generatedGoal]);
  };

  // Guided tour handlers
  const handleTourComplete = () => {
    setShowGuidedTour(false);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        hasSeenTour: true
      });
    }
  };

  const handleTourSkip = () => {
    setShowGuidedTour(false);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        hasSeenTour: true
      });
    }
  };

  // AI Goals Popup handlers
  const handleAIGoalsPopupClose = () => {
    setShowAIGoalsPopup(false);
    // Show guided tour after popup is closed
    if (currentUser?.isNewUser) {
      setTimeout(() => {
        setShowGuidedTour(true);
      }, 500);
    }
  };

  const handleAIGoalsPopupContinue = () => {
    setShowAIGoalsPopup(false);
    // Show guided tour after continuing
    if (currentUser?.isNewUser) {
      setTimeout(() => {
        setShowGuidedTour(true);
      }, 500);
    }
  };

  const handleEditAIGoal = (goalId: string) => {
    // Navigate to goals tab and trigger edit
    setCurrentTab('goals');
    setShowAIGoalsPopup(false);
    setTriggerGoalEditId(goalId);
  };

  const handleAddAIGoal = () => {
    // Navigate to goals tab and trigger add form
    setCurrentTab('goals');
    setShowAIGoalsPopup(false);
    setTriggerGoalAddForm(true);
  };

  const handleDeleteAIGoal = (goalId: string) => {
    // Remove the goal from both arrays
    setUserGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    setAiGeneratedGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Here you would typically make an API call to update the user
    console.log('User updated:', updatedUser);
  };

  const handleGoalAddFormTriggered = () => {
    setTriggerGoalAddForm(false);
  };

  const handleGoalEditFormTriggered = () => {
    setTriggerGoalEditId(null);
  };

  // Use generated habits if available, otherwise use mock habits
  const displayHabits = userHabits.length > 0 ? userHabits : mockHabits;
  
  // Use generated goals if available, otherwise use mock goals
  const displayGoals = userGoals.length > 0 ? userGoals : mockGoals;

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} showRegistrationByDefault={showRegistrationForm} />;
  }

  if (!currentUser.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} onBack={goToRegistration} user={currentUser} />;
  }

  const totalStreak = Math.max(...displayHabits.map(h => h.streak));
  // const userPoints = totalStreak * 10 + completedToday * 5;

  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={currentUser} 
        onLogout={handleLogout}
        currentMood={currentMood}
        onMoodSelect={handleMoodSelect}
        onUserUpdate={handleUserUpdate}
      />
      <main className="container mx-auto px-2 py-2 max-w-sm sm:max-w-md lg:max-w-6xl">
        <div className="w-full">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-3 bg-gray-200 backdrop-blur-sm rounded-2xl p-1 border border-gray-400 text-sm sm:text-base min-h-[44px]">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg px-2 py-1.5 w-full h-full rounded-xl hover:bg-gray-200/50 transition-all duration-200 flex items-center justify-center">
                🏠
                <span className="hidden sm:inline ml-1">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="habits" 
                data-tour="habits-tab"
                className="text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg px-2 py-1.5 w-full h-full rounded-xl hover:bg-gray-200/50 transition-all duration-200 flex items-center justify-center"
              >
                ✅
                <span className="hidden sm:inline ml-1">Habits</span>
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                data-tour="goals-tab"
                className="text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg px-2 py-1.5 w-full h-full rounded-xl hover:bg-gray-200/50 transition-all duration-200 flex items-center justify-center"
              >
                🎯
                <span className="hidden sm:inline ml-1">Goals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-coach" 
                data-tour="ai-coach"
                className="text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg px-2 py-1.5 w-full h-full rounded-xl hover:bg-gray-200/50 transition-all duration-200 flex items-center justify-center"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">AI Coach</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-mood" 
                data-tour="mood-tracker"
                className="text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg px-2 py-1.5 w-full h-full rounded-xl hover:bg-gray-200/50 transition-all duration-200 flex items-center justify-center"
              >
                😊
                <span className="hidden sm:inline ml-1">My Mood</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mood-reports" 
                data-tour="analytics"
                className="text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg px-2 py-1.5 w-full h-full rounded-xl hover:bg-gray-200/50 transition-all duration-200 flex items-center justify-center"
              >
                📊
                <span className="hidden sm:inline ml-1">Reports</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <ModernDashboard 
                habits={displayHabits} 
                goals={displayGoals}
                currentMood={currentMood} 
                totalStreak={totalStreak}
                personalityProfile={currentUser.personalityProfile}
                onNavigateToCalendar={() => {}}
                onNavigateToAnalytics={handleNavigateToAnalytics}
                onNavigateToInsights={handleNavigateToInsights}
              />
            </TabsContent>

            <TabsContent value="habits">
              <div data-tour="habit-cards">
                <HabitDashboard 
                  tabValue={habitsTabValue}
                  onTabChange={setHabitsTabValue}
                  initialHabits={displayHabits}
                  onHabitsUpdate={setUserHabits}
                  onGoalGenerated={handleGoalGenerated}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="goals">
              <GoalDashboard 
                initialGoals={displayGoals}
                onGoalsUpdate={setUserGoals}
                triggerAddForm={triggerGoalAddForm}
                triggerEditGoalId={triggerGoalEditId}
                onAddFormTriggered={handleGoalAddFormTriggered}
                onEditFormTriggered={handleGoalEditFormTriggered}
              />
            </TabsContent>

            <TabsContent value="ai-coach">
              <div data-tour="ai-coach">
                <AICoach 
                  personalityProfile={currentUser.personalityProfile}
                  habits={displayHabits}
                  goals={displayGoals}
                  currentMood={currentMood}
                  userName={currentUser.name}
                />
              </div>
            </TabsContent>

            <TabsContent value="my-mood">
              <div className="flex justify-center items-center min-h-[400px]">
                <MoodSelector onMoodSelect={handleMoodSelect} />
              </div>
            </TabsContent>

            <TabsContent value="mood-reports">
              <MoodReport habits={displayHabits} defaultTab={reportsTabValue} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Floating Bot */}
      <div data-tour="floating-bot">
        <FloatingBot 
          personalityProfile={currentUser.personalityProfile}
          habits={displayHabits}
          goals={displayGoals}
          currentMood={currentMood}
          userName={currentUser.name}
        />
      </div>

      {/* Mood Selector Popup */}
      <MoodSelectorPopup
        isOpen={showMoodPopup}
        onMoodSelect={handleMoodSelect}
        onClose={handleMoodPopupClose}
      />

      {/* Logout Mood Capture */}
      <LogoutMoodCapture
        isOpen={showLogoutMoodCapture}
        onMoodSelect={handleLogoutMoodSelect}
        onClose={() => setShowLogoutMoodCapture(false)}
        onSkip={handleLogoutMoodSkip}
      />

      {/* AI Goals Popup */}
      <AIGoalsPopup
        isOpen={showAIGoalsPopup}
        onClose={handleAIGoalsPopupClose}
        goals={aiGeneratedGoals}
        onEditGoal={handleEditAIGoal}
        onAddGoal={handleAddAIGoal}
        onDeleteGoal={handleDeleteAIGoal}
        onContinue={handleAIGoalsPopupContinue}
      />

      {/* Guided Tour */}
      {showGuidedTour && (
        <GuidedTour
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}
    </div>
  );
};

export default Index;
