type MoodHeaderProps = { currentMood: number };

export const MoodHeader = ({ currentMood }: MoodHeaderProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Mood: {currentMood}/4</span>
    </div>
  );
};
