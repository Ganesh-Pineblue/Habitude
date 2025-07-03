import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';

export const AddHabitButton = () => {
  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors duration-200 cursor-pointer group">
      <CardContent className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
              Add New Habit
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Let AI suggest personalized habits
            </p>
          </div>
          <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
