import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, BarChart3, X } from 'lucide-react';
import { MoodReport } from './MoodReport';

interface MoodHeaderProps {
  currentMood: number;
  onMoodSelect: (mood: string) => void;
}

const moodEmojis = [
  { emoji: '😢', label: 'Very Sad', value: 0 },
  { emoji: '😔', label: 'Sad', value: 1 },
  { emoji: '😐', label: 'Neutral', value: 2 },
  { emoji: '😊', label: 'Good', value: 3 },
  { emoji: '😄', label: 'Great', value: 4 },
];

export const MoodHeader = ({ currentMood, onMoodSelect }: MoodHeaderProps) => {
  return (
    <></>
  );
};
