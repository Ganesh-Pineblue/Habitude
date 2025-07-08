
// import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeBackProps {
  user: { name: string; email: string };
  onContinue: () => void;
}

export const WelcomeBack = ({ user, onContinue }: WelcomeBackProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center px-6 py-8">
      <div className="flex max-w-4xl w-full items-center justify-center">
        <div className="bg-green-500 rounded-3xl p-12 text-center max-w-2xl w-full shadow-2xl">
          {/* Robot Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src="/lovable-uploads/8616f0df-4a95-4ad0-96f8-07d77fcfc5fa.png"
                alt="AI Robot Assistant"
                className="w-40 h-40 object-contain animate-bounce"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to Habitual
          </h1>
          
          <p className="text-xl md:text-2xl text-green-100 mb-8">
            Let's get started with some information about you.
          </p>

          {/* User Name */}
          <div className="text-2xl md:text-3xl font-semibold text-white mb-12">
            {user.name}
          </div>

          {/* Next Button */}
          <Button 
            onClick={onContinue}
            className="bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-6 px-12 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Next
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
