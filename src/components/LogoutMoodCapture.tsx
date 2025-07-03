import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface LogoutMoodCaptureProps {
  onMoodSelect: (mood: string) => void;
  onClose: () => void;
  onSkip: () => void;
  isOpen: boolean;
}

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😎', label: 'Excited' },
];

const moodReasons = {
  Happy: [
    'Completed my habits',
    'Achieved my goals',
    'Had a productive session',
    'Feeling accomplished',
    'Made progress',
    'Other',
  ],
  Calm: [
    'Peaceful session',
    'Good meditation',
    'Relaxing activities',
    'Mindful practice',
    'Inner peace',
    'Other',
  ],
  Sad: [
    'Didn\'t complete habits',
    'Missed goals',
    'Feeling unmotivated',
    'Personal issues',
    'Stress',
    'Other',
  ],
  Angry: [
    'Frustrated with progress',
    'Technical issues',
    'Personal conflicts',
    'Work stress',
    'General frustration',
    'Other',
  ],
  Tired: [
    'Long session',
    'Mental exhaustion',
    'Physical tiredness',
    'Overwhelmed',
    'Need rest',
    'Other',
  ],
  Excited: [
    'Great progress',
    'New achievements',
    'Motivated for more',
    'Positive energy',
    'Looking forward',
    'Other',
  ],
};

