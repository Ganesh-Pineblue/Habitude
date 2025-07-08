import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  onClose?: () => void; // Optional close handler
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

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, onClose }) => {
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
    if (onClose) onClose();
    setStep(1);
    setSelectedMood(null);
    setSelectedReason(null);
    setCustomReason('');
    setIsOtherSelected(false);
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
  // const Stepper = () => (
  //   <div className="flex items-center justify-center mb-4">
  //     {steps.map((label, idx) => (
  //       <React.Fragment key={label}>
  //         <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
  //           ${step === idx + 1 ? 'bg-green-500 border-green-500 text-white scale-110 shadow-lg' : 'bg-white border-green-200 text-green-500'}
  //         `}>
  //           <span className="font-bold">{idx + 1}</span>
  //         </div>
  //         {idx < steps.length - 1 && (
  //           <div className={`w-8 h-1 mx-1 rounded-full transition-all duration-300
  //             ${step > idx + 1 ? 'bg-green-500' : 'bg-green-100'}`}
  //           />
  //         )}
  //       </React.Fragment>
  //     ))}
  //   </div>
  // );

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 p-1">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 border border-green-100 shadow-2xl rounded-3xl px-16 py-4 w-full relative"
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
                <div className="flex justify-between items-center gap-4">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.label}
                      whileHover={{ scale: 1.13 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleMoodClick(mood.label)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all flex-1
                        ${selectedMood === mood.label ? 'bg-green-100 border-2 border-green-500 scale-105' : 'hover:bg-green-50 border border-transparent'}
                      `}
                    >
                      <span className="text-4xl mb-1 drop-shadow-lg">{mood.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{mood.label}</span>
                    </motion.button>
                  ))}
                </div>
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
                  <div className="flex justify-between items-center gap-4">
                    {moodReasons[selectedMood as keyof typeof moodReasons].map((reason) => (
                      <motion.button
                        key={reason}
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleReasonClick(reason)}
                        className={`flex items-center justify-center p-3 rounded-xl transition-all flex-1
                          ${selectedReason === reason ? 'bg-green-100 border-2 border-green-500 scale-105' : 'hover:bg-green-50 border border-transparent'}
                        `}
                      >
                        <span className="text-sm text-gray-700">{reason}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 border border-green-100 rounded-2xl p-6 shadow-md">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Enter your reason..."
                        className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                        onKeyPress={(e) => e.key === 'Enter' && handleCustomReasonSubmit()}
                      />
                    </div>
                    <button
                      onClick={handleCustomReasonSubmit}
                      disabled={!customReason.trim()}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  className="text-green-600 hover:text-green-700 text-base font-medium px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition"
                >
                  ← Previous
                </button>
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
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block drop-shadow-lg">
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
                <button
                  onClick={handlePrevious}
                  className="text-green-600 hover:text-green-700 text-base font-medium px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    handleMoodComplete(selectedMood!, selectedReason);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MoodSelector; 