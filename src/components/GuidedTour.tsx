import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Target, 
  Trophy, 
  MessageCircle, 
  Star,
  Rocket,
  Lightbulb,
  Calendar,
  Trash2
} from 'lucide-react';

interface GuidedTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Habit Card Buttons! 👋',
    description: 'Let me show you what each button in your habit cards does. These buttons help you manage your habits effectively.',
    icon: <Rocket className="w-8 h-8 text-white" />,
    color: 'from-blue-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-500'
  },
  {
    id: 'suggestion-button',
    title: '💡 Suggestion Button',
    description: 'The yellow lightbulb button shows AI suggestions for improving this habit. Click it to get personalized tips!',
    icon: <Lightbulb className="w-8 h-8 text-white" />,
    color: 'from-yellow-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500'
  },
  {
    id: 'schedule-button',
    title: '📅 Schedule Button',
    description: 'The green "SCHEDULE" button lets you set specific times and reminders for this habit. Plan when to do it!',
    icon: <Calendar className="w-8 h-8 text-white" />,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
  },
  {
    id: 'goal-button',
    title: '🎯 Generate Goal Button',
    description: 'The blue/purple target button creates long-term goals based on this habit. Turn habits into achievements!',
    icon: <Target className="w-8 h-8 text-white" />,
    color: 'from-blue-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-500'
  },
  {
    id: 'calendar-button',
    title: '📊 AI Calendar Button',
    description: 'The blue calendar button opens an AI-coordinated calendar view. See how this habit fits with your schedule!',
    icon: <Calendar className="w-8 h-8 text-white" />,
    color: 'from-indigo-500 to-blue-500',
    gradient: 'bg-gradient-to-br from-indigo-500 to-blue-500'
  },
  {
    id: 'delete-button',
    title: '🗑️ Delete Button',
    description: 'The red trash button removes this habit from your tracker. Use it when you want to stop tracking a habit.',
    icon: <Trash2 className="w-8 h-8 text-white" />,
    color: 'from-red-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-red-500 to-rose-500'
  },
  {
    id: 'complete',
    title: 'You\'re Ready! 🎉',
    description: 'Now you know what each button does! Use them to get the most out of your habit tracking experience.',
    icon: <Star className="w-8 h-8 text-white" />,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
  }
];

export const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  useEffect(() => {
    // Show tour after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleSkip();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isAnimating]);

  const handleNext = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handlePrevious = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Light Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
          onClick={handleSkip}
        />

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4
          }}
          className="relative z-50 w-full max-w-sm mx-auto"
        >
          <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className={`${currentTourStep.gradient} p-6 text-center`}>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  {currentTourStep.icon}
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-white mb-2">
                {currentTourStep.title}
              </CardTitle>
              <div className="flex justify-center items-center gap-2 text-white/80 text-sm">
                <span>Step {currentStep + 1} of {tourSteps.length}</span>
                <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <p className="text-gray-700 mb-6 text-center leading-relaxed">
                {currentTourStep.description}
              </p>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isAnimating}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isAnimating}
                    className={`${currentTourStep.gradient} hover:shadow-lg text-white font-semibold`}
                  >
                    {currentStep === tourSteps.length - 1 ? (
                      <>
                        Get Started <Rocket className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skip Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            Press ESC to skip
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuidedTour; 