const LogoutMoodCapture: React.FC<LogoutMoodCaptureProps> = ({ 
  onMoodSelect, 
  onClose, 
  onSkip, 
  isOpen 
}) => {
  const [step, setStep] = useState(1); // 1: mood, 2: reason, 3: suggestions
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState<string>('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    setSelectedReason(null);
    setCustomReason('');
    setIsOtherSelected(false);
    setStep(2);
  };

  const handleReasonClick = (reason: string) => {
    if (reason === 'Other') {
      setIsOtherSelected(true);
      setSelectedReason('Other');
    } else {
      setSelectedReason(reason);
      setStep(3);
    }
  };

  const handleCustomReasonSubmit = () => {
    if (customReason.trim()) {
      setSelectedReason(customReason.trim());
      setStep(3);
    }
  };

  const handleMoodComplete = (mood: string, reason: string) => {
    onMoodSelect(`${mood} - ${reason}`);
    handleClose();
  };

  const handlePrevious = () => {
    if (step === 2) {
      setSelectedMood(null);
      setStep(1);
    } else if (step === 3) {
      if (isOtherSelected) {
        setIsOtherSelected(false);
        setCustomReason('');
        setSelectedReason(null);
      } else {
        setSelectedReason(null);
      }
      setStep(2);
    }
  };

  const handleClose = () => {
    // Reset state
    setStep(1);
    setSelectedMood(null);
    setSelectedReason(null);
    setCustomReason('');
    setIsOtherSelected(false);
    onClose();
  };

  const handleSkip = () => {
    handleClose();
    onSkip();
  };

  // Mood-based suggestions and messages
  const getMoodMessage = (mood: string) => {
    const moodMessages = {
      'Sad': {
        emoji: '🤗',
        title: 'It\'s okay to feel this way',
        message: 'Remember, every session is progress, no matter how small. Tomorrow is a new opportunity to try again. You\'re doing great!',
        suggestions: ['Take a break and rest', 'Be kind to yourself', 'Plan for tomorrow', 'Talk to someone', 'Do something you enjoy']
      },
      'Angry': {
        emoji: '😌',
        title: 'Take a moment to breathe',
        message: 'It\'s natural to feel frustrated. Remember that progress isn\'t always linear. You\'ve got this!',
        suggestions: ['Take deep breaths', 'Step away for a while', 'Write down your feelings', 'Listen to calming music', 'Plan your next session']
      },
      'Tired': {
        emoji: '💪',
        title: 'You\'ve worked hard',
        message: 'Rest is just as important as work. You\'ve made progress today, and that\'s something to be proud of.',
        suggestions: ['Get some rest', 'Hydrate yourself', 'Take a short walk', 'Plan for tomorrow', 'Celebrate small wins']
      },
      'Happy': {
        emoji: '🌟',
        title: 'Amazing work!',
        message: 'Your positive energy is incredible! Keep this momentum going and remember this feeling for future sessions.',
        suggestions: ['Document your achievements', 'Share your success', 'Plan your next goals', 'Celebrate your progress', 'Help someone else']
      },
      'Excited': {
        emoji: '🚀',
        title: 'Incredible energy!',
        message: 'Your excitement is contagious! Channel this energy into planning your next session and setting new goals.',
        suggestions: ['Set new goals', 'Plan your next session', 'Share your enthusiasm', 'Document your motivation', 'Help others get motivated']
      },
      'Calm': {
        emoji: '🧘',
        title: 'Perfect balance',
        message: 'You\'re in a wonderful state of mind. This calm energy will help you maintain consistency in your habits.',
        suggestions: ['Reflect on your session', 'Plan for tomorrow', 'Practice gratitude', 'Maintain this energy', 'Share your peace']
      }
    };
    return moodMessages[mood as keyof typeof moodMessages] || moodMessages['Happy'];
  };

  // Stepper UI
  const Stepper = () => (
    <div className="flex items-center justify-center mb-4">
      {['Select Mood', 'Select Reason', 'Suggestions'].map((label, idx) => (
        <React.Fragment key={label}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
            ${step === idx + 1 ? 'bg-green-500 border-green-500 text-white scale-110 shadow-lg' : 'bg-white border-green-200 text-green-500'}
          `}>
            <span className="font-bold">{idx + 1}</span>
          </div>
          {idx < 2 && (
            <div className={`w-8 h-1 mx-1 rounded-full transition-all duration-300
              ${step > idx + 1 ? 'bg-green-500' : 'bg-green-100'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 bg-transparent border-0 shadow-none">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-br from-green-50 via-white to-green-50 rounded-3xl p-6 shadow-2xl border border-green-100"
            style={{ boxShadow: '0 20px 60px 0 rgba(16,185,129,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <LogOut className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-900">Session Complete!</h1>
                  <p className="text-sm text-green-700">How are you feeling after using the app?</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Stepper />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-extrabold text-center mb-6 text-green-900 drop-shadow-sm">
                    How do you feel after your session?
                  </h2>
                  <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-md">
                    <div className="grid grid-cols-3 gap-4">
                      {moods.map((mood) => (
                        <motion.button
                          key={mood.label}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoodClick(mood.label)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all
                            ${selectedMood === mood.label ? 'bg-green-100 border-2 border-green-500 scale-105' : 'hover:bg-green-50 border border-transparent'}
                          `}
                        >
                          <span className="text-3xl mb-2 drop-shadow-lg">{mood.emoji}</span>
                          <span className="text-sm font-medium text-gray-700">{mood.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                    >
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && selectedMood && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-extrabold text-center mb-6 text-green-900 drop-shadow-sm">
                    What made you feel <span className="capitalize">{selectedMood.toLowerCase()}</span>?
                  </h2>
                  
                  {!isOtherSelected ? (
                    <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-md">
                      <div className="grid grid-cols-2 gap-3">
                        {moodReasons[selectedMood as keyof typeof moodReasons]?.map((reason) => (
                          <motion.button
                            key={reason}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleReasonClick(reason)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all
                              ${selectedReason === reason ? 'bg-green-100 border-2 border-green-500' : 'hover:bg-green-50 border border-transparent'}
                            `}
                          >
                            {reason}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-md">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                          placeholder="Enter your reason..."
                          className="flex-1 px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                          onKeyPress={(e) => e.key === 'Enter' && handleCustomReasonSubmit()}
                        />
                        <Button
                          onClick={handleCustomReasonSubmit}
                          disabled={!customReason.trim()}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                    >
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && selectedMood && selectedReason && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <span className="text-5xl mb-4 block drop-shadow-lg">
                      {getMoodMessage(selectedMood).emoji}
                    </span>
                    <h2 className="text-2xl font-extrabold text-green-900 drop-shadow-sm mb-3">
                      {getMoodMessage(selectedMood).title}
                    </h2>
                    <p className="text-base text-gray-700">
                      {getMoodMessage(selectedMood).message}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                    >
                      ← Previous
                    </Button>
                    <Button
                      onClick={() => {
                        handleMoodComplete(selectedMood, selectedReason);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Done
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutMoodCapture;
