import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import { TestAdaptiveEngine } from "./components/ai/TestAdaptiveEngine";
import { ProfilePage } from "./pages/ProfilePage";
import { UserProvider } from "./contexts/UserContext";
import { AdminPanel } from "./pages/AdminPanel";
import { LoginForm } from "./components/auth/LoginForm";
import { useUser } from "./contexts/UserContext";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Login Page Component
const LoginPage = () => {
  const { setCurrentUser, currentUser } = useUser();
  
  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  const handleLogin = (user: { name: string; email: string; id?: number }, isSignUp: boolean) => {
    console.log('Login page received user data:', user);
    console.log('Is signup:', isSignUp);
    
    if (isSignUp) {
      // New user - go directly to onboarding
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
    }
  };

  return <LoginForm onLogin={handleLogin} />;
};

// Logout Page Component
const LogoutPage = () => {
  const { setCurrentUser } = useUser();
  
  // Clear user data and redirect to login
  setCurrentUser(null);
  localStorage.removeItem('authToken');
  
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/" element={<ProtectedRoute><Index userMood={null} /></ProtectedRoute>} />
                <Route path="/test-adaptive" element={<ProtectedRoute><TestAdaptiveEngine /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminPanel />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
