import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MoodSelectorPopupProps {
  onMoodSelect: (mood: string) => void;
  onClose: () => void;
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
    'Achieved a goal',
    'Spent time with loved ones',
    'Had a good day at work',
    'Did something fun',
    'Received good news',
    'Other',
  ],
  Calm: [
    'Meditation',
    'Nature walk',
    'Good sleep',
    'Relaxing activity',
    'Peaceful environment',
    'Other',
  ],
  Sad: [
    'Missed someone',
    'Work stress',
    'Health issues',
    'Personal problems',
    'Weather',
    'Other',
  ],
  Angry: [
    'Work conflict',
    'Personal conflict',
    'Frustration',
    'Injustice',
    'Stress',
    'Other',
  ],
  Tired: [
    'Lack of sleep',
    'Busy day',
    'Physical activity',
    'Work pressure',
    'Stress',
    'Other',
  ],
  Excited: [
    'New opportunity',
    'Upcoming event',
    'Achievement',
    'Meeting friends',
    'New project',
    'Other',
  ],
};

const steps = [
  'Select Mood',
  'Select Reason',
  'Suggestions',
];

const MoodSelectorPopup: React.FC<MoodSelectorPopupProps> = ({ onMoodSelect, onClose, isOpen }) => {
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

  // Mood-based suggestions and messages
  const getMoodMessage = (mood: string) => {
    const moodMessages = {
      'Sad': {
        emoji: '🤗',
        title: 'It\'s okay to feel sad',
        message: 'Remember, this feeling is temporary. Try taking a walk, calling a friend, or doing something you enjoy. You\'re stronger than you think!',
        suggestions: ['Take a short walk outside', 'Listen to uplifting music', 'Call a friend or family member', 'Practice deep breathing', 'Write down your thoughts']
      },
      'Angry': {
        emoji: '😌',
        title: 'Take a moment to breathe',
        message: 'Anger is a natural emotion. Try to step back and give yourself space to process. You\'ve got this!',
        suggestions: ['Count to 10 slowly', 'Take deep breaths', 'Go for a quick walk', 'Write down what happened', 'Listen to calming music']
      },
      'Tired': {
        emoji: '💪',
        title: 'You\'re doing great',
        message: 'It\'s okay to feel tired. Remember to be kind to yourself and take breaks when needed.',
        suggestions: ['Take a short nap', 'Drink some water', 'Stretch your body', 'Step away from screens', 'Do something relaxing']
      },
      'Happy': {
        emoji: '🌟',
        title: 'Wonderful!',
        message: 'Your positive energy is contagious! Keep spreading joy and enjoy this beautiful moment.',
        suggestions: ['Share your happiness with others', 'Do something creative', 'Help someone else', 'Document this moment', 'Plan something fun']
      },
      'Excited': {
        emoji: '🚀',
        title: 'Amazing energy!',
        message: 'Your excitement is infectious! Channel this energy into something productive and fun.',
        suggestions: ['Start that project you\'ve been thinking about', 'Call a friend to share', 'Plan your next adventure', 'Try something new', 'Document your goals']
      },
      'Calm': {
        emoji: '🧘',
        title: 'Perfect balance',
        message: 'You\'re in a great state of mind. This is the perfect time to be productive or simply enjoy the moment.',
        suggestions: ['Meditate for a few minutes', 'Read a book', 'Practice gratitude', 'Plan your day', 'Enjoy the present moment']
      }
    };
    return moodMessages[mood as keyof typeof moodMessages] || moodMessages['Happy'];
  };

  // Stepper UI
  const Stepper = () => (
    <div className="flex items-center justify-center mb-4">
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
            ${step === idx + 1 ? 'bg-green-500 border-green-500 text-white scale-110 shadow-lg' : 'bg-white border-green-200 text-green-500'}
          `}>
            <span className="font-bold">{idx + 1}</span>
          </div>
          {idx < steps.length - 1 && (
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
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="backdrop-blur-xl bg-white/90 border border-green-100 shadow-2xl rounded-3xl px-8 py-6 w-full relative"
            style={{ boxShadow: '0 8px 32px 0 rgba(16,185,129,0.15)' }}
          >
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
                    How are you feeling today?
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
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={handleClose}
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
                    What makes you feel <span className="capitalize">{selectedMood.toLowerCase()}</span> today?
                  </h2>
                  {!isOtherSelected ? (
                    <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-md">
                      <div className="grid grid-cols-2 gap-3">
                        {moodReasons[selectedMood as keyof typeof moodReasons].map((reason) => (
                          <motion.button
                            key={reason}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleReasonClick(reason)}
                            className={`flex items-center justify-center p-3 rounded-xl transition-all text-sm
                              ${selectedReason === reason ? 'bg-green-100 border-2 border-green-500 scale-105' : 'hover:bg-green-50 border border-transparent'}
                            `}
                          >
                            <span className="text-gray-700">{reason}</span>
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
                      onClick={handleClose}
                      className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                    >
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && selectedReason && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <span className="text-5xl mb-4 block drop-shadow-lg">
                      {getMoodMessage(selectedMood!).emoji}
                    </span>
                    <h2 className="text-2xl font-extrabold text-green-900 drop-shadow-sm mb-3">
                      {getMoodMessage(selectedMood!).title}
                    </h2>
                    <p className="text-base text-gray-700">
                      {getMoodMessage(selectedMood!).message}
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
                        handleMoodComplete(selectedMood!, selectedReason);
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

export default MoodSelectorPopup; 