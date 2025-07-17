import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain } from 'lucide-react';

interface MoodTrackerProps {
  mood: number;
  onMoodChange: (mood: number) => void;
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Good', 'Great'];
const moodColors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-blue-200', 'bg-green-200'];
const ringColors = ['ring-red-300', 'ring-orange-300', 'ring-yellow-300', 'ring-blue-300', 'ring-green-300'];

export const MoodTracker = ({ mood, onMoodChange }: MoodTrackerProps) => {
  return (
    <Card className="bg-gradient-to-r from-green-50 via-green-50 to-green-50 border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-green-900">How are you feeling tod</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2 mb-6">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onMoodChange(index)}
              className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 ${
                mood === index
                  ? `${moodColors[index]} scale-110 shadow-lg ring-2 ${ringColors[index]}`
                  : 'hover:bg-white/50 hover:scale-105'
              }`}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-xs text-gray-700 font-medium">
                {moodLabels[index]}
              </span>
            </button>
          ))}
        </div>
        
        {mood !== undefined && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">AI Mood Insight</p>
                <p className="text-sm text-gray-700">
                  Based on your {moodLabels[mood].toLowerCase()} mood, 
                  I recommend focusing on {mood < 2 ? 'gentle self-care habits like meditation and journaling' : 'energy-boosting activities like exercise and social connections'} today.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
