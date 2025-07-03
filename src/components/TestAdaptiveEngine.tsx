import React, { useState } from 'react';
import { AdaptiveHabitSuggestionEngine } from './AdaptiveHabitSuggestionEngine';

export const TestAdaptiveEngine: React.FC = () => {
  const [currentMood, setCurrentMood] = useState(4);
  const [currentTime, setCurrentTime] = useState(new Date());

  const mockHabits = [
    {
      id: '1',
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness',
      streak: 5,
      completedToday: true,
      category: 'mindfulness' as const,
      habitType: 'good' as const,
      weeklyTarget: 7,
      currentWeekCompleted: 5,
      bestStreak: 10,
      completionRate: 85,
      aiGenerated: true
    }
  ];

  const handleAddHabit = (habit: any) => {
    console.log('Adding habit:', habit);
    alert(`Adding habit: ${habit.title}`);
  };

  const handleCompleteHabit = (habitId: string) => {
    console.log('Completing habit:', habitId);
    alert(`Completing habit: ${habitId}`);
  };

  const updateTime = () => {
    setCurrentTime(new Date());
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">🧪 Test Adaptive Habit Suggestion Engine</h1>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Mood (1-5):</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={currentMood} 
              onChange={(e) => setCurrentMood(Number(e.target.value))}
              className="w-32"
            />
            <span className="ml-2 text-sm">{currentMood}/5</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Time:</label>
            <button 
              onClick={updateTime}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Update Time ({currentTime.toLocaleTimeString()})
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <p>• Current time: {currentTime.toLocaleTimeString()}</p>
          <p>• Current mood: {currentMood}/5</p>
          <p>• Habits count: {mockHabits.length}</p>
        </div>
      </div>

      <AdaptiveHabitSuggestionEngine
        habits={mockHabits}
        currentMood={currentMood}
        currentTime={currentTime}
        onAddHabit={handleAddHabit}
        onCompleteHabit={handleCompleteHabit}
        personalityProfile={{ favoritePersonality: 'Einstein' }}
      />
    </div>
  );
}; 